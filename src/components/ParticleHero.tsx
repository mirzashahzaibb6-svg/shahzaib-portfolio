"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

/**
 * Cinematic particle assembly: ~110k GPU particles scatter as dust, then form the head first
 * (hair, glasses, face), then neck, shoulders and body, from the density map in
 * /public/images/portrait-density.png (see scripts/make-density-map.py to regenerate it from a new photo).
 */
const VS = `attribute vec3 aTarget;attribute vec3 aStart;attribute vec4 aR;
uniform float uP,uT,uFig,uScale,uDpr,uFade,uSizeMul;uniform vec2 uView,uMouse;varying float vA;
float eio(float x){return x<.5?4.*x*x*x:1.-pow(-2.*x+2.,3.)/2.;}
void main(){
 vec3 st=vec3(aStart.xy*uView*.5,aStart.z*2.5);
 st.xy+=vec2(sin(uT*.22+aR.z*6.28),cos(uT*.18+aR.z*5.1))*.18;
 vec3 tg=aTarget*uFig;
 float t=clamp((uP-aR.x)/.29,0.,1.);float e=eio(t);if(aR.w>.5)e=0.;
 float arc=sin(e*3.14159);
 vec3 p=mix(st,tg,e);
 p.xy+=vec2(cos(aR.z*20.+uT*1.3),sin(aR.z*17.+uT*1.1))*arc*.55;
 p.z+=sin(aR.z*9.)*arc*1.4;
 float s=smoothstep(.92,1.,e);
 p+=vec3(sin(uT*.8+aR.z*40.),cos(uT*.7+aR.z*31.),sin(uT*.5+aR.z*23.))*.014*s;
 vec2 d=p.xy-uMouse;float m=exp(-dot(d,d)*7.);p.xy+=normalize(d+1e-4)*m*.3*s;
 vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
 float tw=.75+.25*sin(uT*2.+aR.z*50.);
 gl_PointSize=max(1.5*uDpr,aR.y*uSizeMul*uScale*uDpr/(-mv.z)*(1.+arc*.9)*tw);
 vA=uFade*(aR.w>.5?.4:mix(.55,1.,e))*clamp(1.-(mv.z+10.)*.02,.3,1.)*tw;}`;
const FS = `varying float vA;uniform float uPow,uAm;
void main(){float d=length(gl_PointCoord-.5);float a=pow(smoothstep(.5,0.,d),uPow);gl_FragColor=vec4(vec3(.93,.96,1.)*a*vA*uAm,1.);}`;

export default function ParticleHero({ active }: { active: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const playRef = useRef<() => void>(() => {});
  const activeRef = useRef(active);

  useEffect(() => {
    const el = host.current!;
    const mobile = window.innerWidth < 800;
    const N = mobile ? 50000 : 110000;
    const DUST = Math.floor(N * 0.12);
    const FN = Math.floor(N * 0.12);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const R = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
    R.setPixelRatio(dpr);
    R.setClearColor(0x030304, 1);
    R.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    el.appendChild(R.domElement);

    const sc = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    cam.position.z = 10;
    const FOV = Math.tan(THREE.MathUtils.degToRad(20));
    const U: Record<string, THREE.IUniform> = {
      uP: { value: 0 }, uT: { value: 0 }, uFade: { value: 0 }, uFig: { value: 6 },
      uView: { value: new THREE.Vector2(10, 7) }, uMouse: { value: new THREE.Vector2(9, 9) },
      uScale: { value: 500 }, uDpr: { value: dpr },
    };
    const mk = (sz: number, pw: number, am: number) =>
      new THREE.ShaderMaterial({
        vertexShader: VS, fragmentShader: FS,
        uniforms: { ...U, uSizeMul: { value: sz }, uPow: { value: pw }, uAm: { value: am } },
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      });

    let asp = 0.84, built = false, vis = true, raf = 0;
    let tl: gsap.core.Timeline | null = null;
    let geo: THREE.BufferGeometry | null = null;
    const mats: THREE.ShaderMaterial[] = [];

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      R.setSize(w, h, false);
      cam.aspect = w / h; cam.updateProjectionMatrix();
      const vh = 2 * FOV * cam.position.z, vw = vh * cam.aspect;
      U.uView.value.set(vw, vh);
      U.uFig.value = Math.min(vh * 0.92, (vw * 1.12) / asp);
      U.uScale.value = h / (2 * FOV);
    };

    const play = () => {
      tl?.kill();
      U.uP.value = 0; U.uFade.value = 0;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      tl = gsap.timeline();
      tl.to(U.uFade, { value: 1, duration: reduce ? 0.01 : 1.6, ease: "power2.out" })
        .to(U.uP, { value: 1, duration: reduce ? 0.01 : 9, ease: "power1.inOut" }, reduce ? 0 : 0.8);
    };
    playRef.current = play;

    const build = (img: HTMLImageElement) => {
      const W = img.width, H = img.height;
      asp = W / H;
      const cx = document.createElement("canvas"); cx.width = W; cx.height = H;
      const g = cx.getContext("2d")!; g.drawImage(img, 0, 0);
      const D = g.getImageData(0, 0, W, H).data;
      const T = new Float32Array(N * 3), S = new Float32Array(N * 3), A = new Float32Array(N * 4);
      let n = 0;
      // body pass: density ^ 2 for contrast
      for (let tries = 0; n < N - DUST - FN && tries < N * 400; tries++) {
        const x = (Math.random() * W) | 0, y = (Math.random() * H) | 0, d = D[(y * W + x) * 4] / 255;
        if (Math.random() > Math.pow(d, 2.0)) continue;
        const px = (x + Math.random()) / W - 0.5, py = 0.5 - (y + Math.random()) / H;
        T.set([px * asp, py, (d - 0.5) * 0.12 + (Math.random() - 0.5) * 0.03], n * 3);
        A.set([(0.5 - py) * 0.5 + Math.abs(px) * 0.07 + Math.random() * 0.1, 0.010 + Math.random() * 0.006, Math.random(), 0], n * 4);
        n++;
      }
      // face pass: extra particles inside the face ellipse so features read clearly
      for (let k = 0, tr = 0; k < FN && tr < FN * 300; tr++) {
        const u = Math.random() * 2 - 1, v = Math.random() * 2 - 1;
        if (u * u + v * v > 1) continue;
        const x = Math.min(W - 1, Math.max(0, (0.556 + u * 0.19) * W)) | 0;
        const y = Math.min(H - 1, Math.max(0, (0.231 + v * 0.21) * H)) | 0;
        const d = D[(y * W + x) * 4] / 255;
        if (Math.random() > Math.pow(d, 1.7)) continue;
        const px = x / W - 0.5, py = 0.5 - y / H;
        T.set([px * asp, py, (d - 0.5) * 0.12], n * 3);
        A.set([(0.5 - py) * 0.5 + Math.random() * 0.08, 0.008 + Math.random() * 0.005, Math.random(), 0], n * 4);
        n++; k++;
      }
      for (let i = 0; i < N; i++) {
        if (i >= n) { T.set([0, 0, 0], i * 3); A.set([0, 0.008 + Math.random() * 0.008, Math.random(), 1], i * 4); }
        S.set([Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1], i * 3);
      }
      geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
      geo.setAttribute("aTarget", new THREE.BufferAttribute(T, 3));
      geo.setAttribute("aStart", new THREE.BufferAttribute(S, 3));
      geo.setAttribute("aR", new THREE.BufferAttribute(A, 4));
      geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100);
      const core = mk(1, 1.15, 1.0), glow = mk(2.6, 3.5, 0.13);
      mats.push(core, glow);
      sc.add(new THREE.Points(geo, glow), new THREE.Points(geo, core));
      built = true; resize();
      if (activeRef.current) play();
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect(), vh = 2 * FOV * 10, vw = vh * cam.aspect;
      U.uMouse.value.set(((e.clientX - r.left) / r.width - 0.5) * vw, (0.5 - (e.clientY - r.top) / r.height) * vh);
    };
    const onLeave = () => U.uMouse.value.set(9, 9);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    const io = new IntersectionObserver((es) => { vis = es[0].isIntersecting; });
    io.observe(el);

    const clock = new THREE.Clock();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      U.uT.value = clock.getElapsedTime();
      if (vis && built) R.render(sc, cam);
    };
    resize(); loop();

    const img = new Image();
    img.onload = () => build(img);
    img.src = "/images/portrait-density.png";

    return () => {
      cancelAnimationFrame(raf); tl?.kill(); io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      geo?.dispose(); mats.forEach((m) => m.dispose()); R.dispose();
      R.domElement.remove();
    };
  }, []);

  useEffect(() => { activeRef.current = active; if (active) playRef.current(); }, [active]);

  return <div ref={host} className="absolute inset-0" aria-hidden />;
}

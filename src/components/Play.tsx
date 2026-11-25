"use client";
import { useEffect, useRef, useState } from "react";

const W = 900, H = 440, GAP = 9;
type UI = "idle" | "playing" | "won" | "lost";

export default function Play() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ui, setUi] = useState<UI>("idle");
  const resetRef = useRef<() => void>(() => {});

  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    c.width = W * dpr; c.height = H * dpr; ctx.scale(dpr, dpr);

    const S = { bricks: [] as { x: number; y: number }[], bx: W / 2, by: H - 40, vx: 0, vy: 0, px: W / 2, pw: 120, state: "idle" as UI };
    const build = () => {
      const o = document.createElement("canvas"); o.width = W; o.height = 260;
      const g = o.getContext("2d")!;
      g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle";
      g.font = "900 118px Arial Black, Arial, sans-serif";
      g.fillText("CODE THAT", W / 2, 70); g.fillText("SHIPS", W / 2, 190);
      const d = g.getImageData(0, 0, W, 260).data; S.bricks = [];
      for (let y = 0; y < 260; y += GAP) for (let x = 0; x < W; x += GAP) if (d[(y * W + x) * 4 + 3] > 128) S.bricks.push({ x, y: y + 16 });
    };
    const set = (s: UI) => { S.state = s; setUi(s); };
    const reset = () => { build(); S.vx = 0; S.vy = 0; S.state = "idle"; setUi("idle"); };
    resetRef.current = reset; reset();

    const launch = () => { if (S.state === "idle") { S.vx = 3.2 * (Math.random() > 0.5 ? 1 : -1); S.vy = -5.2; set("playing"); } };
    const rel = (clientX: number) => { const r = c.getBoundingClientRect(); S.px = Math.max(S.pw / 2, Math.min(W - S.pw / 2, ((clientX - r.left) / r.width) * W)); };
    const onMove = (e: PointerEvent) => rel(e.clientX);
    const onDown = (e: PointerEvent) => { rel(e.clientX); launch(); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") S.px = Math.max(S.pw / 2, S.px - 40);
      if (e.key === "ArrowRight") S.px = Math.min(W - S.pw / 2, S.px + 40);
      if (e.key === " " && ref.current && ref.current.matches(":focus")) { e.preventDefault(); launch(); }
    };
    c.addEventListener("pointermove", onMove); c.addEventListener("pointerdown", onDown); c.addEventListener("keydown", onKey);

    let raf = 0;
    const loop = () => {
      const r = 5;
      if (S.state === "idle") { S.bx = S.px; S.by = H - 40; }
      if (S.state === "playing") {
        S.bx += S.vx; S.by += S.vy;
        if (S.bx < r || S.bx > W - r) S.vx *= -1;
        if (S.by < r) S.vy *= -1;
        if (S.vy > 0 && S.by > H - 36 && S.by < H - 24 && Math.abs(S.bx - S.px) < S.pw / 2 + r) {
          S.vy = -Math.abs(S.vy); S.vx = ((S.bx - S.px) / (S.pw / 2)) * 5;
        }
        for (let i = 0; i < S.bricks.length; i++) {
          const b = S.bricks[i];
          if (Math.abs(S.bx - b.x) < GAP / 2 + r && Math.abs(S.by - b.y) < GAP / 2 + r) { S.bricks.splice(i, 1); S.vy *= -1; break; }
        }
        if (!S.bricks.length) set("won");
        if (S.by > H + 10) set("lost");
      }
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#f4f4f6";
      for (const b of S.bricks) { ctx.beginPath(); ctx.arc(b.x, b.y, 2.7, 0, 6.283); ctx.fill(); }
      ctx.fillStyle = "#e5232d"; ctx.fillRect(S.px - S.pw / 2, H - 28, S.pw, 8);
      ctx.fillStyle = "#f26b3a"; ctx.shadowColor = "#f26b3a"; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.arc(S.bx, S.by, r, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); c.removeEventListener("pointermove", onMove); c.removeEventListener("pointerdown", onDown); c.removeEventListener("keydown", onKey); };
  }, []);

  return (
    <section id="play" className="section">
      <div className="text-center">
        <p className="label mb-3 text-accent">● Interactive · Break stuff</p>
        <h2 className="chrome font-display text-[clamp(2rem,6vw,4.5rem)] font-extrabold uppercase tracking-tight">Break it if you can</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/55">Move your mouse or finger to steer the paddle. Click to launch the ball.</p>
      </div>
      <div className="glass relative mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl p-3 md:p-6">
        <canvas ref={ref} tabIndex={0} aria-label="Dot-matrix breakout game" className="block aspect-[900/440] w-full cursor-crosshair touch-none outline-none" />
        {(ui === "won" || ui === "lost") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/70 backdrop-blur-sm">
            <p className="chrome font-display text-3xl font-extrabold uppercase md:text-5xl">{ui === "won" ? "Shipped." : "Missed it"}</p>
            <button onClick={() => resetRef.current()} className="rounded-full bg-accent px-6 py-3 text-[.65rem] font-bold uppercase tracking-[.2em] hover:scale-105 transition">Play again</button>
          </div>
        )}
      </div>
    </section>
  );
}

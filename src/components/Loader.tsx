"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAME = "SHAHZAIB";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function scramble(to: string, set: (s: string) => void, ms: number) {
  return new Promise<void>((res) => {
    const start = performance.now();
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / ms);
      const fixed = Math.floor(p * to.length);
      set(to.split("").map((c, i) => (i < fixed || c === " " ? c : CHARS[Math.floor(Math.random() * 26)])).join(""));
      p < 1 ? requestAnimationFrame(tick) : res();
    };
    tick();
  });
}
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Stylish serif-italic silver letter (same chrome colour as the name) that drops in from above with a bounce. */
function Fancy({ ch, drop, delay, size }: { ch: string; drop: boolean; delay: number; size: string }) {
  return (
    <span className="relative inline-block" style={{ fontSize: size }}>
      <span className="invisible font-serif font-normal italic leading-none">{ch}</span>
      <motion.span
        aria-hidden
        initial={{ y: -170, opacity: 0, rotate: -14 }}
        animate={drop ? { y: 0, opacity: 1, rotate: 0 } : {}}
        transition={{ type: "spring", stiffness: 170, damping: 11, delay }}
        className="absolute inset-0 inline-block bg-gradient-to-b from-white via-[#d5d8e2] to-[#6f7382] bg-clip-text font-serif font-normal italic leading-none text-transparent drop-shadow-[0_0_18px_rgba(255,255,255,.2)]"
      >
        {ch}
      </motion.span>
    </span>
  );
}

export default function Loader() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"plain" | "name">("plain");
  const [drop, setDrop] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    let dead = false;
    document.body.style.overflow = "hidden";
    (async () => {
      await wait(900);                          // the dot
      setMode("name");
      await scramble(NAME, setText, 1100);
      if (dead) return;
      setDrop(true);                            // S and I fall in from above
      await wait(2300);                         // name stays on screen
      if (dead) return;
      setDrop(false); setMode("plain");
      await scramble("PORTFOLIO", setText, 800);
      await wait(350);
      if (dead) return;
      setShow(false);
      document.body.style.overflow = "";
      window.dispatchEvent(new Event("loader:done"));
    })();
    return () => { dead = true; document.body.style.overflow = ""; };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030304]" exit={{ opacity: 0 }} transition={{ duration: 0.7 }}>
          {text === "" ? (
            <motion.span className="h-3 w-3 rounded-full bg-white shadow-[0_0_40px_12px_rgba(255,255,255,.25)]" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} />
          ) : (
            <h1 className="chrome font-display text-[clamp(2.2rem,11vw,7rem)] font-extrabold tracking-tight">
              {mode === "name"
                ? NAME.split("").map((c, i) =>
                    i === 0 ? <Fancy key={i} ch={c} drop={drop} delay={0} size="1.2em" />
                    : i === 6 ? <Fancy key={i} ch={c} drop={drop} delay={0.3} size="1.5em" />
                    : <span key={i}>{text[i] ?? c}</span>)
                : text}
            </h1>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

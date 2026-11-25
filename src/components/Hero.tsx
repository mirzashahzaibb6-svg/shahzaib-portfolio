"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ParticleHero from "./ParticleHero";
import { site } from "@/data/site";

export default function Hero() {
  const [go, setGo] = useState(false);
  useEffect(() => {
    const on = () => setGo(true);
    addEventListener("loader:done", on);
    return () => removeEventListener("loader:done", on);
  }, []);

  return (
    <section id="home" className="relative flex min-h-[100svh] items-end justify-center overflow-hidden pb-[12vh] md:pb-[9vh]">
      <ParticleHero active={go} />


      <div className="relative z-10 w-full px-4 text-center md:px-10 md:text-left">
        <motion.h1
          initial={{ y: "40%", opacity: 0 }}
          animate={go ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="chrome font-display text-[clamp(2.6rem,14.5vw,15rem)] font-extrabold leading-[.9] tracking-tighter"
        >
          PORTFOLIO
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={go ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1, duration: 0.8 }}
          className="mt-3 text-sm md:text-base">
          <span className="font-bold">Full Stack</span> <span className="font-serif text-lg italic text-white/80 md:text-xl">Developer</span>
          <span className="label ml-4 hidden md:inline">{site.name} · {site.location}</span>
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={go ? { opacity: 1 } : {}} transition={{ delay: 1.4 }} className="mt-8 flex justify-center gap-3 md:justify-start">
          <a href="#projects" className="rounded-full bg-accent px-6 py-3 text-[.65rem] font-bold uppercase tracking-[.2em] transition hover:scale-105 hover:shadow-[0_0_30px_rgba(229,35,45,.5)]">View Projects</a>
          <a href="#contact" className="rounded-full border border-white/25 px-6 py-3 text-[.65rem] font-bold uppercase tracking-[.2em] transition hover:border-accent hover:text-accent">Contact</a>
        </motion.div>
      </div>
      <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 md:block"><span className="label">Scroll</span></div>
    </section>
  );
}

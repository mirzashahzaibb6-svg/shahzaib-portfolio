"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { nav, site } from "@/data/site";

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    nav.forEach((id) => { const el = document.getElementById(id); el && io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <motion.header initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 5.4, duration: 0.8 }}
      className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]">
      <div className="mx-auto flex max-w-[100rem] items-center justify-between px-5 py-4 md:px-10">
        <a href="#home" className="text-sm font-extrabold uppercase tracking-wider">{site.name}</a>
        <nav className="hidden gap-7 md:flex">
          {nav.map((n) => (
            <a key={n} href={`#${n}`} className={`text-[.62rem] font-semibold uppercase tracking-[.18em] transition-colors hover:text-accent ${active === n ? "text-accent" : "text-white/80"}`}>{n}</a>
          ))}
        </nav>
        <button aria-label="Menu" onClick={() => setOpen(!open)} className="flex h-8 w-8 flex-col items-end justify-center gap-1.5 md:hidden">
          <span className={`h-px w-6 bg-white transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <span className={`h-px bg-white transition-all ${open ? "w-6 -translate-y-[3.5px] -rotate-45" : "w-4"}`} />
        </button>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-accent via-accent/40 to-transparent" />
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-black/95 md:hidden">
            <div className="flex flex-col gap-5 px-5 py-6">
              {nav.map((n) => (
                <a key={n} href={`#${n}`} onClick={() => setOpen(false)} className={`text-sm font-semibold uppercase tracking-[.2em] ${active === n ? "text-accent" : "text-white/80"}`}>{n}</a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

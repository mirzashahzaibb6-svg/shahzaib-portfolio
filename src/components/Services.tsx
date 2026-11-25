"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { services } from "@/data/site";
import { useReveal } from "./useReveal";

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, "[data-reveal]", 0.05);
  return (
    <section id="services" ref={ref} className="section">
      <h2 data-reveal className="chrome ml-auto max-w-3xl text-right font-display text-[clamp(2.4rem,8vw,6rem)] font-extrabold uppercase leading-[.95] tracking-tight">
        What I<br />can do
      </h2>
      <ul className="mt-14 border-t border-white/15">
        {services.map((s, i) => (
          <motion.li key={s} data-reveal whileHover="hover" initial="rest" className="relative overflow-hidden border-b border-white/15">
            <motion.span variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }} style={{ originX: 0 }} className="absolute inset-0 bg-accent/10" />
            <div className="relative flex items-center gap-4 py-5 md:gap-10 md:py-6">
              <span className="label w-8 shrink-0 text-accent">{String(i + 1).padStart(2, "0")}</span>
              <motion.span variants={{ rest: { x: 0 }, hover: { x: 14 } }} transition={{ duration: 0.35 }} className="flex-1 font-display text-sm font-bold uppercase tracking-wide md:text-lg">{s}</motion.span>
              <motion.span variants={{ rest: { rotate: 0 }, hover: { rotate: 45, scale: 1.2 } }} className="text-accent"><FiArrowUpRight size={20} /></motion.span>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

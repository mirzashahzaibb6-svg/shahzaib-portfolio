"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { skillGroups } from "@/data/site";
import { FiCode } from "react-icons/fi";
import { skillIcons } from "./skillIcons";
import { useReveal } from "./useReveal";

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, "[data-reveal]", 0.04);
  return (
    <section id="skills" ref={ref} className="section">
      <p data-reveal className="label mb-4">/ Toolkit · 30 skills</p>
      <h2 data-reveal className="chrome font-display text-[clamp(3rem,10vw,8rem)] font-extrabold uppercase leading-none tracking-tighter">Skills</h2>
      <div className="mt-16 space-y-14">
        {skillGroups.map((g) => (
          <div key={g.group}>
            <p data-reveal className="mb-5 flex items-center gap-4 text-xs font-bold uppercase tracking-[.2em] text-white/70">
              <span className="h-px w-8 bg-accent" />{g.group}<span className="label">{String(g.skills.length).padStart(2, "0")}</span>
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {g.skills.map((s) => {
                const [Icon, color] = skillIcons[s] ?? [FiCode, "#ffffff"];
                return (
                  <motion.div key={s} data-reveal whileHover={{ y: -8, scale: 1.03 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="glass group flex flex-col items-center gap-3 rounded-2xl px-3 py-6 transition-colors hover:border-white/30"
                    style={{ ["--c" as string]: color }}>
                    <Icon size={38} style={{ color }} className="transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_14px_var(--c)]" />
                    <span className="text-center text-xs font-semibold tracking-wide text-white/85">{s}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

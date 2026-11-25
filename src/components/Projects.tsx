"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { projects } from "@/data/site";
import { useReveal } from "./useReveal";

export default function Projects() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, "[data-reveal]", 0.1);
  return (
    <section id="projects" ref={ref} className="section">
      <p data-reveal className="label mb-4 text-accent">/ Production · Studio</p>
      <h2 data-reveal className="chrome font-display text-[clamp(2.4rem,8vw,6rem)] font-extrabold uppercase leading-[.95] tracking-tight">Featured<br />Engineering</h2>
      <div className="mt-20 space-y-24 md:space-y-32">
        {projects.map((p, i) => (
          <motion.article key={p.index} data-reveal whileHover="hover" initial="rest" className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
              <motion.img variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                src={p.image} alt={`${p.title} ${p.accent}`} className="aspect-[3/2] w-full object-cover" loading="lazy" />
            </div>
            <div>
              <p className="label text-accent">{p.index} / {String(projects.length).padStart(2, "0")} &nbsp;·&nbsp; {p.tag}</p>
              <h3 className="mt-4 font-display text-4xl font-extrabold uppercase leading-none md:text-6xl">
                {p.title} <span className="font-serif font-normal normal-case italic text-white/85">{p.accent}</span>
              </h3>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60 md:text-base">{p.desc}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                {p.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-[.65rem] font-bold uppercase tracking-[.2em] transition hover:border-accent hover:bg-accent">
                    {l.label} <FiArrowUpRight className="transition group-hover:rotate-45" />
                  </a>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

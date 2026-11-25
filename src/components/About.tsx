"use client";
import { useRef } from "react";
import { site, education, experience } from "@/data/site";
import { useReveal } from "./useReveal";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section id="about" ref={ref} className="section">
      <div className="grid items-center gap-12 md:grid-cols-[1.1fr_1fr]">
        <div data-reveal>
          <p className="label mb-4">/ About me</p>
          <h2 className="chrome font-display text-[clamp(4rem,16vw,12rem)] font-extrabold leading-none tracking-tighter">Intro</h2>
        </div>
        <div data-reveal className="glass rounded-2xl p-6 text-sm leading-relaxed text-white/80 md:p-8 md:text-base">
          <p>{site.bio}</p>
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
            <div><p className="label">Location</p><p className="mt-1 text-sm">{site.location}</p></div>
            <div><p className="label">Languages</p><p className="mt-1 text-sm">{site.languages.join(" · ")}</p></div>
          </div>
        </div>
      </div>

      <div className="mt-24 grid gap-10 md:grid-cols-2">
        <div>
          <p data-reveal className="label mb-5">/ Education</p>
          <div className="space-y-3">
            {education.map((e) => (
              <div key={e.title} data-reveal className="glass group flex items-center justify-between rounded-xl px-5 py-5 transition-colors hover:border-accent/60">
                <span className="font-display text-xl font-bold md:text-2xl">{e.title}</span>
                <span className="font-serif text-lg italic text-white/60 transition-colors group-hover:text-accent">{e.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p data-reveal className="label mb-5">/ Experience</p>
          {experience.map((x) => (
            <div key={x.role} data-reveal className="glass rounded-xl px-5 py-5 transition-colors hover:border-accent/60">
              <div className="flex items-start justify-between gap-4">
                <span className="font-display text-xl font-bold md:text-2xl">{x.role}</span>
                <span className="label whitespace-nowrap rounded-full border border-accent/50 px-3 py-1 text-accent">{x.duration}</span>
              </div>
              <p className="mt-3 text-sm text-white/60">{x.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";
import { useLayoutEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Reveals every element matching `selector` inside `ref` with a staggered fade-up when scrolled into view. */
export function useReveal(ref: RefObject<HTMLElement>, selector = "[data-reveal]", stagger = 0.08) {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(selector, {
        y: 50, opacity: 0, duration: 1, ease: "power3.out", stagger, clearProps: "opacity,transform",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, [ref, selector, stagger]);
}

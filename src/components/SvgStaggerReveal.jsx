// src/components/SvgStaggerReveal.jsx
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SvgStaggerReveal({
  src,
  className = "",
  once = true,
  stagger = 0.055,
  duration = 0.55,
  y = 10,
  ease = "power3.out",
  rootMargin = "0px 0px -12% 0px",
}) {
  const hostRef = useRef(null);
  const playedRef = useRef(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !src) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    const ac = new AbortController();

    const load = async () => {
      const r = await fetch(src, { signal: ac.signal });
      const text = await r.text();
      if (!host) return;

      host.innerHTML = text;

      const svg = host.querySelector("svg");
      if (!svg) return;

      svg.setAttribute("focusable", "false");
      svg.setAttribute("aria-hidden", "true");

      // ✅ 文字単位候補：g[id^="L"] があれば最優先（Figmaで文字ごとにグループ推奨）
      let letters = Array.from(svg.querySelectorAll('g[id^="L"], g[id^="l"]'));

      // fallback：gが無ければpath単位（粗いが最低限は動く）
      if (!letters.length) letters = Array.from(svg.querySelectorAll("g"));

      if (!letters.length) letters = Array.from(svg.querySelectorAll("path"));

      if (!letters.length) return;

      // 左→右順に並べ替え（BBoxでxソート）
      const sorted = letters
        .map((el) => {
          let x = 0;
          try {
            const b = el.getBBox();
            x = b.x + b.width / 2;
          } catch {
            x = 0;
          }
          return { el, x };
        })
        .sort((a, b) => a.x - b.x)
        .map((o) => o.el);

      // reduced-motion は即表示
      if (reduce) {
        gsap.set(sorted, { opacity: 1, y: 0, clearProps: "filter,transform" });
        return;
      }

      const play = () => {
        if (once && playedRef.current) return;
        playedRef.current = true;

        gsap.killTweensOf(sorted);

        gsap.set(sorted, {
          opacity: 0,
          y,
          filter: "blur(0.22px)",
          transformOrigin: "50% 50%",
        });

        gsap.to(sorted, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration,
          ease,
          stagger,
          overwrite: true,
        });
      };

      // inview で起動（Works用）
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) {
                play();
                if (once) io.disconnect();
              }
            }
          },
          { threshold: 0.12, rootMargin }
        );

        io.observe(host);
        return () => io.disconnect();
      }

      // fallback
      play();
    };

    load().catch(() => {});

    return () => {
      ac.abort();
      if (host) host.innerHTML = "";
    };
  }, [src, once, stagger, duration, y, ease, rootMargin]);

  return <span ref={hostRef} className={className} />;
}
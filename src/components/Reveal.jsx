import { useEffect, useMemo, useRef } from "react";
import styles from "./Reveal.module.css";

export default function Reveal({
  as: Tag = "div",
  children,
  className = "",
  delay = 0,
  preset = "base", // base | slow
  y = 18,
}) {
  const ref = useRef(null);

  const vars = useMemo(() => {
    const dur = preset === "slow" ? 0.92 : 0.66;
    return {
      "--rv-delay": `${delay}s`,
      "--rv-dur": `${dur}s`,
      "--rv-y": `${y}px`,
    };
  }, [delay, preset, y]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    if (reduce || !("IntersectionObserver" in window)) {
      el.dataset.inview = "1";
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.dataset.inview = "1";
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${className}`}
      style={vars}
      data-inview="0"
    >
      {children}
    </Tag>
  );
}
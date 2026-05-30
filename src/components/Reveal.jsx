// src/components/Reveal.jsx
import { useEffect, useMemo, useRef } from "react";
import styles from "./Reveal.module.css";

/* -------------------------------------------------------
  Shared IntersectionObserver (same options -> one instance)
------------------------------------------------------- */
const OBSERVER_POOL = new Map(); // key -> { io, elements:Set }

function getObserver({ rootMargin, threshold }) {
  const key = `${rootMargin}|${threshold}`;

  if (OBSERVER_POOL.has(key)) return OBSERVER_POOL.get(key);

  const elements = new Set();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target;
        el.dataset.inview = "1";
        io.unobserve(el);
        elements.delete(el);
      }
    },
    { threshold, rootMargin }
  );

  const bundle = { io, elements };
  OBSERVER_POOL.set(key, bundle);
  return bundle;
}

export default function Reveal({
  as: Tag = "div",
  children,
  className = "",

  delay = 0,
  preset = "base", // base | slow
  y = 18,

  once = true,
  threshold = 0.14,
  rootMargin = "0px 0px -10% 0px",
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

    // reduce / no IO -> 即表示
    if (reduce || !("IntersectionObserver" in window)) {
      el.dataset.inview = "1";
      return;
    }

    // 既に表示範囲内なら即（hash遷移直後の“効いてない感”回避）
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
      el.dataset.inview = "1";
      return;
    }

    const bundle = getObserver({ rootMargin, threshold });
    bundle.elements.add(el);
    bundle.io.observe(el);

    return () => {
      try {
        bundle.io.unobserve(el);
      } catch {}
      bundle.elements.delete(el);
      // 空になったobserverは残してOK（再利用の方が速い）
    };
  }, [rootMargin, threshold, once]);

  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${className}`}
      style={vars}
      data-inview="0"
      data-preset={preset}   // ✅ これが最重要。slowが生きる。
    >
      {children}
    </Tag>
  );
}
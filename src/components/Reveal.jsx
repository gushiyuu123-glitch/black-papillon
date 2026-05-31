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
        const el = e.target;

        // once=false のときは出たり入ったりで更新
        // once=true のときは入った瞬間に確定してunobserve
        if (e.isIntersecting) {
          el.dataset.inview = "1";

          const once = el.dataset.rvOnce === "1";
          if (once) {
            io.unobserve(el);
            elements.delete(el);
          }
        } else {
          // once=falseのみ戻す（once=trueは一度出たら固定）
          const once = el.dataset.rvOnce === "1";
          if (!once) el.dataset.inview = "0";
        }
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

    // ✅ 「hash遷移直後の効いてない感回避」は必要な時だけ
    // 初回ロードで大量に getBoundingClientRect を叩かない
    const hasHash = window.location.hash?.length > 1;
    const resumed = window.scrollY > 0;

    if (hasHash || resumed) {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
        el.dataset.inview = "1";
        return;
      }
    }

    // once情報をobserver側に渡す（共有IOでも要素ごとに挙動を変えられる）
    el.dataset.rvOnce = once ? "1" : "0";

    const bundle = getObserver({ rootMargin, threshold });
    bundle.elements.add(el);

    // ✅ 初期入力（タップ/スクロール）を邪魔しないように1フレーム逃がす
    const raf = requestAnimationFrame(() => {
      bundle.io.observe(el);
    });

    return () => {
      cancelAnimationFrame(raf);
      try {
        bundle.io.unobserve(el);
      } catch {}
      bundle.elements.delete(el);
    };
  }, [rootMargin, threshold, once]);

  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${className}`}
      style={vars}
      data-inview="0"
      data-preset={preset} // ✅ これが最重要。slowが生きる。
      data-rv-once={once ? "1" : "0"}
    >
      {children}
    </Tag>
  );
}
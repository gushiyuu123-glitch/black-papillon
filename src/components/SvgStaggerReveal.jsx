// src/components/SvgStaggerReveal.jsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

/* -------------------------------------------------------
  SVG cache (same src -> no refetch)
------------------------------------------------------- */
const SVG_CACHE = new Map();

/* -------------------------------------------------------
  helpers
------------------------------------------------------- */
function safeNum(v, fallback = 0) {
  return Number.isFinite(v) ? v : fallback;
}

function pickTargets(svg, { maxPathTargets = 140 }) {
  // 1) Figma想定：文字ごとグループ
  let t = Array.from(svg.querySelectorAll('g[id^="L"], g[id^="l"]'));
  if (t.length >= 2) return t;

  // 2) g 単位
  t = Array.from(svg.querySelectorAll("svg > g"));
  if (t.length >= 2) return t;

  // 3) path 単位（ただし重いSVGは避ける）
  const paths = Array.from(svg.querySelectorAll("path"));
  if (paths.length >= 2 && paths.length <= maxPathTargets) return paths;

  // 4) 最終手段：svg全体（重さ回避）
  return [svg];
}

function sortLeftToRight(els) {
  // BBoxでxソート（SVGによっては例外が出るのでガード）
  const scored = els.map((el) => {
    let x = 0;
    try {
      const b = el.getBBox();
      x = b.x + b.width / 2;
    } catch {
      // fallback: DOMRect
      try {
        const r = el.getBoundingClientRect();
        x = r.left + r.width / 2;
      } catch {
        x = 0;
      }
    }
    return { el, x: safeNum(x, 0) };
  });

  scored.sort((a, b) => a.x - b.x);
  return scored.map((o) => o.el);
}

/* -------------------------------------------------------
  component
------------------------------------------------------- */
export default function SvgStaggerReveal({
  src,
  className = "",

  once = true,
  stagger = 0.055,
  duration = 0.55,
  y = 10,
  ease = "power3.out",

  rootMargin = "0px 0px -12% 0px",

  // safety
  maxPathTargets = 140,

  // optional (必要になったら使える)
  selector = "", // e.g. 'g[id^="L"]'
}) {
  const hostRef = useRef(null);
  const ioRef = useRef(null);
  const tlRef = useRef(null);
  const playedRef = useRef(false);
  const abortRef = useRef(null);

  const [markup, setMarkup] = useState("");

  // srcが変わったら再ロード（キャッシュあり）
  useEffect(() => {
    if (!src) {
      setMarkup("");
      return;
    }

    if (SVG_CACHE.has(src)) {
      setMarkup(SVG_CACHE.get(src));
      return;
    }

    abortRef.current?.abort?.();
    const ac = new AbortController();
    abortRef.current = ac;

    fetch(src, { signal: ac.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch SVG: ${r.status}`);
        return r.text();
      })
      .then((text) => {
        SVG_CACHE.set(src, text);
        setMarkup(text);
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setMarkup("");
      });

    return () => ac.abort();
  }, [src]);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host || !markup) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    // StrictMode対策：残骸を必ず掃除
    ioRef.current?.disconnect?.();
    ioRef.current = null;
    tlRef.current?.kill?.();
    tlRef.current = null;

    // markup反映
    host.innerHTML = markup;

    const svg = host.querySelector("svg");
    if (!svg) return;

    svg.setAttribute("focusable", "false");
    svg.setAttribute("aria-hidden", "true");

    // targets
    let targets = selector
      ? Array.from(svg.querySelectorAll(selector))
      : [];

    if (targets.length < 2) {
      targets = pickTargets(svg, { maxPathTargets });
    }

    // 左→右順
    const sorted = sortLeftToRight(targets);

    // reduced-motion は即表示
    if (reduce) {
      gsap.set(sorted, { opacity: 1, y: 0, clearProps: "filter,transform" });
      playedRef.current = true;
      return;
    }

    const play = () => {
      if (once && playedRef.current) return;
      playedRef.current = true;

      gsap.killTweensOf(sorted);
      tlRef.current?.kill?.();

      gsap.set(sorted, {
        opacity: 0,
        y,
        filter: "blur(0.22px)",
        transformOrigin: "50% 50%",
        willChange: "transform,opacity,filter",
      });

      const tl = gsap.timeline({ defaults: { ease } });
      tl.to(sorted, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration,
        stagger,
        overwrite: true,
        clearProps: "filter,willChange",
      });

      tlRef.current = tl;
    };

    // inview
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
      ioRef.current = io;

      return () => {
        io.disconnect();
        ioRef.current = null;
        tlRef.current?.kill?.();
        tlRef.current = null;
      };
    }

    // fallback
    play();

    return () => {
      tlRef.current?.kill?.();
      tlRef.current = null;
    };
  }, [markup, once, stagger, duration, y, ease, rootMargin, maxPathTargets, selector]);

  // srcが変わった時は一度だけ再生状態を戻す
  useEffect(() => {
    playedRef.current = false;
  }, [src]);

  return <span ref={hostRef} className={className} aria-hidden="true" />;
}
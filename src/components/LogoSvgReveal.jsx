import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

/* -------------------------------------------------------
  SVG cache (same src -> no refetch)
------------------------------------------------------- */
const SVG_CACHE = new Map();

/* stable-ish seed from string (for deterministic shuffle) */
function hashStr(str = "") {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) || 1;
}
function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffleInPlace(arr, seed) {
  const rnd = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* -------------------------------------------------------
  target picker
------------------------------------------------------- */
function pickTargets(svg, { selector, minTargets = 3, maxPathTargets = 140, fallback = "svg" }) {
  // 0) explicit selector
  if (selector) {
    const picked = Array.from(svg.querySelectorAll(selector));
    if (picked.length >= minTargets) return picked;
  }

  // 1) top-level <g> (Figma: letter per group)
  let targets = Array.from(svg.children).filter(
    (el) => el.tagName?.toLowerCase() === "g"
  );
  if (targets.length >= minTargets) return targets;

  // 2) common letter ids
  targets = Array.from(svg.querySelectorAll('g[id^="L"], g[id^="letter"], g[data-letter]'));
  if (targets.length >= minTargets) return targets;

  // 3) fallback: paths (BUT guard for heavy SVG)
  const paths = Array.from(svg.querySelectorAll("path"));
  if (paths.length >= minTargets && paths.length <= maxPathTargets) return paths;

  // 4) last resort: animate whole svg (avoids “path地獄”)
  if (fallback === "svg") return [svg];
  return paths.slice(0, maxPathTargets);
}

/* -------------------------------------------------------
  component
------------------------------------------------------- */
export default function LogoSvgReveal({
  src,
  className = "",

  // timing
  startDelay = 0.12,
  stagger = 0.07,
  dur = 0.68,

  // motion
  dist = 18,               // px
  scaleFrom = 0.995,
  ease = "power3.out",

  // advanced
  selector = "",           // e.g. 'g[id^="L"]'
  shuffle = false,         // randomize order (deterministic)
  maxPathTargets = 140,    // safety guard
  fallback = "svg",        // "svg" | "paths"
  onReady,                 // (svgEl)=>void
  onComplete,              // ()=>void
}) {
  const wrapRef = useRef(null);
  const tlRef = useRef(null);
  const abortRef = useRef(null);
  const [markup, setMarkup] = useState("");

  useEffect(() => {
    if (!src) {
      setMarkup("");
      return;
    }

    // cache hit
    if (SVG_CACHE.has(src)) {
      setMarkup(SVG_CACHE.get(src));
      return;
    }

    // abort previous (このインスタンスの fetch のみ)
    abortRef.current?.abort?.();
    const ac = new AbortController();
    abortRef.current = ac;

    fetch(src, { signal: ac.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch SVG: ${r.status}`);
        return r.text();
      })
      .then((txt) => {
        SVG_CACHE.set(src, txt);
        setMarkup(txt);
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setMarkup("");
      });

    return () => ac.abort();
  }, [src]);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !markup) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    const svg = wrap.querySelector("svg");
    if (!svg) return;

    // make svg inert for a11y（親側でsrOnly等を用意する想定）
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    // kill previous timeline
    tlRef.current?.kill();
    tlRef.current = null;

    // pick targets
    let targets = pickTargets(svg, {
      selector,
      minTargets: 3,
      maxPathTargets,
      fallback,
    });

    // deterministic shuffle (毎回同じ“署名”の順)
    if (shuffle && targets.length > 1) {
      targets = [...targets];
      shuffleInPlace(targets, hashStr(src));
    }

    // reduced: show immediately（+ callbackも呼ぶ）
    if (reduce) {
      gsap.set(targets, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        clearProps: "transform,filter,opacity",
      });
      onReady?.(svg);
      onComplete?.();
      return;
    }

    // directions (multi-direction)
    const dirs = [
      { x: 0, y: dist },
      { x: 0, y: -dist },
      { x: -dist, y: 0 },
      { x: dist, y: 0 },
    ];

    // ensure clean base
    gsap.set(targets, {
      opacity: 0,
      scale: scaleFrom,
      transformOrigin: "50% 50%",
      willChange: "transform,opacity",
      clearProps: "filter",
    });

    const tl = gsap.timeline({
      delay: startDelay,
      defaults: { ease },
      onComplete: () => onComplete?.(),
    });

    targets.forEach((el, i) => {
      const d = dirs[i % dirs.length];
      tl.fromTo(
        el,
        { x: d.x, y: d.y, opacity: 0, scale: scaleFrom },
        { x: 0, y: 0, opacity: 1, scale: 1, duration: dur },
        i * stagger
      );
    });

    tlRef.current = tl;
    onReady?.(svg);

    return () => tl.kill();
  }, [
    markup,
    src,
    startDelay,
    stagger,
    dur,
    dist,
    scaleFrom,
    ease,
    selector,
    shuffle,
    maxPathTargets,
    fallback,
    onReady,
    onComplete,
  ]);

  return (
    <span
      ref={wrapRef}
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ParallaxMedia.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxMedia({
  src,
  alt = "",
  className = "",
  yPercent = 6,
  scale = 1.02,
  disabledOnCoarse = true,
  fit = "cover", // "cover" | "contain"
  bgBlur = 18,
  bgOpacity = 0.55,
}) {
  const wrapRef = useRef(null);
  const fgRef = useRef(null);
  const bgRef = useRef(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const fg = fgRef.current;
    const bg = bgRef.current;
    if (!wrap || !fg) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const coarse =
      window.matchMedia?.("(pointer: coarse)")?.matches ?? false;

    // ✅ 画像ロード後にrefresh（ズレ＝効いてない感を潰す）
    const onLoad = () => ScrollTrigger.refresh();
    const imgs = [fg, bg].filter(Boolean);
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", onLoad, { once: true });
    });

    // reduce / coarse は安全側（動きもズームも殺す）
    if (reduce || (disabledOnCoarse && coarse)) {
      gsap.set(fg, { y: 0, scale: 1, clearProps: "filter" });
      if (bg) gsap.set(bg, { y: 0, scale: 1, clearProps: "filter" });
      return () => {
        imgs.forEach((img) => img.removeEventListener("load", onLoad));
      };
    }

    // ✅ containは背景だけだと体感薄い → “移動量”を増幅
    const amp = fit === "contain" ? 2.1 : 1.35;

    // ✅ percentじゃなくpx基準（wrap高に比例）で確実に動いて見える
    const travel = () =>
      Math.round(wrap.clientHeight * (yPercent / 100) * amp);

    const target = fit === "contain" && bg ? bg : fg;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        target,
        {
          y: () => -travel(),
          scale,
          force3D: true,
          willChange: "transform",
        },
        {
          y: () => travel(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
        }
      );

      // ✅ contain時：前景が完全静止だと「背景しか動いてない」感が出るので
      // ごく薄く“像が整う”だけ足す（動きではなく気配）
      if (fit === "contain" && bg) {
        gsap.set(fg, { scale: 1.0, y: 0, force3D: true });
      }
    }, wrap);

    return () => {
      imgs.forEach((img) => img.removeEventListener("load", onLoad));
      ctx.revert();
    };
  }, [yPercent, scale, disabledOnCoarse, fit]);

  return (
    <div
      ref={wrapRef}
      className={`${styles.wrap} ${className}`}
      data-fit={fit}
      style={{
        "--pm-bg-blur": `${bgBlur}px`,
        "--pm-bg-opacity": bgOpacity,
      }}
    >
      {fit === "contain" && (
        <img
          ref={bgRef}
          className={styles.bg}
          src={src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
      )}

      <img
        ref={fgRef}
        className={styles.img}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
      />

      <div className={styles.veil} aria-hidden="true" />
    </div>
  );
}
import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Butterfly({
  dir = "/blackpapillon/type",
  frames: framesProp,

  triggerRef = null,
  start = "top top",
  end = "bottom top",
  scrub = true,

  // ✅ 追加：section(従来) / page(ページ全体)
  follow = "section", // "section" | "page"

  cycles = 2.2,
  alpha = 1,

  drift = { x: 22, y: 34, rot: 6 },
  driftScrub = 0.85,

  introDelay = 0.35,
  introDur = 0.35,

  disabledOnCoarse = true,

  // hover flap
  flapOnHover = false,
  hoverScopeRef = null,
  hoverSelector = "",
  hoverDur = 0.42,
  hoverCooldown = 0.28,
  hoverAlsoOnFocus = true,

  className = "",
  style = {},
}) {
  const wrapRef = useRef(null);
  const imgRefs = useRef([]);

  const stRef = useRef(null);
  const hoverTlRef = useRef(null);

  const lastPRef = useRef(0);
  const phaseRef = useRef(0);
  const isHoverPlayingRef = useRef(false);
  const lastHoverAtRef = useRef(0);

  const frames = useMemo(() => {
    if (Array.isArray(framesProp) && framesProp.length) return framesProp;
    return [
      `${dir}/b1.png`,
      `${dir}/b2.png`,
      `${dir}/b3.png`,
      `${dir}/b4.png`,
      `${dir}/b5.png`,
    ];
  }, [dir, framesProp]);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const imgs = imgRefs.current.filter(Boolean);
    if (imgs.length < 2) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const coarse =
      window.matchMedia?.("(pointer: coarse)")?.matches ?? false;

    const triggerEl =
      follow === "page"
        ? document.documentElement
        : triggerRef?.current || wrap;

    const stStart = follow === "page" ? 0 : start;
    const stEnd = follow === "page" ? "max" : end;

    // CSSのopacityを最終到達値として尊重
    const cssOpacity = (() => {
      const v = parseFloat(getComputedStyle(wrap).opacity || "1");
      return Number.isFinite(v) ? v : 1;
    })();

    // cleanup
    stRef.current?.kill?.();
    stRef.current = null;
    hoverTlRef.current?.kill?.();
    hoverTlRef.current = null;
    isHoverPlayingRef.current = false;

    const setters = imgs.map((el) => gsap.quickSetter(el, "opacity"));
    const N = imgs.length;

    const applyFrame = (t01) => {
      const p = t01 * (N - 1);
      const i = Math.floor(p);
      const f = p - i;

      for (let k = 0; k < N; k++) setters[k](0);

      if (i >= N - 1) {
        setters[N - 1](alpha);
      } else {
        setters[i](alpha * (1 - f));
        setters[i + 1](alpha * f);
      }
    };

    const xSet = gsap.quickSetter(wrap, "x", "px");
    const ySet = gsap.quickSetter(wrap, "y", "px");
    const rSet = gsap.quickSetter(wrap, "rotate", "deg");

    const ctx = gsap.context(() => {
      if (reduce || (disabledOnCoarse && coarse)) {
        gsap.set(wrap, { opacity: cssOpacity, clearProps: "transform" });
        imgs.forEach((img, i) => gsap.set(img, { opacity: i === 0 ? alpha : 0 }));
        return;
      }

      // 初期
      gsap.set(imgs, { opacity: 0 });
      gsap.set(imgs[0], { opacity: alpha });

      gsap.set(wrap, { opacity: 0 });
      gsap.to(wrap, {
        opacity: cssOpacity,
        duration: introDur,
        delay: introDelay,
        ease: "power2.out",
      });

      gsap.set(wrap, { transformOrigin: "50% 50%", willChange: "transform" });

      // “ページ連動”は progress差分で回し続ける（スクロール中ずっと）
      // ※ section連動は従来通り progress*cycles でも良いが、
      //    ここでは両方とも「スクロール量で回る」方式に統一して挙動を安定させる
      lastPRef.current = 0;
      phaseRef.current = 0;

      const boost = follow === "page" ? 10 : 1; // ページ全体だと進捗変化が細かいので増幅

      stRef.current = ScrollTrigger.create({
        trigger: triggerEl,
        start: stStart,
        end: stEnd,
        scrub,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          const dp = Math.abs(p - (lastPRef.current ?? 0));
          lastPRef.current = p;

          if (isHoverPlayingRef.current) return;

          // フラップ：スクロール量に比例して回す（止まったら止まる）
          phaseRef.current += dp * cycles * boost;
          const t = phaseRef.current % 1;
          applyFrame(t);

          // ドリフト：回転位相で“ふわっと揺れ続ける”
          const a = phaseRef.current * Math.PI * 2;
          const dx = (drift?.x ?? 0) * Math.cos(a);
          const dy = (drift?.y ?? 0) * Math.sin(a);
          const dr = (drift?.rot ?? 0) * Math.sin(a);

          // driftScrub っぽく“馴染ませる”（強い慣性は不要なので簡易）
          xSet(dx);
          ySet(dy);
          rSet(dr);
        },
      });
    }, wrap);

    // hover listeners（既存維持）
    let hoverTargets = [];
    let onEnter = null;
    let onFocus = null;

    if (!(reduce || (disabledOnCoarse && coarse)) && flapOnHover && hoverSelector) {
      const scope = hoverScopeRef?.current || triggerEl || document;
      hoverTargets = Array.from(scope.querySelectorAll(hoverSelector));

      const playOnce = () => {
        const now = performance.now();
        if (now - lastHoverAtRef.current < hoverCooldown * 1000) return;
        lastHoverAtRef.current = now;

        if (isHoverPlayingRef.current) return;
        isHoverPlayingRef.current = true;

        hoverTlRef.current?.kill?.();

        const driver = { t: 0 };
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          onUpdate: () => applyFrame(driver.t),
          onComplete: () => {
            isHoverPlayingRef.current = false;
            // scroll状態へ復帰
            const t = (phaseRef.current % 1);
            applyFrame(t);
          },
        });

        tl.to(driver, { t: 1, duration: hoverDur });
        hoverTlRef.current = tl;
      };

      onEnter = () => playOnce();
      onFocus = () => playOnce();

      hoverTargets.forEach((el) => {
        el.addEventListener("pointerenter", onEnter, { passive: true });
        if (hoverAlsoOnFocus) el.addEventListener("focus", onFocus, { passive: true });
      });
    }

    return () => {
      if (hoverTargets.length && onEnter) {
        hoverTargets.forEach((el) => {
          el.removeEventListener("pointerenter", onEnter);
          if (hoverAlsoOnFocus && onFocus) el.removeEventListener("focus", onFocus);
        });
      }

      hoverTlRef.current?.kill?.();
      stRef.current?.kill?.();
      ctx.revert();
    };
  }, [
    frames,
    triggerRef,
    start,
    end,
    scrub,
    follow,
    cycles,
    alpha,
    drift?.x,
    drift?.y,
    drift?.rot,
    driftScrub,
    introDelay,
    introDur,
    disabledOnCoarse,
    flapOnHover,
    hoverScopeRef,
    hoverSelector,
    hoverDur,
    hoverCooldown,
    hoverAlsoOnFocus,
  ]);

  const imgStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
    willChange: "opacity",
    pointerEvents: "none",
    userSelect: "none",
  };

  return (
    <div ref={wrapRef} className={className} style={style} aria-hidden="true">
      {frames.map((src, i) => (
        <img
          key={`${src}-${i}`}
          ref={(el) => (imgRefs.current[i] = el)}
          src={src}
          alt=""
          style={imgStyle}
          decoding="async"
          loading="eager"
          draggable="false"
        />
      ))}
    </div>
  );
}
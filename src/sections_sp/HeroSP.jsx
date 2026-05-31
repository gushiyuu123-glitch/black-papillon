// src/sections_sp/HeroSP.jsx
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./HeroSP.module.css";

import LogoSvgReveal from "../components/LogoSvgReveal";
import Butterfly from "../components/Butterfly";

const HERO_IMG = "/hero1.jpeg";
const LOGO_SRC = "/type/BLACKPAPILLON.svg";

export default function HeroSP() {
  const heroRef = useRef(null);
  const bodyRef = useRef(null);
  const imgRef = useRef(null);
  const veilRef = useRef(null);
  const metaRef = useRef(null);

  useLayoutEffect(() => {
    const root = heroRef.current;
    const body = bodyRef.current;
    const img = imgRef.current;
    const veil = veilRef.current;
    const meta = metaRef.current;
    if (!root || !body || !img) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    const ctx = gsap.context(() => {
      const items = body.querySelectorAll("[data-hero-item]");

      // 画像ロード後に“像が整う”開始がズレないよう保険
      const onLoad = () => {
        // ScrollTriggerは使わないので refresh 不要。
        // ただ、iOSで遅延ロード時に一瞬ガタつくのを避けるため再描画だけ促す。
        root.style.transform = "translateZ(0)";
        requestAnimationFrame(() => (root.style.transform = ""));
      };
      if (!img.complete) img.addEventListener("load", onLoad, { once: true });

      // 初期（body）
      gsap.set(items, { opacity: 0, y: 14, scale: 0.995 });

      // 初期（river）
      gsap.set(img, {
        scale: 1.045,
        y: 10,
        clipPath: "inset(6% 6% 10% 6%)",
      });
      if (veil) gsap.set(veil, { opacity: 0 });
      if (meta) gsap.set(meta, { opacity: 0, y: 10 });

      if (reduce) {
        gsap.set(items, { opacity: 1, y: 0, scale: 1, clearProps: "all" });
        gsap.set(img, {
          opacity: 1,
          y: 0,
          scale: 1,
          clipPath: "inset(0 0 0 0)",
        });
        if (veil) gsap.set(veil, { opacity: 1 });
        if (meta) gsap.set(meta, { opacity: 1, y: 0 });
        return () => img.removeEventListener("load", onLoad);
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // river → body の順（SPは“見せてから読む”）
      tl.to(
        img,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1.0,
          y: 0,
          duration: 0.92,
          ease: "power2.out",
        },
        0.05
      );

      if (veil) tl.to(veil, { opacity: 1, duration: 0.9, ease: "power2.out" }, 0.12);
      if (meta) tl.to(meta, { opacity: 1, y: 0, duration: 0.58 }, 0.38);

      tl.to(
        items,
        { opacity: 1, y: 0, scale: 1, duration: 0.62, stagger: 0.06 },
        0.18
      );

      return () => img.removeEventListener("load", onLoad);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero_sp"
      ref={heroRef}
      className={styles.hero}
      aria-label="BLACK PAPILLON Hero (SP)"
    >
      <div className={styles.stage}>
        {/* river（上） */}
        <div className={styles.river} aria-label="Hero visual">
          <img
            ref={imgRef}
            className={styles.riverImg}
            src={HERO_IMG}
            alt="Tattooed person (close-up)"
            decoding="async"
            fetchPriority="high"
          />

          <div ref={veilRef} className={styles.riverVeil} aria-hidden="true" />
          <div ref={metaRef} className={styles.riverMeta} aria-hidden="true">
            HEALED PROOF
          </div>
        </div>

        {/* body（下） */}
        <div ref={bodyRef} className={styles.body}>
          <div className={styles.kicker} data-hero-item>
            <span className={styles.k1}>TATTOO STUDIO</span>
            <span className={styles.dot} aria-hidden="true">
              •
            </span>
            <span className={styles.k2}>NAHA, OKINAWA</span>
          </div>

          <h1 className={styles.logo} data-hero-item data-bfly-flap>
            <span className={styles.srOnly}>BLACK PAPILLON</span>
            <LogoSvgReveal src={LOGO_SRC} className={styles.logoSvgInline} />

            {/* SPは“気配”で置く（coarseでは自動で静止） */}
            <Butterfly
              triggerRef={heroRef}
              className={styles.bflyOnLogo}
              dir="/type"
              scrub={1.25}
              cycles={0.26}
              alpha={0.7}
              drift={{ x: 4, y: 6, rot: 1.0 }}
              introDelay={0.22}
              introDur={0.42}
              disabledOnCoarse={true}
              flapOnHover={true}
              hoverScopeRef={heroRef}
             hoverSelector='h1[data-bfly-flap]'
              hoverDur={0.72}
              hoverCooldown={0.85}
            />
          </h1>

          <p className={styles.note} data-hero-item>
            Carve Beauty.
            <br />
            美を刻む。
          </p>

          <div className={styles.links} aria-label="Primary links" data-hero-item>
            <a className={styles.link} href="#works_sp" data-bfly-flap>
              WORKS
            </a>
            <a className={styles.link} href="#healed_sp" data-bfly-flap>
              HEALED
            </a>
            <a className={styles.linkAccent} href="#booking_sp" data-bfly-flap>
              BOOKING
            </a>
          </div>
        </div>
      </div>

      <div className={styles.footerLine} aria-hidden="true" />
    </section>
  );
}
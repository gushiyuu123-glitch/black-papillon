// src/components/HeaderSP.jsx
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./HeaderSP.module.css";

gsap.registerPlugin(ScrollTrigger);

const LOGO_SRC = "/type/BLACKPAPILLONheader1.svg";
const BFLY_STATIC = "/type/b1.png";
const WORKS_SVG = "/type/WORKS.svg";
const PRICE_SVG = "/type/PRICEGUIDE.svg";

export default function HeaderSP({
  heroId = "hero_sp",
  topId = "hero_sp",
  worksId = "works_sp",
  priceId = "price_sp",
}) {
  const headerRef = useRef(null);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    const heroEl = document.getElementById(heroId);

    if (!heroEl) {
      gsap.set(header, { autoAlpha: 0, y: -10, pointerEvents: "none" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(header, { autoAlpha: 0, y: -10, pointerEvents: "none" });

      const show = () => {
        gsap.set(header, { pointerEvents: "auto" });
        gsap.to(header, {
          autoAlpha: 1,
          y: 0,
          duration: reduce ? 0.001 : 0.46,
          ease: "power2.out",
          overwrite: true,
        });
      };

      const hide = () => {
        gsap.to(header, {
          autoAlpha: 0,
          y: -10,
          duration: reduce ? 0.001 : 0.28,
          ease: "power2.in",
          overwrite: true,
          onComplete: () => gsap.set(header, { pointerEvents: "none" }),
        });
      };

      const st = ScrollTrigger.create({
        trigger: heroEl,
        start: "bottom top",
        end: "bottom top",
        onEnter: show,
        onLeaveBack: hide,
      });

      const sync = () => {
        ScrollTrigger.refresh();
        const r = heroEl.getBoundingClientRect();
        if (r.bottom <= 0) show();
        else hide();
      };

      requestAnimationFrame(sync);
      setTimeout(sync, 80);
      window.addEventListener("hashchange", sync, { passive: true });

      return () => {
        window.removeEventListener("hashchange", sync);
        st.kill();
      };
    }, header);

    return () => ctx.revert();
  }, [heroId]);

  return (
    <header ref={headerRef} className={styles.header} aria-label="Site header (SP)">
      <div className={styles.inner}>
        {/* LEFT: Logo */}
        <a className={styles.logoLink} href={`#${topId}`} aria-label="Back to top">
          <img className={styles.logo} src={LOGO_SRC} alt="BLACK PAPILLON" />

          {/* 蝶は“はみ出さない”位置に収める */}
          <img
            className={styles.bfly}
            src={BFLY_STATIC}
            alt=""
            aria-hidden="true"
            decoding="async"
            draggable="false"
          />
        </a>

        {/* RIGHT: Index */}
        <nav className={styles.nav} aria-label="Index (SP)">
          <a className={styles.navItem} href={`#${worksId}`} aria-label="Go to WORKS">
            <img className={styles.navSvg} src={WORKS_SVG} alt="" aria-hidden="true" />
          </a>

          <a className={styles.navItem} href={`#${priceId}`} aria-label="Go to PRICE">
            <img className={styles.navSvg} src={PRICE_SVG} alt="" aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
}
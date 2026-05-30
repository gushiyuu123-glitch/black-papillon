import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Header.module.css";

gsap.registerPlugin(ScrollTrigger);

const LOGO_SRC = "/type/BLACKPAPILLONheader1.svg";
const BFLY_STATIC = "/type/b1.png";

const WORKS_SVG = "/type/WORKS.svg";
const PRICE_SVG = "/type/PRICEGUIDE.svg"; // これを使う

export default function Header({ heroId = "hero", logoLeft = 25 }) {
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
          duration: reduce ? 0.001 : 0.55,
          ease: "power2.out",
          overwrite: true,
        });
      };

      const hide = () => {
        gsap.to(header, {
          autoAlpha: 0,
          y: -10,
          duration: reduce ? 0.001 : 0.32,
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
    <header
      ref={headerRef}
      className={styles.header}
      aria-label="Site header"
      style={{ ["--hd-left"]: `${logoLeft}%` }}
    >
      <div className={styles.inner}>
        {/* ロゴ（クリックでトップへ） */}
        <div className={styles.logoStage}>
          <a className={styles.logoLink} href="#hero" aria-label="Back to top">
            <img className={styles.logo} src={LOGO_SRC} alt="BLACK PAPILLON" />
            <img
              className={styles.bfly}
              src={BFLY_STATIC}
              alt=""
              aria-hidden="true"
              decoding="async"
              draggable="false"
            />
          </a>
        </div>

        {/* 右：WORKS / PRICE（SVGだけ） */}
        <nav className={styles.nav} aria-label="Index">
          <a className={styles.navItem} href="#works" aria-label="Go to WORKS">
            <img className={styles.navSvg} src={WORKS_SVG} alt="" aria-hidden="true" />
          </a>

          <a className={styles.navItem} href="#price" aria-label="Go to PRICE">
            <img className={styles.navSvg} src={PRICE_SVG} alt="" aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
}
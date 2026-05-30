// src/sections/HeroPC.jsx
import { useLayoutEffect, useRef } from "react";
import styles from "./HeroPC.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogoSvgReveal from "../components/LogoSvgReveal";
import Butterfly from "../components/Butterfly";

gsap.registerPlugin(ScrollTrigger);

const HERO_IMG = "/hero1.jpeg";
const LOGO_SRC = "/type/BLACKPAPILLON.svg";

export default function HeroPC() {
  const heroRef = useRef(null);
  const leftRef = useRef(null);
  const imgRef = useRef(null);
  const veilRef = useRef(null);
  const metaRef = useRef(null);

  useLayoutEffect(() => {
    const root = heroRef.current;
    const left = leftRef.current;
    const img = imgRef.current;
    const veil = veilRef.current;
    const meta = metaRef.current;
    if (!root || !left || !img) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const coarse =
      window.matchMedia?.("(pointer: coarse)")?.matches ?? false;

    const ctx = gsap.context(() => {
      const leftItems = left.querySelectorAll("[data-hero-item]");

      // 画像読み込み後にrefresh（ズレ防止）
      const onLoad = () => ScrollTrigger.refresh();
      if (!img.complete) img.addEventListener("load", onLoad, { once: true });

      // 初期（左）
      gsap.set(leftItems, { opacity: 0, y: 18, scale: 0.995 });

      // 初期（右：像が整う）
      gsap.set(img, {
        scale: 1.035,
        y: 10,
        clipPath: "inset(5% 5% 8% 5%)",
      });

      if (veil) gsap.set(veil, { opacity: 0 });
      if (meta) gsap.set(meta, { opacity: 0, y: 10 });

      // reduce は即表示
      if (reduce) {
        gsap.set(leftItems, { opacity: 1, y: 0, scale: 1, clearProps: "all" });
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

      tl.to(
        leftItems,
        { opacity: 1, y: 0, scale: 1, duration: 0.66, stagger: 0.07 },
        0.05
      );

      tl.to(
        img,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1.0,
          y: 0,
          duration: 0.92,
          ease: "power2.out",
        },
        0.1
      );

      if (veil) {
        tl.to(veil, { opacity: 1, duration: 0.9, ease: "power2.out" }, 0.18);
      }
      if (meta) tl.to(meta, { opacity: 1, y: 0, duration: 0.6 }, 0.55);

      // Parallax（PCのみ）
      if (!coarse) {
        gsap.to(img, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        if (veil) {
          gsap.to(veil, {
            opacity: 0.88,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
        }
      }

      return () => img.removeEventListener("load", onLoad);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className={styles.hero}
      aria-label="BLACK PAPILLON Hero"
    >
      <div className={styles.stage}>
        <div ref={leftRef} className={styles.left}>
          <div className={styles.kicker} data-hero-item>
            <span className={styles.k1}>TATTOO STUDIO</span>
            <span className={styles.dot} aria-hidden="true">
              •
            </span>
            <span className={styles.k2}>NAHA, OKINAWA</span>
          </div>

          {/* ✅ ロゴもHeroの同期に入れる（data-hero-item） */}
          <h1 className={styles.logo} data-hero-item data-bfly-flap>
            <span className={styles.srOnly}>BLACK PAPILLON</span>

            <LogoSvgReveal src={LOGO_SRC} className={styles.logoSvgInline} />

 <Butterfly
  triggerRef={heroRef}
  className={styles.bflyOnLogo}
  dir="/type"

  scrub={1.65}          // 1.05 → 1.65（追従ゆっくり）
  cycles={0.34}         // 0.72 → 0.34（羽ばたき少なく）
  alpha={0.74}          // 0.82 → 0.74（主張を落とす）

  drift={{ x: 5, y: 8, rot: 1.3 }} // 10/16/3 → 小さく
  driftScrub={0.93}     // 0.85 → 0.93（より馴染ませ）

  introDelay={0.28}     // 0.22 → 0.28（出番を少し遅く）
  introDur={0.46}       // 0.34 → 0.46（立ち上がりを穏やかに）

  disabledOnCoarse={true}

  flapOnHover={true}
  hoverScopeRef={heroRef}
  hoverSelector="[data-bfly-flap]"
  hoverDur={0.78}       // 0.62 → 0.78（羽ばたきをゆっくり）
  hoverCooldown={0.85}  // 0.42 → 0.85（連打感を消す）
/>
          </h1>

          <p className={styles.note} data-hero-item>
            Carve Beauty.
            <br />
            美を刻む。
          </p>

          <div className={styles.links} aria-label="Primary links" data-hero-item>
            <a className={styles.link} href="#works" data-bfly-flap>
              WORKS
            </a>
            <a className={styles.link} href="#healed" data-bfly-flap>
              HEALED
            </a>
            <a className={styles.linkAccent} href="#booking" data-bfly-flap>
              BOOKING
            </a>
          </div>
        </div>

        <div className={styles.right} aria-label="Hero visual">
          <div className={styles.river}>
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

          <div className={styles.spine} aria-hidden="true" />
        </div>
      </div>

      <div className={styles.footerLine} aria-hidden="true" />
    </section>
  );
}
// src/sections/Footer.jsx
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Footer.module.css";
import Reveal from "../components/Reveal";

gsap.registerPlugin(ScrollTrigger);

const LOGO_SRC = "/type/BLACKPAPILLON.svg";
const BFLY_STATIC = "/type/b1.png";

// Footer背景（public直下）
const FOOTER_BG = "/footer-bg.png"; // 例: public/footer-bg.webp

const INSTAGRAM_URL = "#"; // TODO: 実URL
const EMAIL = "hello@blackpapillon.tattoo"; // 仮
const TEL = "090-0000-0000"; // 仮

// “存在してる感”は出すが、番地は置かない
const AREA = "那覇・牧志エリア";
const ACCESS_NOTE = "詳細は予約確定後にご案内します。";
const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Naha%20Makishi%20Okinawa";

export default function Footer() {
  const rootRef = useRef(null);
  const bgImgRef = useRef(null);

  const telHref = `tel:${TEL.replace(/[^0-9+]/g, "")}`;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const img = bgImgRef.current;
    if (!root || !img) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const coarse =
      window.matchMedia?.("(pointer: coarse)")?.matches ?? false;

    // reduce/coarse は静止（でも“浮遊感”は scale だけ残す）
    if (reduce || coarse) {
      gsap.set(img, { yPercent: 0, scale: 1.06, clearProps: "filter" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(img, { yPercent: -6, scale: 1.08, willChange: "transform" });

      gsap.to(img, {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={rootRef}
      id="footer"
      className={styles.footer}
      aria-label="Site footer"
      style={{ ["--ft-bg-url"]: `url('${FOOTER_BG}')` }}
    >
      {/* 背景（枠なし・滲み・浮遊） */}
      <div className={styles.bgWrap} aria-hidden="true">
        <img
          ref={bgImgRef}
          className={styles.bgImg}
          src={FOOTER_BG}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      </div>

      <div className={styles.inner}>
        {/* SEAL */}
        <div className={styles.seal}>
          <Reveal preset="base" y={14}>
            <div className={styles.logoStage}>
              <img className={styles.logo} src={LOGO_SRC} alt="BLACK PAPILLON" />
              <img
                className={styles.bfly}
                src={BFLY_STATIC}
                alt=""
                aria-hidden="true"
                decoding="async"
                draggable="false"
              />
            </div>
          </Reveal>

          <Reveal preset="base" y={10} delay={0.05}>
            <p className={styles.tag}>TATTOO STUDIO — NAHA, OKINAWA</p>
          </Reveal>
        </div>

        {/* GRID */}
        <div className={styles.grid}>
          {/* ACCESS */}
          <Reveal preset="base" y={12} delay={0.04}>
            <section className={styles.block} aria-label="Access">
              <p className={styles.h}>ACCESS</p>
              <p className={styles.primary}>{AREA}</p>
              <p className={styles.muted}>{ACCESS_NOTE}</p>

              <a
                className={styles.link}
                href={MAP_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Google Mapsでエリア検索"
              >
                Map（エリア検索） →
              </a>
            </section>
          </Reveal>

          {/* CONTACT */}
          <Reveal preset="base" y={12} delay={0.08}>
            <section className={styles.block} aria-label="Contact">
              <p className={styles.h}>CONTACT</p>

              <p className={styles.muted}>
                InstagramのDMが一番早いです。メール・電話でも受け付けています。
              </p>

              <div className={styles.row} aria-label="Contact links">
                <a
                  className={styles.link}
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
                <span className={styles.sep} aria-hidden="true">
                  /
                </span>
                <a className={styles.link} href={`mailto:${EMAIL}`}>
                  {EMAIL}
                </a>
                <span className={styles.sep} aria-hidden="true">
                  /
                </span>
                <a className={styles.link} href={telHref}>
                  {TEL}
                </a>
              </div>
            </section>
          </Reveal>

          {/* INDEX */}
          <Reveal preset="base" y={12} delay={0.12}>
            <nav className={styles.block} aria-label="Site index">
              <p className={styles.h}>INDEX</p>

              <div className={styles.row}>
                <a className={styles.link} href="#works">
                  WORKS
                </a>
                <span className={styles.sep} aria-hidden="true">
                  /
                </span>
                <a className={styles.link} href="#price">
                  PRICE
                </a>
                <span className={styles.sep} aria-hidden="true">
                  /
                </span>
                <a className={styles.link} href="#booking">
                  BOOKING
                </a>
                <span className={styles.sep} aria-hidden="true">
                  /
                </span>
                <a className={styles.link} href="#hero">
                  TOP
                </a>
              </div>

              <div className={`${styles.row} ${styles.rowSub}`} aria-label="More">
                <a className={styles.link} href="#healed">
                  HEALED
                </a>
                <span className={styles.sep} aria-hidden="true">
                  /
                </span>
                <a className={styles.link} href="#style">
                  STYLE
                </a>
                <span className={styles.sep} aria-hidden="true">
                  /
                </span>
                <a className={styles.link} href="#care">
                  CARE
                </a>
              </div>
            </nav>
          </Reveal>
        </div>

        {/* BOTTOM */}
        <Reveal preset="base" y={10} delay={0.16}>
          <div className={styles.bottom}>
            <p className={styles.copy}>
              © {new Date().getFullYear()} BLACK PAPILLON. All rights reserved.
              <span className={styles.dot} aria-hidden="true">
                {" "}
                •{" "}
              </span>
              Design &amp; Code © Yuto Gushiken.
            </p>

            <a
              className={styles.cred}
              href="https://gushikendesign.com/"
              target="_blank"
              rel="noreferrer"
            >
              gushikendesign.com
            </a>
          </div>
        </Reveal>
      </div>

      <div className={styles.hairline} aria-hidden="true" />
    </footer>
  );
}
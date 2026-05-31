// src/sections_sp/FooterSP.jsx
import styles from "./FooterSP.module.css";
import Reveal from "../components/Reveal";

const LOGO_SRC = "/type/BLACKPAPILLON.svg";
const BFLY_STATIC = "/type/b1.png";
const FOOTER_BG = "/footer-bg.png";

const INSTAGRAM_URL = "#"; // TODO: 実URL
const EMAIL = "hello@blackpapillon.tattoo"; // 仮
const TEL = "090-0000-0000"; // 仮

const AREA = "那覇・牧志エリア";
const ACCESS_NOTE = "詳細は予約確定後にご案内します。";
const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Naha%20Makishi%20Okinawa";

export default function FooterSP() {
  const telHref = `tel:${TEL.replace(/[^0-9+]/g, "")}`;

  return (
    <footer
      id="footer_sp"
      className={styles.footer}
      aria-label="Site footer (SP)"
    >
      {/* 背景（SPは静止） */}
      <div className={styles.bgWrap} aria-hidden="true">
        <img
          className={styles.bgImg}
          src={FOOTER_BG}
          alt=""
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

        {/* GRID（SPは1列） */}
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

              <p className={styles.muted}>DMが最短。メール・電話も可。</p>

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

          {/* INDEX（全部 _sp） */}
          <Reveal preset="base" y={12} delay={0.12}>
            <nav className={styles.block} aria-label="Site index">
              <p className={styles.h}>INDEX</p>

              <div className={styles.row}>
                <a className={styles.link} href="#works_sp">
                  WORKS
                </a>
                <span className={styles.sep} aria-hidden="true">
                  /
                </span>
                <a className={styles.link} href="#price_sp">
                  PRICE
                </a>
                <span className={styles.sep} aria-hidden="true">
                  /
                </span>
                <a className={styles.link} href="#booking_sp">
                  BOOKING
                </a>
                <span className={styles.sep} aria-hidden="true">
                  /
                </span>
                <a className={styles.link} href="#hero_sp">
                  TOP
                </a>
              </div>

              <div className={`${styles.row} ${styles.rowSub}`} aria-label="More">
                <a className={styles.link} href="#healed_sp">
                  HEALED
                </a>
                <span className={styles.sep} aria-hidden="true">
                  /
                </span>
                <a className={styles.link} href="#style_sp">
                  STYLE
                </a>
                <span className={styles.sep} aria-hidden="true">
                  /
                </span>
                <a className={styles.link} href="#care_sp">
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
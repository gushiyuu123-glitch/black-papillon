// src/sections_sp/BookingSP.jsx
import styles from "./BookingSP.module.css";
import Reveal from "../components/Reveal";

const BOOKING_BG = "/booking/booking-bg.png";

// 例: https://instagram.com/blackpapillon_tattoo
const INSTAGRAM_URL = "#";

const SEND = [
  { no: "01", text: "部位 / だいたいのサイズ" },
  { no: "02", text: "参考（画像 or URL）" },
  { no: "03", text: "希望時期" },
];

export default function BookingSP() {
  return (
    <section
      id="booking_sp"
      className={styles.section}
      aria-labelledby="booking-title_sp"
    >
      {/* 背景（SPは静止。ScrollTriggerなし） */}
      <img
        className={styles.bgImg}
        src={BOOKING_BG}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        draggable="false"
      />
      <div className={styles.bgVeil} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Head */}
        <header className={styles.head}>
          <div className={styles.watermark} aria-hidden="true">
            BOOKING
          </div>

          <Reveal preset="base" y={12}>
            <h2 id="booking-title_sp" className={styles.kicker}>
              BOOKING
            </h2>
          </Reveal>

          <Reveal preset="base" y={14} delay={0.05}>
            <p className={styles.sub}>まずイメージだけ送ってください。</p>
          </Reveal>

          <Reveal preset="base" y={12} delay={0.09}>
            <p className={styles.leftNote}>
              下絵が決まってから、金額と日程を確定します。
            </p>
          </Reveal>

          <div className={styles.headLine} aria-hidden="true" />
        </header>

        {/* Slip */}
        <div className={styles.right} aria-label="Booking slip (SP)">
          <Reveal preset="slow" y={16} delay={0.08}>
            <div className={styles.slip}>
              <div className={styles.slipTop}>
                <p className={styles.slipLabel}>SEND</p>
                <p className={styles.slipHint}>3点だけ</p>
              </div>

              <div className={styles.list} role="list" aria-label="送る内容">
                {SEND.map((it, i) => (
                  <Reveal key={it.no} preset="base" y={10} delay={0.10 + i * 0.04}>
                    <div className={styles.row} role="listitem">
                      <span className={styles.no}>{it.no}</span>
                      <span className={styles.txt}>{it.text}</span>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal preset="base" y={10} delay={0.22}>
                <p className={styles.note}>返信で、流れと日程を決めます。</p>
              </Reveal>

              <Reveal preset="slow" y={12} delay={0.26}>
                <a
                  className={styles.cta}
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="InstagramでDMを送る"
                >
                  DMを送る
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </a>
              </Reveal>

              <Reveal preset="base" y={8} delay={0.30}>
                <p className={styles.channelsCap}>
                  連絡先の詳細は下のCONTACTにまとめています。
                </p>
              </Reveal>
            </div>
          </Reveal>
        </div>

        <div className={styles.footerLine} aria-hidden="true" />
      </div>
    </section>
  );
}
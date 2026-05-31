// src/sections_sp/BookingSP.jsx
import styles from "./BookingSP.module.css";
import Reveal from "../components/Reveal";

const BOOKING_BG = "/booking/booking-bgsp1.png";
const INSTAGRAM_URL = "#";

const SEND = [
  { no: "01", text: "部位 / だいたいのサイズ" },
  { no: "02", text: "参考（画像 or URL）" },
  { no: "03", text: "希望時期" },
];

const NEXT = [
  { no: "A", text: "内容確認 → 返信（流れ/候補日）" },
  { no: "B", text: "当日、線と配置を決める（止められます）" },
  { no: "C", text: "下絵確定後に、金額と日程を確定" },
];

export default function BookingSP() {
  return (
    <section
      id="booking_sp"
      className={styles.section}
      aria-labelledby="booking-title_sp"
    >
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

        <div className={styles.right} aria-label="Booking slip (SP)">
          <Reveal preset="slow" y={16} delay={0.08}>
            <div className={styles.slip}>
              {/* これで“カード”じゃなく“帳簿”になる */}
              <div className={styles.spine} aria-hidden="true" />

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

              {/* 追加：PCの“安心”をSPに最小で持ってくる */}
              <div className={styles.nextBlock} aria-label="次の流れ">
                <div className={styles.slipTop}>
                  <p className={styles.slipLabel}>NEXT</p>
                  <p className={styles.slipHint}>ここまで</p>
                </div>

                <div className={styles.list} role="list" aria-label="次の流れ">
                  {NEXT.map((it, i) => (
                    <Reveal key={it.no} preset="base" y={10} delay={0.18 + i * 0.04}>
                      <div className={styles.row} role="listitem">
                        <span className={styles.no}>{it.no}</span>
                        <span className={styles.txt}>{it.text}</span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

              <Reveal preset="base" y={10} delay={0.30}>
                <p className={styles.note}>
                  返信目安：24〜48h（混雑時は前後します）
                </p>
              </Reveal>

              <Reveal preset="slow" y={12} delay={0.34}>
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

              <Reveal preset="base" y={8} delay={0.38}>
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
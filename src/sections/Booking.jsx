// src/sections/Booking.jsx
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Booking.module.css";
import Reveal from "../components/Reveal";

gsap.registerPlugin(ScrollTrigger);

const BOOKING_BG = "/booking/booking-bg.png";

// 例: https://instagram.com/blackpapillon_tattoo
const INSTAGRAM_URL = "#";

const SEND = [
  { no: "01", text: "部位 / だいたいのサイズ" },
  { no: "02", text: "参考（画像 or URL）" },
  { no: "03", text: "希望時期" },
];

const NEXT = [
  { no: "A", text: "内容確認 → 返信（流れ / 候補日）" },
  { no: "B", text: "当日、線と配置を決める（止められます）" },
  { no: "C", text: "下絵確定後に、金額と日程を確定" },
];

export default function Booking() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const coarse = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;

    // PCだけ（SPは別）
    if (reduce || coarse) {
      gsap.set(bg, { yPercent: 0, scale: 1, clearProps: "willChange" });
      return;
    }

    const BG_Y = 10;
    const BG_SCALE = 1.12;

    const ctx = gsap.context(() => {
      gsap.set(bg, {
        yPercent: -BG_Y,
        scale: BG_SCALE,
        willChange: "transform",
      });

      gsap.to(bg, {
        yPercent: BG_Y,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.75,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="booking"
      className={styles.section}
      aria-labelledby="booking-title"
    >
      {/* 背景（薄いパララックス） */}
      <img
        ref={bgRef}
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
        {/* LEFT : silence / stamp */}
        <div className={styles.left}>
          <div className={styles.watermark} aria-hidden="true">
            BOOKING
          </div>

          <Reveal preset="base" y={12}>
            <h2 id="booking-title" className={styles.kicker}>
              BOOKING
            </h2>
          </Reveal>

          <Reveal preset="base" y={14} delay={0.05}>
<p className={styles.sub}>部位やサイズ感、参考（画像・URL）、希望時期を送ってください。</p>
          </Reveal>

          <Reveal preset="base" y={12} delay={0.09}>
            <p className={styles.leftNote}>
              下絵が決まってから、金額と日程を確定します。
            </p>
          </Reveal>

          <div className={styles.leftFade} aria-hidden="true" />
        </div>

        {/* divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* RIGHT : slip */}
        <div className={styles.right} aria-label="Booking slip">
          <Reveal preset="slow" y={16} delay={0.08}>
            <div className={styles.slip}>
              {/* “帳簿の背骨” */}
              <div className={styles.spine} aria-hidden="true" />

              {/* SEND */}
              <div className={styles.slipTop}>
                <p className={styles.slipLabel}>SEND</p>
                <p className={styles.slipHint}>あると早い</p>
              </div>

              <div className={styles.list} role="list" aria-label="送る内容">
                {SEND.map((it, i) => (
                  <Reveal key={it.no} preset="base" y={10} delay={0.1 + i * 0.04}>
                    <div className={styles.row} role="listitem">
                      <span className={styles.no}>{it.no}</span>
                      <span className={styles.txt}>{it.text}</span>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* NEXT（情報量を戻す最小） */}
              <div className={styles.nextBlock} aria-label="次の流れ">
                <div className={styles.slipTop}>
                  <p className={styles.slipLabel}>NEXT</p>
                  <p className={styles.slipHint}>ここまで</p>
                </div>

                <div className={styles.list} role="list" aria-label="次の流れ">
                  {NEXT.map((it, i) => (
                    <Reveal key={it.no} preset="base" y={10} delay={0.22 + i * 0.04}>
                      <div className={styles.row} role="listitem">
                        <span className={styles.no}>{it.no}</span>
                        <span className={styles.txt}>{it.text}</span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

              <Reveal preset="base" y={10} delay={0.36}>
                <p className={styles.note}>返信で、流れと日程を決めます。</p>
              </Reveal>

              <Reveal preset="base" y={10} delay={0.40}>
                <p className={styles.reply}>返信目安：24〜48h（混雑時は前後）</p>
              </Reveal>

              <Reveal preset="slow" y={12} delay={0.46}>
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

              {/* 連絡手段の羅列はFooterへ */}
              <Reveal preset="base" y={8} delay={0.52}>
                <p className={styles.channelsCap}>
                  連絡先の詳細は下のCONTACTにまとめています。
                </p>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </div>

      <div className={styles.footerLine} aria-hidden="true" />
    </section>
  );
}
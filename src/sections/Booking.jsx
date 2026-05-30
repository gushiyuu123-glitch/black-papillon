// src/sections/Booking.jsx
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Booking.module.css";
import Reveal from "../components/Reveal";

gsap.registerPlugin(ScrollTrigger);

const BOOKING_BG = "/booking/booking-bg.png";

const INSTAGRAM_URL = "#"; // 例: https://instagram.com/blackpapillon_tattoo
const EMAIL = "hello@blackpapillon.tattoo"; // 仮
const TEL = "090-0000-0000"; // 仮

const SEND = [
  { no: "01", text: "部位 / だいたいのサイズ" },
  { no: "02", text: "参考（画像 or URL）" },
  { no: "03", text: "希望時期（いつ頃）" },
];

export default function Booking() {
  const telHref = `tel:${TEL.replace(/[^0-9+]/g, "")}`;
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const coarse =
      window.matchMedia?.("(pointer: coarse)")?.matches ?? false;

    // PCだけ（SPは最後に作る方針）
    if (reduce || coarse) {
      gsap.set(bg, { yPercent: 0, scale: 1, clearProps: "willChange" });
      return;
    }

    const BG_Y = 10; // ← “見える”程度に効かせる
    const BG_SCALE = 1.12;

    const ctx = gsap.context(() => {
      gsap.set(bg, { yPercent: -BG_Y, scale: BG_SCALE, willChange: "transform" });

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
      aria-labelledby="booking-label"
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
            <p id="booking-label" className={styles.kicker}>
              BOOKING
            </p>
          </Reveal>

          <Reveal preset="base" y={14} delay={0.05}>
            <p className={styles.sub}>予約は、相談から。</p>
          </Reveal>

          <Reveal preset="base" y={12} delay={0.09}>
            <p className={styles.leftNote}>
              下絵が決まってから、金額と日程を確定します。
              まずはイメージだけで大丈夫です。
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
                  aria-label="Instagramで相談する"
                >
                  相談する <span className={styles.arrow} aria-hidden="true">→</span>
                </a>
              </Reveal>

              <Reveal preset="base" y={8} delay={0.30}>
                <p className={styles.channelsCap}>
                  InstagramのDMが早いです。電話・メールでも受け付けています。
                </p>
              </Reveal>

              <Reveal preset="base" y={8} delay={0.33}>
                <div className={styles.channelsRow} aria-label="連絡手段">
                  <a
                    className={styles.chLink}
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
                  <span className={styles.dot} aria-hidden="true">/</span>
                  <a className={styles.chLink} href={`mailto:${EMAIL}`}>
                    {EMAIL}
                  </a>
                  <span className={styles.dot} aria-hidden="true">/</span>
                  <a className={styles.chLink} href={telHref}>
                    {TEL}
                  </a>
                </div>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </div>

      <div className={styles.footerLine} aria-hidden="true" />
    </section>
  );
}
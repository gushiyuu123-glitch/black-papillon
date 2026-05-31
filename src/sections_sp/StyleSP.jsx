// src/sections_sp/StyleSP.jsx
import styles from "./StyleSP.module.css";
import Reveal from "../components/Reveal";

const PILLAR_IMG = "/style/style-left-pillar-inner.webp";

const STAGGER = 0.08;
const BASE = 0.10;

const STYLE_ITEMS = [
  {
    key: "fine",
    title: "FINE LINE",
    line1: "線の精度。",
    line2: "細さより崩れにくさ。",
    word: "PRECISION",
    img: "/style/style-fine.webp",
    alt: "Fine line style reference",
  },
  {
    key: "bg",
    title: "BLACK & GREY",
    line1: "黒の階調。",
    line2: "汚れず沈む濃度。",
    word: "GRADATION",
    img: "/style/style-blackgrey.webp",
    alt: "Black and grey style reference",
  },
  {
    key: "cover",
    title: "COVERUP",
    line1: "消すのではなく、",
    line2: "上書きします。",
    word: "UPDATE",
    img: "/style/style-coverup.webp",
    alt: "Coverup style reference",
  },
];

export default function StyleSP() {
  return (
    <section
      id="style_sp"
      className={styles.section}
      aria-labelledby="style-title_sp"
    >
      <div className={styles.inner}>
        {/* ヘッダー：柱を“気配背景”にして、文字を浮かせる */}
        <div className={styles.top}>
          <figure className={styles.pillar} aria-hidden="true">
            <img
              className={styles.pillarImg}
              src={PILLAR_IMG}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <div className={styles.pillarVeil} aria-hidden="true" />
          </figure>

          <header className={styles.head}>
            <Reveal preset="base" y={14} delay={BASE}>
              <p className={styles.kicker}>STYLE</p>
            </Reveal>

            <Reveal preset="base" y={14} delay={BASE + 0.04}>
              <h2 id="style-title_sp" className={styles.title}>
                得意スタイル
              </h2>
            </Reveal>

            <Reveal preset="base" y={14} delay={BASE + 0.08}>
              <p className={styles.lead}>3つだけ。迷わないための基準だけ。</p>
            </Reveal>
          </header>
        </div>

        {/* 3つ：縦で殴る（でも均等に並べない） */}
        <div className={styles.list} role="list" aria-label="Style list (SP)">
          {STYLE_ITEMS.map((it, i) => {
            const d = BASE + 0.16 + i * STAGGER;

            return (
              <article
                key={it.key}
                className={`${styles.item} ${i === 1 ? styles.itemMid : ""} ${
                  i === 2 ? styles.itemLast : ""
                }`}
                role="listitem"
              >
                <Reveal preset="base" y={18} delay={d} className={styles.frameReveal}>
                  <figure className={styles.frame} aria-label={it.title}>
                    <img
                      className={styles.frameImg}
                      src={it.img}
                      alt={it.alt}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className={styles.frameVeil} aria-hidden="true" />

                    {/* “カード”じゃなく、作品に直接ラベルを載せる */}
                    <figcaption className={styles.onFrame} aria-hidden="true">
                      <span className={styles.onTitle}>{it.title}</span>
                      <span className={styles.onRule} />
                      <span className={styles.onWord}>{it.word}</span>
                    </figcaption>
                  </figure>
                </Reveal>

                <div className={styles.meta}>
                  <Reveal preset="base" y={12} delay={d + 0.04}>
                    <p className={styles.copy}>
                      <span>{it.line1}</span>
                      <span>{it.line2}</span>
                    </p>
                  </Reveal>
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.hairline} aria-hidden="true" />
      </div>
    </section>
  );
}
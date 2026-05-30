// src/sections/Style.jsx
import styles from "./Style.module.css";
import Reveal from "../components/Reveal";

const PILLAR_IMG = "/style/style-left-pillar-inner.webp";

// 左 → 右の順に入れる（柱 → 3枚）
const STAGGER = 0.08;     // 0.06〜0.10 好み
const PILLAR_DELAY = 0.0;
const CARDS_START = 0.14; // 柱のあとに右が動き出す

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

export default function Style() {
  return (
    <section id="style" className={styles.section} aria-labelledby="style-label">
      <div className={styles.inner}>
        {/* LEFT : pillar */}
        <aside className={styles.left} aria-label="Style pillar visual">
          <Reveal
            preset="base"
            y={18}
            delay={PILLAR_DELAY}
            className={styles.pillarReveal}
          >
            <figure className={styles.pillar}>
              <img
                className={styles.pillarImg}
                src={PILLAR_IMG}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
              <div className={styles.pillarVeil} aria-hidden="true" />
            </figure>
          </Reveal>
        </aside>

        {/* RIGHT : header + 3 frames */}
        <div className={styles.right}>
          <header className={styles.head}>
            <Reveal preset="base" y={14} delay={PILLAR_DELAY + 0.06}>
              <p id="style-label" className={styles.kicker}>
                STYLE
              </p>
            </Reveal>

            <Reveal preset="base" y={14} delay={PILLAR_DELAY + 0.10}>
              <h2 className={styles.title}>スタイルの確認</h2>
            </Reveal>

            <Reveal preset="base" y={14} delay={PILLAR_DELAY + 0.14}>
              <p className={styles.lead}>
                得意なスタイルを3つに絞りました。迷わず選べるよう、基準だけ示します。
              </p>
            </Reveal>
          </header>

          <div className={styles.grid} role="list" aria-label="Style list">
            {STYLE_ITEMS.map((it, i) => {
              const d = CARDS_START + i * STAGGER; // 左→右
              return (
                <article key={it.key} className={styles.card} role="listitem">
                  {/* 画像 */}
                  <Reveal
                    preset="base"
                    y={18}
                    delay={d}
                    className={styles.cardReveal}
                  >
                    <figure className={styles.frame} aria-label={it.title}>
                      <img
                        className={styles.frameImg}
                        src={it.img}
                        alt={it.alt}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className={styles.frameVeil} aria-hidden="true" />
                    </figure>
                  </Reveal>

                  {/* テキスト（画像のあとに追従） */}
                  <div className={styles.meta}>
                    <Reveal preset="base" y={12} delay={d + 0.03}>
                      <p className={styles.cardTitle}>{it.title}</p>
                    </Reveal>

                    <div className={styles.rule} aria-hidden="true" />

                    <Reveal preset="base" y={12} delay={d + 0.05}>
                      <p className={styles.copy}>
                        <span>{it.line1}</span>
                        <span>{it.line2}</span>
                      </p>
                    </Reveal>

                    {!!it.word && (
                      <Reveal preset="base" y={10} delay={d + 0.07}>
                        <p className={styles.word} aria-hidden="true">
                          {it.word}
                        </p>
                      </Reveal>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className={styles.hairline} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
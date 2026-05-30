// src/sections/Healed.jsx
import styles from "./Healed.module.css";
import Reveal from "../components/Reveal";

const HEALED_IMG = "/healed/healed-04.png"; // publicに置いて差し替え

export default function Healed() {
  return (
    <section id="healed" className={styles.section} aria-labelledby="healed-label">
      <div className={styles.inner}>
        <header className={styles.head}>
          <Reveal preset="base" y={12}>
            <p id="healed-label" className={styles.kicker}>
              HEALED
            </p>
          </Reveal>

          <Reveal preset="base" y={12} delay={0.04}>
            <p className={styles.sub}>治癒後の仕上がり</p>
          </Reveal>
        </header>

        <div className={styles.center}>
          <Reveal as="p" className={styles.statement} preset="base" y={14} delay={0.08}>
            <span className={styles.l1}>仕上がりの基準は治癒後。</span>
            <span className={styles.l2}>時間が経っても線が崩れにくいよう、</span>
            <span className={styles.l3}>引き方まで確認してから描いています。</span>
          </Reveal>

          {/* 証拠：1枚だけ置く */}
          <Reveal className={styles.sampleReveal} preset="slow" y={18} delay={0.14}>
            <figure className={styles.sample} aria-label="治癒後サンプル">
              <img
                className={styles.sampleImg}
                src={HEALED_IMG}
                alt="治癒後のタトゥー（サンプル）"
                loading="lazy"
                decoding="async"
              />
              <figcaption className={styles.sampleCap} aria-hidden="true">
                HEALED / SAMPLE
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>

      <div className={styles.footerLine} aria-hidden="true" />
    </section>
  );
}
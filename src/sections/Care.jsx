// src/sections/Care.jsx
import styles from "./Care.module.css";
import Reveal from "../components/Reveal";

// ✅ フルワイド背景に使う（完成タトゥーじゃない“準備/現場”の証拠写真）
const PROOF_IMG = "/care/care-proof.png"; // publicに置いて差し替え

const PROCESS = [
  ["予約", "部位 / サイズ / イメージを送る（短くてOK）"],
  ["下絵確認", "当日、線と配置を決める（ここで止められます）"],
  ["施術", "休憩を挟みながら進めます"],
  ["ケア", "当日から数日分の手順をお渡しします"],
];

const SAFETY = [
  ["使い捨て", "針・手袋・消耗品は毎回交換"],
  ["清潔", "接触面は施術ごとに拭き上げ"],
  ["肌", "状態が悪い日は施術を行いません"],
  ["NG", "飲酒 / 体調不良 / 日焼け直後は不可"],
];

export default function Care() {
  return (
    <section
      id="care"
      className={styles.section}
      aria-labelledby="care-label"
      style={{ "--care-bg": `url(${PROOF_IMG})` }}
    >
      <div className={styles.inner}>
        {/* LEFT : header */}
        <div className={styles.left}>
          <header className={styles.head}>
            <Reveal preset="base" y={14}>
              <p id="care-label" className={styles.kicker}>
                CARE
              </p>
            </Reveal>

            <Reveal preset="base" y={14}>
              <h2 className={styles.title}>当日の流れと清潔基準</h2>
            </Reveal>

            <Reveal preset="base" y={14}>
     <p className={styles.lead}>
  当日の流れと、清潔の基準をまとめました。
</p>
            </Reveal>
          </header>
        </div>

        {/* RIGHT : ledgers */}
        <div className={styles.right} aria-label="Process and safety ledgers">
          <div className={styles.ledgers}>
            <Reveal preset="base" y={14} className={styles.ledgerReveal}>
              <section className={styles.ledger} aria-labelledby="process-label">
                <div className={styles.ledgerHead}>
                  <p id="process-label" className={styles.ledgerTitle}>
                    PROCESS
                  </p>
                  <p className={styles.ledgerNote}>当日の流れ</p>
                </div>

                <dl className={styles.dl}>
                  {PROCESS.map(([k, v]) => (
                    <div key={k} className={styles.row}>
                      <dt className={styles.dt}>{k}</dt>
                      <dd className={styles.dd}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </Reveal>

            <Reveal
              preset="base"
              y={14}
              delay={0.06}
              className={styles.ledgerReveal}
            >
              <section className={styles.ledger} aria-labelledby="safety-label">
                <div className={styles.ledgerHead}>
                  <p id="safety-label" className={styles.ledgerTitle}>
                    SAFETY
                  </p>
                  <p className={styles.ledgerNote}>清潔と判断</p>
                </div>

                <dl className={styles.dl}>
                  {SAFETY.map(([k, v]) => (
                    <div key={k} className={styles.row}>
                      <dt className={styles.dt}>{k}</dt>
                      <dd className={styles.dd}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </Reveal>
          </div>

          <Reveal preset="base" y={12} delay={0.12}>
            <p className={styles.promise}>
              ケアの指示を守れない方は、お断りします。
            </p>
          </Reveal>

          <div className={styles.hairline} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
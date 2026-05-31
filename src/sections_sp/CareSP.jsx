// src/sections_sp/CareSP.jsx
import styles from "./CareSP.module.css";
import Reveal from "../components/Reveal";

const PROOF_IMG = "/care/care-proof.png";

const PROCESS = [
  ["予約", "部位・サイズ・イメージを送る（短くてOK）"],
  ["下絵確認", "当日、線と配置を決める。ここで止められます。"],
  ["施術", "休憩を挟みながら進めます"],
  ["ケア", "当日から数日分の手順を渡します"],
];

const SAFETY = [
  ["使い捨て", "針・手袋・消耗品は毎回交換"],
  ["清潔", "接触面は施術ごとに拭き上げ"],
  ["肌", "状態が悪い日は施術を行いません"],
  ["NG", "飲酒 / 体調不良 / 日焼け直後は不可"],
];

function Ledger({ id, title, note, rows, delay = 0 }) {
  return (
    <Reveal preset="base" y={14} delay={delay} className={styles.ledgerReveal}>
      <section className={styles.ledger} aria-labelledby={id}>
        <div className={styles.ledgerHead}>
          <h3 id={id} className={styles.ledgerTitle}>
            {title}
          </h3>
          <p className={styles.ledgerNote}>{note}</p>
        </div>

        <dl className={styles.dl}>
          {rows.map(([k, v]) => (
            <div key={k} className={styles.row}>
              <dt className={styles.dt}>{k}</dt>
              <dd className={styles.dd}>{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </Reveal>
  );
}

export default function CareSP() {
  return (
    <section
      id="care_sp"
      className={styles.section}
      aria-labelledby="care-title_sp"
      style={{ "--care-bg": `url(${PROOF_IMG})` }}
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <Reveal preset="base" y={14}>
            <p className={styles.kicker}>CARE</p>
          </Reveal>

          <Reveal preset="base" y={14} delay={0.04}>
            <h2 id="care-title_sp" className={styles.title}>
              当日の流れ / 清潔基準
            </h2>
          </Reveal>

          <Reveal preset="base" y={14} delay={0.08}>
            <p className={styles.lead}>迷わないための順番とNGだけ。</p>
          </Reveal>
        </header>

        <div className={styles.ledgers} aria-label="Care ledgers (SP)">
          <Ledger
            id="process-label_sp"
            title="PROCESS"
            note="当日の流れ"
            rows={PROCESS}
            delay={0.10}
          />

          <Ledger
            id="safety-label_sp"
            title="SAFETY"
            note="清潔と判断"
            rows={SAFETY}
            delay={0.16}
          />
        </div>

        <Reveal preset="base" y={12} delay={0.20}>
          <p className={styles.promise}>ケアの指示を守れない方は、お断りします。</p>
        </Reveal>

        <div className={styles.hairline} aria-hidden="true" />
      </div>
    </section>
  );
}
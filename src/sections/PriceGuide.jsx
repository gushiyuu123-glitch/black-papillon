// src/sections/PriceGuide.jsx
import { useRef } from "react";
import styles from "./PriceGuide.module.css";
import Reveal from "../components/Reveal";
import Butterfly from "../components/Butterfly";
import LogoSvgReveal from "../components/SvgStaggerReveal.jsx";

const TITLE_SVG = "/type/PRICEGUIDE.svg";
const BF_DIR = "/type";

// 数字は仮（後で差し替え）
const TIERS = [
  { key: "one", name: "ワンポイント", price: "¥18,000〜", sessions: "1回", note: "" },
  { key: "std", name: "標準", price: "¥45,000〜¥95,000", sessions: "1〜2回", note: "" },
  {
    key: "cover",
    name: "大きめ / カバー",
    price: "要相談",
    sessions: "複数回",
    note: "カバーは状態を見て決めます。",
  },
];

export default function PriceGuide() {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      id="price"
      className={styles.section}
      aria-labelledby="price-title"
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <Reveal preset="base" y={12}>
            <p className={styles.kicker}>料金</p>
          </Reveal>

          {/* タイトル + 蝶（Heroと同じ：親relative + 中でabsolute） */}
          <div className={styles.titleWrap} data-bfly-flap>
            <Reveal preset="base" y={18} className={styles.titleReveal}>
              <div className={styles.titleStage}>
                <h2 id="price-title" className={styles.srOnly}>
                  PRICE GUIDE
                </h2>

                <LogoSvgReveal
                  className={styles.titleSvg}
                  src={TITLE_SVG}
                  ariaLabel="PRICE GUIDE"
                />

                <Butterfly
                  triggerRef={sectionRef}
                  className={styles.bflyOnTitle}
                  dir={BF_DIR}
                  scrub={1.05}
                  cycles={0.72}
                  alpha={0.78}
                  drift={{ x: 10, y: 16, rot: 3 }}
                  driftScrub={0.9}
                  introDelay={0.22}
                  introDur={0.34}
                  disabledOnCoarse={true}
                  flapOnHover={true}
                  hoverScopeRef={sectionRef}
                  hoverSelector="[data-bfly-flap]"
                  hoverDur={0.62}
                  hoverCooldown={0.42}
                />
              </div>
            </Reveal>
          </div>

          {/* ✅ 二度言い削除：leadは1文だけ */}
          <Reveal preset="base" y={12} delay={0.05}>
            <p className={styles.lead}>確定は下絵が決まってから。</p>
          </Reveal>

          <Reveal preset="base" y={12} delay={0.08}>
            <p className={styles.how}>
              決まり方：サイズ / 密度（線と影の量） / 回数（分けて進めるか）
            </p>
          </Reveal>
        </header>

        {/* 3ティア：左→右で順番に出す */}
        <div className={styles.tiers} role="list" aria-label="Price tiers">
          {TIERS.map((t, i) => (
            <article
              key={t.key}
              className={styles.tier}
              role="listitem"
              data-bfly-flap
            >
              <Reveal preset="base" y={18} delay={0.1 + i * 0.09}>
                <div className={styles.tierTop}>
                  <p className={styles.tierName}>{t.name}</p>
                  <p className={styles.tierPrice}>{t.price}</p>
                </div>

                <div className={styles.tierMeta}>
                  <span className={styles.metaLabel}>目安</span>
                  <span className={styles.metaValue}>{t.sessions}</span>
                </div>

                {!!t.note && <p className={styles.tierNote}>{t.note}</p>}

                <div className={styles.tierLine} aria-hidden="true" />
              </Reveal>
            </article>
          ))}
        </div>

        <Reveal preset="base" y={14} delay={0.26}>
          <div className={styles.adjust}>
            <p className={styles.adjustTitle}>微調整 / アフターフォロー</p>
            <p className={styles.adjustText}>
              施術後1ヶ月を目安に一度確認します。必要な場合のみご案内します。
            </p>
            <p className={styles.adjustFoot}>※アフターケアを守っていただいた場合に限ります。</p>
          </div>
        </Reveal>

        <div className={styles.hairline} aria-hidden="true" />
      </div>
    </section>
  );
}
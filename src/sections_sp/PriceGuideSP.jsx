// src/sections_sp/PriceGuideSP.jsx
import { useRef } from "react";
import styles from "./PriceGuideSP.module.css";
import Reveal from "../components/Reveal";
import Butterfly from "../components/Butterfly";
import SvgStaggerReveal from "../components/SvgStaggerReveal.jsx";

const TITLE_SVG = "/type/PRICEGUIDE.svg";
const BF_DIR = "/type";

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

export default function PriceGuideSP() {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      id="price_sp"
      className={styles.section}
      aria-labelledby="price-title_sp"
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <Reveal preset="base" y={12}>
            <p className={styles.kicker}>料金</p>
          </Reveal>

          {/* タイトル（SVG）+ 蝶：hover対象はタイトルだけ */}
          <div className={styles.titleWrap} data-bfly-flap="title">
            <Reveal preset="base" y={18} className={styles.titleReveal}>
              <div className={styles.titleStage}>
                <h2 id="price-title_sp" className={styles.srOnly}>
                  PRICE GUIDE
                </h2>

                <SvgStaggerReveal
                  className={styles.titleSvg}
                  src={TITLE_SVG}
                  ariaLabel="PRICE GUIDE"
                  stagger={0.05}
                  duration={0.52}
                  y={10}
                />

                <Butterfly
                  triggerRef={sectionRef}
                  className={styles.bflyOnTitle}
                  dir={BF_DIR}
                  scrub={1.65}
                  cycles={0.28}
                  alpha={0.72}
                  drift={{ x: 4, y: 7, rot: 1.2 }}
                  driftScrub={1.2}
                  introDelay={0.2}
                  introDur={0.52}
                  disabledOnCoarse={true}
                  flapOnHover={true}
                  hoverScopeRef={sectionRef}
                  hoverSelector='[data-bfly-flap="title"]'
                  hoverDur={0.72}
                  hoverCooldown={0.95}
                />
              </div>
            </Reveal>
          </div>

          <Reveal preset="base" y={12} delay={0.05}>
            <p className={styles.lead}>確定は下絵が決まってから。</p>
          </Reveal>

          <Reveal preset="base" y={12} delay={0.08}>
            <p className={styles.how}>
              決まり方：サイズ / 密度（線と影の量） / 回数（分けて進めるか）
            </p>
          </Reveal>
        </header>

        {/* SP：1列帳簿（tierにはhoverを付けない） */}
        <div className={styles.tiers} role="list" aria-label="Price tiers (SP)">
          {TIERS.map((t, i) => (
            <article key={t.key} className={styles.tier} role="listitem">
              <Reveal preset="base" y={16} delay={0.10 + i * 0.08}>
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
            <p className={styles.adjustFoot}>
              ※アフターケアを守っていただいた場合に限ります。
            </p>
          </div>
        </Reveal>

        <div className={styles.hairline} aria-hidden="true" />
      </div>
    </section>
  );
}
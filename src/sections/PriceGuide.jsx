import { useRef } from "react";
import styles from "./PriceGuide.module.css";
import Reveal from "../components/Reveal";
import Butterfly from "../components/Butterfly";
import LogoSvgReveal from "../components/SvgStaggerReveal.jsx";

const TITLE_SVG = "/type/PRICEGUIDE.svg";
const BF_DIR = "/type";

// 数字は仮。あとで差し替え
const TIERS = [
  { key: "one", name: "ワンポイント", price: "¥18,000〜", sessions: "1回", note: "" },
  { key: "std", name: "標準", price: "¥45,000〜¥95,000", sessions: "1–2回", note: "" },
  {
    key: "cover",
    name: "大きめ / カバー",
    price: "要相談",
    sessions: "分けて進行",
    note: "カバーは状態で変わるので、見て決めます。",
  },
];

export default function PriceGuide() {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      id="price"
      className={styles.section}
      aria-labelledby="price-label"
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <Reveal preset="base" y={12}>
            <p id="price-label" className={styles.kicker}>
              料金
            </p>
          </Reveal>

          {/* タイトル + 蝶（Heroと同じ：親をrelativeにして、その中でabsolute配置） */}
          <div className={styles.titleWrap} data-bfly-flap>
            <Reveal preset="base" y={18} className={styles.titleReveal}>
              <div className={styles.titleStage}>
                <LogoSvgReveal
                  className={styles.titleSvg}
                  src={TITLE_SVG}
                  ariaLabel="PRICE GUIDE"
                />

      <Butterfly
  triggerRef={sectionRef}
  className={styles.bflyOnTitle}
  dir={BF_DIR}

  // ✅ スクロール連動は“重く”して滑らかに
  scrub={1.35}

  // ✅ 羽ばたき周期を落として“生き物”に
  cycles={0.56}

  // ✅ 透明度は少し落として気配に
  alpha={0.74}

  // ✅ 揺れ幅を減らす（大きいと玩具っぽい）
  drift={{ x: 7, y: 11, rot: 2 }}

  // ✅ 慣性を少し増やす（ヌルっと遅れて追従）
  driftScrub={1.05}

  // ✅ 入りは気配→像が整う
  introDelay={0.28}
  introDur={0.48}

  disabledOnCoarse={true}

  // ✅ hoverは“短くパタパタ”じゃなく“ふわっ”
  flapOnHover={true}
  hoverScopeRef={sectionRef}
  hoverSelector="[data-bfly-flap]"
  hoverDur={0.74}
  hoverCooldown={0.55}
/>
              </div>
            </Reveal>
          </div>

          <Reveal preset="base" y={12} delay={0.05}>
            <p className={styles.lead}>
              金額は下絵が決まってから確定します。サイズと密度で前後します。
            </p>
          </Reveal>

          <Reveal preset="base" y={12} delay={0.08}>
            <p className={styles.how}>
              決まり方：サイズ / 密度（線の量・影） / 回数（分けて進めるか）
            </p>
          </Reveal>
        </header>

        {/* 3ティア：左→右で順番に出す */}
        <div className={styles.tiers} role="list" aria-label="Price tiers">
          {TIERS.map((t, i) => (
            <article key={t.key} className={styles.tier} role="listitem" data-bfly-flap>
              <Reveal preset="base" y={18} delay={0.10 + i * 0.09}>
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
            <p className={styles.adjustTitle}>微調整（目安：1ヶ月）</p>
            <p className={styles.adjustText}>
              施術後1ヶ月を目安に一度確認します。必要がある場合は微調整をご案内します。
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
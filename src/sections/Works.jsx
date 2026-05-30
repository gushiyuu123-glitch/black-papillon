// src/sections/Works.jsx
import { useRef } from "react";
import styles from "./Works.module.css";

import Reveal from "../components/Reveal";
import ParallaxMedia from "../components/ParallaxMedia";
import Butterfly from "../components/Butterfly";
import SvgStaggerReveal from "../components/SvgStaggerReveal";

// 左：局所作品
const WORKS_ITEMS = [
  { no: "01", tag: "FOREARM",  sub: "FINE LINE",    src: "/works/forearm.png",     alt: "Forearm tattoo close-up" },
  { no: "02", tag: "SHOULDER", sub: "BLACK & GREY", src: "/works/shoulder.jpeg",   alt: "Shoulder tattoo close-up" },
  { no: "03", tag: "ANKLE",    sub: "DETAIL",       src: "/works/ankle.png",       alt: "Ankle tattoo close-up" },
  { no: "04", tag: "CLOSE-UP", sub: "TEXTURE",      src: "/works/closeup-01.jpeg", alt: "Tattoo texture close-up" },
  { no: "05", tag: "CLOSE-UP", sub: "SILENCE",      src: "/works/closeup-02.jpeg", alt: "Tattoo detail close-up" },
];

// 右：世界観背景
const RIGHT_BG = "/works-bg1.jpeg";
const WORKS_SVG = "/type/WORKS.svg";

function Ticket({ no, tag, sub }) {
  return (
    <div className={styles.ticket} aria-hidden="true">
      <span className={styles.no}>{no}</span>
      <span className={styles.sep}>/</span>
      <span className={styles.tag}>{tag}</span>
      <span className={styles.sep}>/</span>
      <span className={styles.sub}>{sub}</span>
    </div>
  );
}

function Frame({ item, className = "", pmKind = "tail" }) {
  const pmClass =
    pmKind === "hit" ? styles.pmHit : pmKind === "soft" ? styles.pmHitSoft : styles.pmTail;

  // containの“背景だけ動く”を見えるようにする（やりすぎない）
  const pmTune =
    pmKind === "tail"
      ? { yPercent: 6, scale: 1.04, bgBlur: 12, bgOpacity: 0.62 }
      : { yPercent: 7, scale: 1.05, bgBlur: 10, bgOpacity: 0.68 };

  return (
    <figure className={`${styles.frame} ${className}`}>
      <Reveal preset="base" className={styles.mediaReveal}>
        <ParallaxMedia
          src={item.src}
          alt={item.alt}
          className={`${styles.pm} ${pmClass}`}
          fit="contain"
          yPercent={pmTune.yPercent}
          scale={pmTune.scale}
          bgBlur={pmTune.bgBlur}
          bgOpacity={pmTune.bgOpacity}
        />
      </Reveal>

      <figcaption className={styles.caption}>
        <Ticket no={item.no} tag={item.tag} sub={item.sub} />
      </figcaption>
    </figure>
  );
}

export default function Works() {
  const sectionRef = useRef(null);
  const hit = WORKS_ITEMS.slice(0, 2);
  const tail = WORKS_ITEMS.slice(2);

  return (
    <section
      id="works"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="works-title"
    >
      <div className={styles.inner}>
        {/* LEFT */}
        <div className={styles.left}>
          <header className={styles.head}>
            <Reveal preset="base" y={12}>
              <h2 id="works-title" className={styles.kicker}>
                WORKS
              </h2>
            </Reveal>

            <Reveal preset="base" y={12} delay={0.04}>
              <p className={styles.note}>Proof before words.</p>
            </Reveal>
          </header>

          <div className={styles.stage} aria-label="Works featured">
            <Frame item={hit[0]} className={styles.slotA} pmKind="hit" />
            <Frame item={hit[1]} className={styles.slotB} pmKind="soft" />
          </div>

          <div className={styles.tail} role="list" aria-label="Works gallery">
            {tail.map((it) => (
              <article key={it.no} className={styles.tailItem} role="listitem">
                <Frame
                  item={it}
                  className={`${styles.slotTail} ${it.no === "04" ? styles.slotBAlign : ""}`}
                  pmKind="tail"
                />
              </article>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <aside className={styles.right} aria-label="Works signature">
          <div className={styles.sticky}>
            <div className={styles.rightVisual}>
              <Reveal preset="base" className={styles.rightBgReveal}>
                <ParallaxMedia
                  src={RIGHT_BG}
                  alt=""
                  className={styles.rightBgMedia}
                  yPercent={6}
                  scale={1.04}
                />
              </Reveal>

              <div className={styles.rightOverlay}>
                <Reveal preset="base" className={styles.worksSvgReveal}>
                  <SvgStaggerReveal
                    src={WORKS_SVG}
                    className={styles.worksSvg}
                    stagger={0.06}
                    duration={0.55}
                    y={10}
                  />
                </Reveal>

                <div className={styles.bflyGroup} aria-hidden="true">
                  {/* ✅ 蝶：遅く自然（激しさを殺す） */}
                   <Butterfly
                    follow="page"
                    triggerRef={sectionRef}
                    className={styles.worksBfly}
                    dir="/type"
                    cycles={1.15}
                    alpha={0.82}
                    drift={{ x: 14, y: 18, rot: 4 }}
                    driftScrub={0.85}
                    introDelay={0.12}
                    introDur={0.26}
                    disabledOnCoarse={true}
                  />
                  <p className={styles.worksCopy}>Made to Last.</p>
                </div>

                <p className={styles.rightMeta} aria-hidden="true">
                  SELECTED DETAILS. NOTHING MORE.
                </p>
              </div>

              <div className={styles.rightSpine} aria-hidden="true" />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
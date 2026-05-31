// src/sections_sp/WorksSP.jsx
import { useRef } from "react";
import styles from "./WorksSP.module.css";

import Reveal from "../components/Reveal";
import ParallaxMedia from "../components/ParallaxMedia";
import SvgStaggerReveal from "../components/SvgStaggerReveal";
import Butterfly from "../components/Butterfly"; // ✅ 追加

const WORKS_ITEMS = [
  { no: "01", tag: "FOREARM",  sub: "FINE LINE",    src: "/works/forearm.png",     alt: "Forearm tattoo close-up" },
  { no: "02", tag: "SHOULDER", sub: "BLACK & GREY", src: "/works/shoulder.jpeg",   alt: "Shoulder tattoo close-up" },
  { no: "03", tag: "ANKLE",    sub: "DETAIL",       src: "/works/ankle.png",       alt: "Ankle tattoo close-up" },
  { no: "04", tag: "CLOSE-UP", sub: "TEXTURE",      src: "/works/closeup-01.jpeg", alt: "Tattoo texture close-up" },
  { no: "05", tag: "CLOSE-UP", sub: "SILENCE",      src: "/works/closeup-02.jpeg", alt: "Tattoo detail close-up" },
];

const RIGHT_BG = "/works-bg1.jpeg";
const WORKS_SVG = "/type/WORKS.svg";
const BF_DIR = "/type"; // ✅ 追加（b1〜のある場所）

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

function Frame({ item, className = "", tone = "hit" }) {
  const fit = tone === "tail" ? "contain" : "cover";

  const pmTune =
    fit === "contain"
      ? { yPercent: 6, scale: 1.04, bgBlur: 10, bgOpacity: 0.62 }
      : { yPercent: 6, scale: 1.035 };

  return (
    <figure className={`${styles.frame} ${className}`}>
      <Reveal preset="base" className={styles.mediaReveal}>
        <ParallaxMedia
          src={item.src}
          alt={item.alt}
          className={`${styles.pm} ${tone === "soft" ? styles.pmSoft : ""}`}
          fit={fit}
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

export default function WorksSP() {
  const sectionRef = useRef(null);
  const hit = WORKS_ITEMS.slice(0, 2);
  const tail = WORKS_ITEMS.slice(2);

  return (
    <section
      id="works_sp"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="works-title_sp"
    >
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.headOverlay}>
            <Reveal preset="base" y={12}>
              <h2 id="works-title_sp" className={styles.kicker}>
                WORKS
              </h2>
            </Reveal>

            <Reveal preset="base" y={12} delay={0.04}>
              <p className={styles.note}>Proof before words.</p>
            </Reveal>
          </div>

          <Frame item={hit[0]} className={styles.slotA} tone="hit" />
        </div>

        <Frame item={hit[1]} className={styles.slotB} tone="soft" />

        <div className={styles.signature} aria-label="Works signature">
          <Reveal preset="base" className={styles.sigBgReveal}>
            <ParallaxMedia
              src={RIGHT_BG}
              alt=""
              className={styles.sigBgMedia}
              yPercent={5}
              scale={1.04}
              fit="cover"
            />
            
                <Butterfly
                  triggerRef={sectionRef}
                  className={styles.bflyOnWorks}
                  dir={BF_DIR}
                  scrub={1.85}
                  cycles={0.22}
                  alpha={0.62}
                  drift={{ x: 4, y: 8, rot: 1.2 }}
                  driftScrub={1.25}
                  introDelay={0.18}
                  introDur={0.46}
                  disabledOnCoarse={true}
                  flapOnHover={false}
                />
          </Reveal>

          <div className={styles.sigOverlay}>
            <Reveal preset="base" className={styles.worksSvgReveal}>
              {/* ✅ SVGをステージ化して、その“下”に蝶 */}
              <div className={styles.worksStage}>
                <SvgStaggerReveal
                  src={WORKS_SVG}
                  className={styles.worksSvg}
                  stagger={0.06}
                  duration={0.55}
                  y={10}
                />

              </div>
            </Reveal>

            <p className={styles.sigCopy}>Made to Last.</p>

            <p className={styles.sigMeta} aria-hidden="true">
              SELECTED DETAILS. NOTHING MORE.
            </p>
          </div>

          <div className={styles.sigSpine} aria-hidden="true" />
        </div>

        <div className={styles.tail} role="list" aria-label="Works gallery (SP)">
          {tail.map((it, idx) => (
            <article
              key={it.no}
              className={`${styles.tailItem} ${idx % 2 === 1 ? styles.tailEven : ""}`}
              role="listitem"
            >
              <Frame item={it} className={styles.slotTail} tone="tail" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
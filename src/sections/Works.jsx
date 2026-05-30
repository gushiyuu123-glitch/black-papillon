// src/sections/Works.jsx
import { useRef } from "react";
import styles from "./Works.module.css";

import Reveal from "../components/Reveal";
import ParallaxMedia from "../components/ParallaxMedia";
import Butterfly from "../components/Butterfly";
import SvgStaggerReveal from "../components/SvgStaggerReveal"; // ✅ 追加（SVGだけ演出）

// 左：局所作品（publicに置いたら差し替え）
const WORKS_ITEMS = [
  {
    no: "01",
    tag: "FOREARM",
    sub: "FINE LINE",
    src: "/works/forearm.png",
    alt: "Forearm tattoo close-up",
  },
  {
    no: "02",
    tag: "SHOULDER",
    sub: "BLACK & GREY",
    src: "/works/shoulder.jpeg",
    alt: "Shoulder tattoo close-up",
  },
  {
    no: "03",
    tag: "ANKLE",
    sub: "DETAIL",
    src: "/works/ankle.png",
    alt: "Ankle tattoo close-up",
  },
  {
    no: "04",
    tag: "CLOSE-UP",
    sub: "TEXTURE",
    src: "/works/closeup-01.jpeg",
    alt: "Tattoo texture close-up",
  },
  {
    no: "05",
    tag: "CLOSE-UP",
    sub: "SILENCE",
    src: "/works/closeup-02.jpeg",
    alt: "Tattoo detail close-up",
  },
];

// 右：世界観背景（1枚）
const RIGHT_BG = "/works-bg1.jpeg";

// WORKS SVG（Figma export → public）
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

function Frame({ item, className }) {
  return (
    <figure className={`${styles.frame} ${className}`}>
      <Reveal preset="base" className={styles.mediaReveal}>
        <ParallaxMedia
          src={item.src}
          alt={item.alt}
          className={styles.pm}
          fit="contain"
          yPercent={4}
          scale={1.01}
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
      aria-labelledby="works-label"
    >
      <div className={styles.inner}>
        {/* LEFT：局所作品（証拠） */}
        <div className={styles.left}>
          <header className={styles.head}>
            <p id="works-label" className={styles.kicker}>
              WORKS
            </p>
            <p className={styles.note}>Proof before words.</p>
          </header>

          {/* 1st stage：2枚で“構図”を作る（縦×横） */}
          <div className={styles.stage} aria-label="Works featured">
            <Frame item={hit[0]} className={styles.slotA} />
            <Frame item={hit[1]} className={styles.slotB} />
          </div>

          {/* tail：静かに流す（4枚目だけslotB位置へ） */}
          <div className={styles.tail} role="list" aria-label="Works gallery">
            {tail.map((it) => (
              <article key={it.no} className={styles.tailItem} role="listitem">
                <Frame
                  item={it}
                  className={`${styles.slotTail} ${
                    it.no === "04" ? styles.slotBAlign : ""
                  }`}
                />
              </article>
            ))}
          </div>
        </div>

        {/* RIGHT：世界観（背景）＋WORKS（SVG）＋蝶＋コピー */}
        <aside className={styles.right} aria-label="Works signature">
          <div className={styles.sticky}>
            <div className={styles.rightVisual}>
              {/* 背景（ParallaxMedia） */}
              <Reveal preset="base" className={styles.rightBgReveal}>
                <ParallaxMedia
                  src={RIGHT_BG}
                  alt=""
                  className={styles.rightBgMedia}
                  yPercent={4}
                  scale={1.02}
                />
              </Reveal>

              {/* overlay */}
              <div className={styles.rightOverlay}>
                {/* WORKS SVG（✅ 左→右で一文字ずつフェードイン） */}
                <Reveal preset="base" className={styles.worksSvgReveal}>
                  <SvgStaggerReveal
                    src={WORKS_SVG}
                    className={styles.worksSvg}
                    /* ここは好みで微調整OK（SVG以外は触ってないので安全） */
                    stagger={0.06}
                    duration={0.55}
                    y={10}
                  />
                </Reveal>

                {/* Butterfly + copy（中心より少し右） */}
                <div className={styles.bflyGroup} aria-hidden="true">
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

              {/* spine（気配） */}
              <div className={styles.rightSpine} aria-hidden="true" />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
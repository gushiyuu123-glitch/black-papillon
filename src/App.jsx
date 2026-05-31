// src/App.jsx
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Header from "./components/Header";
import HeaderSP from "./components/HeaderSP";

// PC（既存そのまま）
import HeroPC from "./sections/HeroPC";
import Works from "./sections/Works";
import Healed from "./sections/Healed";
import Style from "./sections/Style";
import Care from "./sections/Care";
import PriceGuide from "./sections/PriceGuide";
import Booking from "./sections/Booking";
import Footer from "./sections/Footer";

// SP（これから増やす）
import HeroSP from "./sections_sp/HeroSP";
import WorksSP from "./sections_sp/WorksSP";
import HealedSP from "./sections_sp/HealedSP";
import StyleSP from "./sections_sp/StyleSP";
import CareSP from "./sections_sp/CareSP";
import PriceGuideSP from "./sections_sp/PriceGuideSP";
import BookingSP from "./sections_sp/BookingSP";
import FooterSP from "./sections_sp/FooterSP";

gsap.registerPlugin(ScrollTrigger);

// ✅ CSS側（PCを隠す境界）に合わせる
const SP_MAX = 899;

// ✅ SP判定（幅だけだと viewport/デスクトップ表示でズレるので coarse も加える）
function getIsSP() {
  if (typeof window === "undefined") return false;
  const coarse = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  const narrow = window.matchMedia?.(`(max-width: ${SP_MAX}px)`)?.matches ?? false;
  return coarse || narrow;
}

function PCTree() {
  return (
    <div data-device="pc">
      <Header heroId="hero" />
      <HeroPC />
      <Works />
      <Healed />
      <Style />
      <Care />
      <PriceGuide />
      <Booking />
      <Footer />
    </div>
  );
}

function SPTree() {
  return (
    <div data-device="sp">
      <HeaderSP
        heroId="hero_sp"
        topId="hero_sp"
        worksId="works_sp"
        priceId="price_sp"
      />
      <HeroSP />
      <WorksSP />
      <HealedSP />
      <StyleSP />
      <CareSP />
      <PriceGuideSP />
      <BookingSP />
      <FooterSP />
    </div>
  );
}

export default function App() {
  const lenisRef = useRef(null);
  const tickRef = useRef(null);

  // ✅ 初期値を getIsSP() で決めて “初回ズレ/チラつき” を消す
  const [isSP, setIsSP] = useState(() => getIsSP());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mqlWidth = window.matchMedia(`(max-width: ${SP_MAX}px)`);
    const mqlCoarse = window.matchMedia("(pointer: coarse)");

    const apply = () => setIsSP(getIsSP());
    apply();

    const onChange = apply;

    if (mqlWidth.addEventListener) mqlWidth.addEventListener("change", onChange);
    else mqlWidth.addListener(onChange);

    if (mqlCoarse.addEventListener) mqlCoarse.addEventListener("change", onChange);
    else mqlCoarse.addListener(onChange);

    return () => {
      if (mqlWidth.removeEventListener) mqlWidth.removeEventListener("change", onChange);
      else mqlWidth.removeListener(onChange);

      if (mqlCoarse.removeEventListener) mqlCoarse.removeEventListener("change", onChange);
      else mqlCoarse.removeListener(onChange);
    };
  }, []);

  useEffect(() => {
    // ✅ SPではLenis起動しない
    if (isSP) return;

    // ✅ StrictMode 二重起動ガード
    if (lenisRef.current) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const coarse =
      window.matchMedia?.("(pointer: coarse)")?.matches ?? false;

    // coarse はここでも最終ガード（SP判定漏れの保険）
    if (reduce || coarse) return;

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      anchors: true,
      stopInertiaOnNavigate: true,
      syncTouch: false, // ✅ 触り始めの違和感を避ける
    });

    lenisRef.current = lenis;

    // ScrollTrigger同期
    lenis.on("scroll", ScrollTrigger.update);

    // ✅ Lenis駆動は GSAP ticker に統一（rAF二重駆動を避ける）
    const onTick = (time) => lenis.raf(time * 1000);
    tickRef.current = onTick;

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // ✅ refreshは “落ち着いてから1回”
    let cancelled = false;
    (async () => {
      try {
        if (document.fonts?.ready) await document.fonts.ready;
      } catch {
        // ignore
      }
      if (cancelled) return;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) ScrollTrigger.refresh(true);
        });
      });
    })();

    return () => {
      cancelled = true;

      if (tickRef.current) gsap.ticker.remove(tickRef.current);
      tickRef.current = null;

      lenis.destroy();
      lenisRef.current = null;

      // ✅ 念のため整地
      ScrollTrigger.refresh(true);
    };
  }, [isSP]);

  return isSP ? <SPTree /> : <PCTree />;
}
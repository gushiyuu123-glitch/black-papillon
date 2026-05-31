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
      <HeaderSP heroId="hero_sp" topId="hero_sp" worksId="works_sp" priceId="price_sp" />
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

  // ✅ 初期値をmatchMediaで決めて“初回チラつき”を消す
  const [isSP, setIsSP] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.(`(max-width: ${SP_MAX}px)`)?.matches ?? false;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(`(max-width: ${SP_MAX}px)`);
    const apply = () => setIsSP(!!mql.matches);

    apply();

    if (mql.addEventListener) mql.addEventListener("change", apply);
    else mql.addListener(apply);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", apply);
      else mql.removeListener(apply);
    };
  }, []);

  useEffect(() => {
    // ✅ SPではLenis起動しない
    if (isSP) return;

    // StrictMode二重起動ガード
    if (lenisRef.current) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const coarse = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;

    if (reduce || coarse) return;

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      anchors: true,
      stopInertiaOnNavigate: true,
      syncTouch: false,
    });

    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time) => lenis.raf(time * 1000);
    tickRef.current = onTick;

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      if (tickRef.current) gsap.ticker.remove(tickRef.current);
      tickRef.current = null;

      lenis.destroy();
      lenisRef.current = null;

      ScrollTrigger.refresh();
    };
  }, [isSP]);

  return isSP ? <SPTree /> : <PCTree />;
}
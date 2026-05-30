import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "./components/Header";
import HeroPC from "./sections/HeroPC";
import Works from "./sections/Works";
import Healed from "./sections/Healed";
import Style from "./sections/Style";
import Care from "./sections/Care";
import PriceGuide from "./sections/PriceGuide";
import Booking from "./sections/Booking";
import Footer from "./sections/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const coarse =
      window.matchMedia?.("(pointer: coarse)")?.matches ?? false;

    // ✅ PCのみ（SPは最後、の方針とも合う）
    if (reduce || coarse) return;

    const lenis = new Lenis({
      // “質量”寄り（BLACK PAPILLON向け）
      lerp: 0.085,
      smoothWheel: true,

      // ✅ アンカー(#works等)有効化
      anchors: true,
      stopInertiaOnNavigate: true,

      // touchはSPで設計してから（今は触らない）
      syncTouch: false,
    });

    // ✅ ScrollTrigger同期（公式推奨）
    lenis.on("scroll", ScrollTrigger.update);
    const onTick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // 初回だけ整合
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div>
         <Header heroId="hero" />
      <HeroPC />
      <Works />
      <Healed />
      <Style />
      <Care />
      <PriceGuide />
      <Booking />
      <Footer />
      {/* SPは最後に作る */}
    </div>
  );
}
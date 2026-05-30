import { useEffect, useRef } from "react";
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
  const lenisRef = useRef(null);
  const tickRef = useRef(null);

  useEffect(() => {
    // StrictMode二重起動ガード
    if (lenisRef.current) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const coarse =
      window.matchMedia?.("(pointer: coarse)")?.matches ?? false;

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
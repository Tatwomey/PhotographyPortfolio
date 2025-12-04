// pages/music/dionbk25.js
import React, { useEffect } from "react";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Lenis from "lenis";

const photos = [
  { src: "/dionbk25/dionbk_25_trevortwomey-1.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-2.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-3.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-4.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-5.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-6.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-7.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-8.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-9.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-10.jpg", type: "portrait" },

  { src: "/dionbk25/dionbk_25_trevortwomey-11.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-12.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-13.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-14.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-15.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-16.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-17.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-18.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-19.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-20.jpg", type: "portrait" },

  { src: "/dionbk25/dionbk_25_trevortwomey-21.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-22.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-23.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-24.jpg", type: "portrait" },
  { src: "/dionbk25/dionbk_25_trevortwomey-25.jpg", type: "portrait" },
];

export default function Dionbk25() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis();
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const timer = setTimeout(() => {
      const anchor = document.getElementById("dionbk-photos-25");
      if (anchor) anchor.scrollIntoView({ behavior: "smooth" });
    }, 500);

    return () => {
      clearTimeout(timer);
      lenis.destroy();
    };
  }, []);

  return (
    <div>
      <Hero />
      <Portfolio photos={photos} sectionId="dionbk-photos-25" />
    </div>
  );
}

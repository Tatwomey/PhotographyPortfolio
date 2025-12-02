// pages/music/dion25unionpool.jsx
import React, { useEffect } from "react";
import withAuth from "@/utils/withAuth";
import Hero from Hero
import Portfolio from "Portfolio"
import Lenis from "lenis";

// Korn MetLife 2025 — 24 is PORTRAIT, 25 is LANDSCAPE, 26 PORTRAIT.
// ?v=fix1 appended to 24 & 25 to bust Next/Image cache after orientation swap.
const photos = [
  { src: "/korn2025/korn_metlife_trevortwomey-1.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-2.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-3.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-4.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-5.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-6.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-7.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-8.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-9.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-10.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-11.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-12.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-13.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-14.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-15.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-16.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-17.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-18.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-19.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-20.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-21.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-22.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-23.jpg", type: "portrait" },

  // 24 = portrait (cache-busted)
  {
    src: "/korn2025/korn_metlife_trevortwomey-24.jpg?v=fix1",
    type: "portrait",
  },

  // 25 = landscape (cache-busted)
  {
    src: "/korn2025/korn_metlife_trevortwomey-25.jpg?v=fix1",
    type: "landscape",
  },

  // 26 = portrait
  { src: "/korn2025/korn_metlife_trevortwomey-26.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-27.jpg", type: "portrait" },

  // continue as needed…
];

const Dion25unionpool = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // smooth scrolling loop (kept here so page has same feel)
    const lenis = new Lenis();
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // small nudge to bring gallery into view
    const t = setTimeout(() => {
      const el = document.getElementById("korn-photos-2025");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 500);

    return () => {
      clearTimeout(t);
      lenis.destroy();
    };
  }, []);

  return (
    
      <Hero />
      <Portfolio photos={photos} sectionId="dion-photos-25" />
    </div>
  );
};

export default withAuth(Dion25unionpool);
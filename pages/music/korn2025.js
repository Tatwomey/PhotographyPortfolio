// pages/music/korn2025.jsx
import React, { useEffect } from "react";
import withAuth from "@/utils/withAuth";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Lenis from "@studio-freight/lenis";

// Korn MetLife 2025 — sequential order 1–28 (only 26 is landscape)
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
  { src: "/korn2025/korn_metlife_trevortwomey-24.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-25.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-26.jpg", type: "landscape" },
  { src: "/korn2025/korn_metlife_trevortwomey-27.jpg", type: "portrait" },
  { src: "/korn2025/korn_metlife_trevortwomey-28.jpg", type: "portrait" },
];

const Korn2025 = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis();
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    setTimeout(() => {
      const section = document.getElementById("korn-photos-2025");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);

    return () => lenis.destroy();
  }, []);

  return (
    <div>
      <Hero />
      <Portfolio photos={photos} sectionId="korn-photos-2025" />
    </div>
  );
};

export default withAuth(Korn2025, ["/music/korn2025"]);

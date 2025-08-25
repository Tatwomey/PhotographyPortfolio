// pages/music/korn24.jsx
import React, { useEffect } from "react";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Lenis from "@studio-freight/lenis";

const photos = [
  { src: "/korn24/korn_2024_trevortwomey-1.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-2.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-3.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-4.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-5.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-6.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-7.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-8.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-9.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-10.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-11.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-12.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-13.jpg", type: "landscape" },
  { src: "/korn24/korn_2024_trevortwomey-14.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-15.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-16.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-17.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-18.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-19.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-20.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-51.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-52.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-21.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-22.jpg", type: "landscape" },
  { src: "/korn24/korn_2024_trevortwomey-49.jpg", type: "landscape" },
  { src: "/korn24/korn_2024_trevortwomey-23.jpg", type: "landscape" },
  { src: "/korn24/korn_2024_trevortwomey-24.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-25.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-26.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-50.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-28.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-27.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-30.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-31.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-32.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-33.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-34.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-37.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-36.jpg", type: "landscape" },
  { src: "/korn24/korn_2024_trevortwomey-35.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-38.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-40.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-39.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-41.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-42.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-43.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-44.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-45.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-46.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-48.jpg", type: "landscape" },
];

const Korn24 = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis();
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    setTimeout(() => {
      const section = document.getElementById("korn-photos");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 500); // Allow time for layout + DOM paint

    return () => lenis.destroy();
  }, []);

  return (
    <div>
      <Hero />
      <Portfolio photos={photos} sectionId="korn-photos" />
    </div>
  );
};

export default Korn24;

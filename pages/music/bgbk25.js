// pages/music/bgbk25.js
import React, { useEffect } from "react";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Lenis from "lenis";
import withAuth from "@/utils/withAuth";

const photos = [
  { src: "/bgbk25/bgbk_25_trevortwomey-1.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-2.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-3.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-4.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-5.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-6.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-7.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-8.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-9.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-10.jpg", type: "portrait" },

  { src: "/bgbk25/bgbk_25_trevortwomey-11.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-12.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-13.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-14.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-15.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-16.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-17.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-18.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-19.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-20.jpg", type: "portrait" },

  { src: "/bgbk25/bgbk_25_trevortwomey-21.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-22.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-23.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-24.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-25.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-26.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-27.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-28.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-29.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-30.jpg", type: "portrait" },

  { src: "/bgbk25/bgbk_25_trevortwomey-31.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-32.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-33.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-34.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-35.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-36.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-37.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-38.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-39.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-40.jpg", type: "portrait" },

  { src: "/bgbk25/bgbk_25_trevortwomey-41.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-42.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-43.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-44.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-45.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-46.jpg", type: "portrait" },
  { src: "/bgbk25/bgbk_25_trevortwomey-47.jpg", type: "landscape" },
];
function Bgbk25() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis();
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const timer = setTimeout(() => {
      const anchor = document.getElementById("bgbk-photos-25");
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
      <Portfolio
        photos={photos}
        sectionId="bgbk-photos-25"
        enableDownload // 🔐 this gallery shows the download button
      />
    </div>
  );
}

export default withAuth(Bgbk25);

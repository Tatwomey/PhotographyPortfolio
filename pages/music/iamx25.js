// pages/music/iamx25.js
import React, { useEffect } from "react";
import withAuth from "@/utils/withAuth";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Lenis from "lenis";

// ---- IAMX 2025 PHOTO SET (19 — all portrait) ----
const photos = [
  { src: "/iamx25/iamx_2025_trevortwomey-1.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-2.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-3.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-4.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-5.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-6.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-7.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-8.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-9.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-10.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-11.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-12.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-13.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-14.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-15.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-16.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-17.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-18.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-19.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-20.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-21.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-22.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-23.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-24.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-25.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-26.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-27.jpg", type: "portrait" },
  { src: "/iamx25/iamx_2025_trevortwomey-28.jpg", type: "portrait" },
];

function IAMX25() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis();
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const timer = setTimeout(() => {
      const el = document.getElementById("iamx-photos-25");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
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
        sectionId="iamx-photos-25"
        enableDownload={true} // ✅ iamx25 gallery: downloads ON
      />
    </div>
  );
}

// ✅ Page is now credential-gated (requires a valid NextAuth session)
export default withAuth(IAMX25);

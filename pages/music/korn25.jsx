// pages/music/korn25.jsx
import React, { useEffect } from "react";
import withAuth from "@/utils/withAuth";
import Hero from "@/components/Hero"; // Optional — remove if you want a pure lookbook layout
import Lookbook from "@/components/Lookbook";
import Lenis from "@studio-freight/lenis";

const photos = [
  [
    { src: "/korn25/korn25_01a.jpg", alt: "Look 1 Left" },
    { src: "/korn25/korn25_01b.jpg", alt: "Look 1 Right" },
  ],
  [
    { src: "/korn25/korn25_02a.jpg", alt: "Look 2 Left" },
    { src: "/korn25/korn25_02b.jpg", alt: "Look 2 Right" },
  ],
  [
    { src: "/korn25/korn25_03a.jpg", alt: "Look 3 Left" },
    { src: "/korn25/korn25_03b.jpg", alt: "Look 3 Right" },
  ],
  // Add more pairs as needed
];

const Korn25 = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis();
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    setTimeout(() => {
      const section = document.getElementById("korn25-photos");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);

    return () => lenis.destroy();
  }, []);

  return (
    <div>
      <Hero /> {/* Optional — remove if not part of the aesthetic */}
      <Lookbook photos={photos} sectionId="korn25-photos" />
    </div>
  );
};

export default withAuth(Korn25, ["/music/korn25"]);

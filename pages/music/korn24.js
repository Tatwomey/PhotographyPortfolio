import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Lenis from "@studio-freight/lenis";

// ✅ Evenly Distributed Photos Based on Provided Categories
const photos = [
  { src: "/korn24/korn_2024-3.jpg", type: "portrait" }, // JD
  { src: "/korn24/korn_2024-2.jpg", type: "portrait" }, // Head
  { src: "/korn24/korn_2024-4.jpg", type: "portrait" }, // Munky
  { src: "/korn24/korn_2024-34.jpg", type: "portrait" }, // Ra
  { src: "/korn24/korn_2024-57.jpg", type: "landscape" }, // Ray
  { src: "/korn24/korn_2024-52.jpg", type: "landscape" }, // Band
  { src: "/korn24/korn_2024-20.jpg", type: "portrait" }, // Head
  { src: "/korn24/korn_2024-5.jpg", type: "portrait" }, // Munky
  { src: "/korn24/korn_2024-51.jpg", type: "landscape" }, // Band
  { src: "/korn24/korn_2024-23.jpg", type: "portrait" }, // Head
  { src: "/korn24/korn_2024-10.jpg", type: "portrait" }, // Munky
  { src: "/korn24/korn_2024-41.jpg", type: "portrait" }, // Ra
  { src: "/korn24/korn_2024-45.jpg", type: "portrait" }, // Head
  { src: "/korn24/korn_2024-59.jpg", type: "landscape" }, // Ray

  { src: "/korn24/korn_2024-8.jpg", type: "portrait" }, // JD
  { src: "/korn24/korn_2024-25.jpg", type: "portrait" }, // Head


  { src: "/korn24/korn_2024-56.jpg", type: "landscape" }, // Ray

  { src: "/korn24/korn_2024-9.jpg", type: "portrait" }, // JD
  { src: "/korn24/korn_2024-49.jpg", type: "portrait" }, // Head
  { src: "/korn24/korn_2024-15.jpg", type: "portrait" }, // Munky
  { src: "/korn24/korn_2024-46.jpg", type: "portrait" }, // Munky
  { src: "/korn24/korn_2024-60.jpg", type: "landscape" }, // Ray

  { src: "/korn24/korn_2024-11.jpg", type: "portrait" }, // JD
  { src: "/korn24/korn_2024-48.jpg", type: "portrait" }, // Band
  { src: "/korn24/korn_2024-16.jpg", type: "portrait" }, // Munky
  { src: "/korn24/korn_2024-47.jpg", type: "portrait" }, // JD
  { src: "/korn24/korn_2024-61.jpg", type: "landscape" }, // Ray

  { src: "/korn24/korn_2024-12.jpg", type: "portrait" }, // JD
  { src: "/korn24/korn_2024-53.jpg", type: "portrait" }, // Head
  { src: "/korn24/korn_2024-18.jpg", type: "portrait" }, // Munky
  { src: "/korn24/korn_2024-22.jpg", type: "portrait" }, // Munky
  { src: "/korn24/korn_2024-62.jpg", type: "landscape" }, // Ray
  { src: "/korn24/korn_2024-13.jpg", type: "portrait" }, // JD
  { src: "/korn24/korn_2024-26.jpg", type: "portrait" }, // Munky
  { src: "/korn24/korn_2024-24.jpg", type: "portrait" }, // JD
  { src: "/korn24/korn_2024-29.jpg", type: "portrait" }, // Munky
  { src: "/korn24/korn_2024-63.jpg", type: "landscape" }, // Ray
  { src: "/korn24/korn_2024-14.jpg", type: "portrait" }, // Munky
  { src: "/korn24/korn_2024-7.jpg", type: "portrait" }, // JD
  { src: "/korn24/korn_2024-6.jpg", type: "portrait" }, // JD
];

const Korn24 = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && router.isReady) {
      // ✅ Ensures it updates only if the hash is missing
      if (!window.location.hash) {
        router.replace("/music/korn24#korn-photos", undefined, { shallow: true });
      }

      // ✅ Ensures smooth scrolling to the #korn-photos section
      setTimeout(() => {
        const section = document.getElementById("korn-photos");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);

      // ✅ Smooth scrolling setup
      const lenis = new Lenis();
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      return () => lenis.destroy();
    }
  }, [router.isReady]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Hero heading="Korn Photography" message="Explore the best live shots of Korn." />
      <Portfolio photos={photos} sectionId="korn-photos" />
    </motion.div>
  );
};

export default Korn24;
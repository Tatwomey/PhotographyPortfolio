import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Lenis from "@studio-freight/lenis";

// All Korn 2024 photos, fully randomized
const photos = [
  { src: "/korn24/korn_2024-7.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-3.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-12.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-8.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-5.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-14.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-9.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-6.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-36.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-22.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-15.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-27.jpg", type: "portrait" },
  { src: "/korn24/korn_2024.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-35.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-30.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-10.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-24.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-38.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-2.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-4.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-13.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-41.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-11.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-29.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-16.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-40.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-26.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-39.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-21.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-37.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-18.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-25.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-24.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-19.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-20.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-23.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-17.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-28.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-31.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-32.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-33.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-34.jpg", type: "portrait" },
];

const Korn24 = () => {
  const router = useRouter();

  // Auto-scroll to #korn-photos if no hash is present
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!window.location.hash) {
        setTimeout(() => {
          router.replace("/music/korn24#korn-photos", undefined, { shallow: true });
        }, 300);
      }

      // Smooth scrolling with Lenis.js
      const lenis = new Lenis();
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Hero heading="Korn 2024 Photography" message="Explore the captivating visuals of Korn in concert." />
      <Portfolio photos={photos} sectionId="korn-photos" />
    </motion.div>
  );
};

export default Korn24;

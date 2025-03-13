import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Lenis from "@studio-freight/lenis";


// All Thievery Corporation photos, fully randomized
const photos = [
  { src: "/Thievery25/thievery_corporation_terminal5-49.jpg", "type": "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-48.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-41.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-14.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-47.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-42.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-25.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-36.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-18.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-53.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-50.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-8.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-39.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-12.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-2.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-28.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-44.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-9.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-31.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-45.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-4.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-54.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-51.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-35.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-56.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-58.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-20.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-30.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-55.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-11.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-19.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-34.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-38.jpg", type: "portrait" },
  { src: "/Thievery25/thievery_corporation_terminal5-57.jpg", type: "portrait" },

];

const Thievery25 = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady && typeof window !== "undefined") {
      if (!window.location.hash) {
        setTimeout(() => {
          router.replace("/music/thievery25#thievery-photos", undefined, { shallow: true });
        }, 300);
      }

      // Initialize smooth scrolling
      const lenis = new Lenis();
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }, [router.isReady]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Hero heading="Thievery Corporation Photography" message="Explore the captivating visuals of Thievery Corporation in concert." />
      <Portfolio photos={photos} sectionId="thievery-photos" />
    </motion.div>
  );
};

export default Thievery25;
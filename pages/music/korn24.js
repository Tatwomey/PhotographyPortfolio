import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Lenis from "@studio-freight/lenis";


const photos = [
  { src: "/korn24/korn_2024-2.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-57.jpg", type: "landscape" },
  { src: "/korn24/korn_2024-4.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-3.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-20.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-5.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-55.jpg", type: "landscape" },
  { src: "/korn24/korn_2024-6.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-23.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-10.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-7.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-54.jpg", type: "landscape" },
  { src: "/korn24/korn_2024-25.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-14.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-8.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-53.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-56.jpg", type: "landscape" },
  { src: "/korn24/korn_2024-15.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-49.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-9.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-16.jpg", type: "portrait" },
 { src: "/korn24/korn_2024-58.jpg", type: "landscape" },
 { src: "/korn24/korn_2024-11.jpg", type: "portrait" },
 { src: "/korn24/korn_2024-45.jpg", type: "portrait" },
 { src: "/korn24/korn_2024-17.jpg", type: "portrait" },
 { src: "/korn24/korn_2024-12.jpg", type: "portrait" },
 { src: "/korn24/korn_2024-48.jpg", type: "portrait" },  // ✅ Ray’s portrait
 { src: "/korn24/korn_2024-59.jpg", type: "landscape" },
 { src: "/korn24/korn_2024-42.jpg", type: "portrait" },
 { src: "/korn24/korn_2024-18.jpg", type: "portrait" },
 { src: "/korn24/korn_2024-13.jpg", type: "portrait" },
 { src: "/korn24/korn_2024-22.jpg", type: "portrait" },
 { src: "/korn24/korn_2024-60.jpg", type: "landscape" },
 { src: "/korn24/korn_2024-19.jpg", type: "portrait" },
 { src: "/korn24/korn_2024-26.jpg", type: "portrait" },
 { src: "/korn24/korn_2024-24.jpg", type: "portrait" },
 { src: "/korn24/korn_2024-29.jpg", type: "portrait" },
 { src: "/korn24/korn_2024-61.jpg", type: "landscape" },
 { src: "/korn24/korn_2024-27.jpg", type: "portrait" },
 { src: "/korn24/korn_2024-30.jpg", type: "portrait" },
 { src: "/korn24/korn_2024-28.jpg", type: "portrait" },
 { src: "/korn24/korn_2024-32.jpg", type: "portrait" }

];

const Korn24 = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady && typeof window !== "undefined") {
      // ✅ Prevents infinite loop in router.replace()
      if (!window.location.hash) {
        setTimeout(() => {
          if (router.pathname === "/music/korn24") {
            router.replace("/music/korn24#korn-photos", undefined, { shallow: true });
          }
        }, 300);
      }

      // ✅ Smooth scrolling with proper cleanup
      const lenis = new Lenis();
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      return () => {
        lenis.destroy(); // ✅ Ensures cleanup when unmounting
      };
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

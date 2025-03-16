import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Lenis from "@studio-freight/lenis";

// ✅ Evenly Distributed Photos Based on Provided Categories
const photos = [
  { src: "/korn24/korn_2024_trevortwomey-2.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-5.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-55.jpg", type: "landscape" },
  { src: "/korn24/korn_2024-6.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-23.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-10.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-7.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-21.jpg", type: "landscape" },
  { src: "/korn24/korn_2024-54.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-15.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-25.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-14.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-8.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-15.jpg", type: "portrait"},
  { src: "/korn24/korn_2024-53.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-3.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-8.jpg", type: "landscape"},
  { src: "/korn24/korn_2024-9.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-49.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-16.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-9.jpg", type: "portrait"},
  { src: "/korn24/korn_2024-58.jpg", type: "landscape" },
  { src: "/korn24/korn_2024_trevortwomey-7.jpg", type: "landscape"},
  { src: "/korn24/korn_2024_trevortwomey-20.jpg", type: "landscape"},
  { src: "/korn24/korn_2024-11.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-45.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-17.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-12.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-48.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-59.jpg", type: "landscape" },
  { src: "/korn24/korn_2024_trevortwomey-14.jpg", type: "landscape"},
  { src: "/korn24/korn_2024-42.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-18.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-13.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-10.jpg", type: "portrait"},
  { src: "/korn24/korn_2024_trevortwomey-22.jpg", type: "portrait"},
  { src: "/korn24/korn_2024-22.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-19.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-26.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-24.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-29.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-61.jpg", type: "landscape" },
  { src: "/korn24/korn_2024-27.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-30.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-28.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-32.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-62.jpg", type: "landscape" },
  { src: "/korn24/korn_2024-31.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-46.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-11.jpg", type: "portrait"},
  { src: "/korn24/korn_2024_trevortwomey-19.jpg", type: "portrait"},
  { src: "/korn24/korn_2024-35.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-36.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-47.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-43.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-2.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-4.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-34.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-13.jpg", type: "landscape"},
  { src: "/korn24/korn_2024-57.jpg", type: "landscape" },
  { src: "/korn24/korn_2024-52.jpg", type: "landscape" },
  { src: "/korn24/korn_2024-20.jpg", type: "portrait" },
  { src: "/korn24/korn_2024-51.jpg", type: "landscape" },
  { src: "/korn24/korn_2024-41.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-18.jpg", type: "portrait"},
  { src: "/korn24/korn_2024-63.jpg", type: "landscape" }
];


  


const Korn24 = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && router.isReady) {
      // ✅ Fix unnecessary hash updates
      if (!window.location.hash && !router.asPath.includes("#korn-photos")) {
        router.replace("#korn-photos", undefined, { shallow: true });
      }

      // ✅ Fix: Remove manual scrollIntoView() call
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
    <div>
      <Hero heading="Korn Photography" message="Explore the best live shots of Korn." />
      <Portfolio photos={photos} sectionId="korn-photos" />
    </div>
  );
};

export default Korn24;
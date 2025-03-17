import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Lenis from "@studio-freight/lenis";

// ✅ Evenly Distributed Photos Based on Provided Categories

  const photos = [
    { src: "/korn24/korn_2024_trevortwomey_01.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_02.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_03.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_04.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_05.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_06.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_07.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_08.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_09.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_10.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_11.jpg", type: "landscape" },
    { src: "/korn24/korn_2024_trevortwomey_12.jpg", type: "landscape" },
    { src: "/korn24/korn_2024_trevortwomey_13.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_14.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_15.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_16.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_17.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_18.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_19.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_20.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_21.jpg", type: "landscape" },
    { src: "/korn24/korn_2024_trevortwomey_22.jpg", type: "landscape" },
    { src: "/korn24/korn_2024_trevortwomey_23.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_24.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_25.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_26.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_27.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_28.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_29.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_30.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_31.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_32.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_33.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_34.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_35.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_36.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_37.jpg", type: "landscape" },
    { src: "/korn24/korn_2024_trevortwomey_38.jpg", type: "landscape" },
    { src: "/korn24/korn_2024_trevortwomey_39.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_40.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_41.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_42.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_43.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_44.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_45.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_46.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_47.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_48.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_49.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_50.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_51.jpg", type: "landscape" },
    { src: "/korn24/korn_2024_trevortwomey_52.jpg", type: "landscape" },
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
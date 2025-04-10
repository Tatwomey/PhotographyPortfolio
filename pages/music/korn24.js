import React, { useEffect } from "react";
import withAuth from "@/utils/withAuth";
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
  { src: "/korn24/korn_2024_trevortwomey-21.jpg", type: "portait" },
  { src: "/korn24/korn_2024_trevortwomey-22.jpg", type: "landscape" },
  { src: "/korn24/korn_2024_trevortwomey-23.jpg", type: "landscape" },
  { src: "/korn24/korn_2024_trevortwomey-24.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-25.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-26.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-27.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-28.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-29.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-30.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-31.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-32.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-33.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-34.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-35.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-36.jpg", type: "landscape" },
  { src: "/korn24/korn_2024_trevortwomey-37.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-38.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-39.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-40.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-41.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-42.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-43.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-44.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-45.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-46.jpg", type: "portrait" },
  { src: "/korn24/korn_2024_trevortwomey-47.jpg", type: "landscape" },
  { src: "/korn24/korn_2024_trevortwomey-48.jpg", type: "landscape" },
  { src: "/korn24/korn_2024_trevortwomey-49.jpg", type: "landscape" },
 
];
  
  const Korn24 = () => {
    useEffect(() => {
      if (typeof window !== "undefined") {
        // ✅ Scroll into view when page loads
        setTimeout(() => {
          const section = document.getElementById("korn-photos");
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          }
        }, 250);
  
        // ✅ Lenis Smooth Scroll Init
        const lenis = new Lenis();
        const raf = (time) => {
          lenis.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
  
        return () => lenis.destroy();
      }
    }, []);
  
    return (
      <div>
        <Hero
          // You can use a conditional or pass different props depending on use case
          heading=""
          message=""
        />
        <Portfolio photos={photos} sectionId="korn-photos" />
      </div>
    );
  };
  
  export default withAuth(Korn24, ["/music/korn24"]);
import React, { useEffect } from "react";
import withAuth from "@/utils/withAuth";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Lenis from "@studio-freight/lenis";

 
  
  const photos = [
    { src: "/korn24/korn_2024_trevortwomey_01.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_02.jpg", type: "portrait" },
   
    { src: "/korn24/korn_2024_trevortwomey_04.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_05.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_50.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_-9.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_06.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_07.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_08.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_09.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_10.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_-2.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_11.jpg", type: "landscape" },
    { src: "/korn24/korn_2024_trevortwomey.jpg", type: "portrait" },
    
    { src: "/korn24/korn_2024_trevortwomey_13.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_14.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_15.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_16.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_17.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_18.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_19.jpg", type: "portrait" },
  
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


    { src: "/korn24/korn_2024_trevortwomey_34.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_35.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_36.jpg", type: "portrait" },

    { src: "/korn24/korn_2024_trevortwomey_38.jpg", type: "landscape" },
    { src: "/korn24/korn_2024_trevortwomey_39.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_41.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_42.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_43.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_44.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_45.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_46.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_47.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_48.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_49.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_51.jpg", type: "landscape" },
    { src: "/korn24/korn_2024_trevortwomey_52.jpg", type: "landscape" },
    { src: "/korn24/korn_2024_trevortwomey_37.jpg", type: "portrait" },
    { src: "/korn24/korn_2024_trevortwomey_55.jpg", type: "portrait" },
   
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
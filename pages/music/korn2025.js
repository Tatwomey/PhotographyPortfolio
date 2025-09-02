// pages/music/korn2025.js
import React, { useEffect } from "react";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Lenis from "@studio-freight/lenis";

// Korn 2025 MetLife photo set (randomized order, omitting --25.jpg)
const photos = [
  { src: "/korn2025/korn_2025_metlife_trevortwomey--14.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--8.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--2.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--17.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--9.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--27.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--11.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--21.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--7.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--19.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--24.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--13.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--6.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--16.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--3.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--22.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--4.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--18.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--20.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--23.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--5.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--15.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--10.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--12.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--26.jpg", type: "portrait" },
  { src: "/korn2025/korn_2025_metlife_trevortwomey--28.jpg", type: "landscape" },
];

export default function Korn2025() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Fire a custom GA event for Korn 2025 page
    if (window.gtag) {
      window.gtag("event", "visit_korn2025", {
        page_path: "/music/korn2025",
      });
    }

    // Smooth scrolling with Lenis
    const lenis = new Lenis();
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Auto-scroll to gallery after hero settles
    const timeout = setTimeout(() => {
      const section = document.getElementById("korn-photos-2025");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }, 500);

    return () => {
      clearTimeout(timeout);
      lenis.destroy();
    };
  }, []);

  return (
    <div>
      <Hero />
      <Portfolio photos={photos} sectionId="korn-photos-2025" />
    </div>
  );
}

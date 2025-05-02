// pages/music/korn25.jsx
import React from "react";
import Hero from "@/components/Hero"; // Optional – remove if you want no top banner
import LookbookViewer from "@/components/LookbookViewer";


const photos = [
  
  { src: "/korn25/korn_bny_2024_trevortwomey-1.jpg" },
  { src: "/korn25/korn_bny_2024_trevortwomey-2.jpg" },
  { src: "/korn25/korn_bny_2024_trevortwomey-3.jpg" },
  { src: "/korn25/korn_bny_2024_trevortwomey-4.jpg" },
  { src: "/korn25/korn_bny_2024_trevortwomey-5.jpg" },
  { src: "/korn25/korn_bny_2024_trevortwomey-6.jpg" },
  { src: "/korn25/korn_bny_2024_trevortwomey-7.jpg" },
  { src: "/korn25/korn_bny_2024_trevortwomey-8.jpg" },
  { src: "/korn25/korn_bny_2024_trevortwomey-9.jpg" },
  { src: "/korn25/korn_bny_2024_trevortwomey-10.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-11.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-12.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-13.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-14.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-15.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-16.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-17.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-18.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-19.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-20.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-21.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-22.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-23.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-24.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-25.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-26.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-27.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-28.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-29.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-30.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-31.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-32.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-33.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-34.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-35.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-36.jpg" },
    { src: "/korn25/korn_bny_2024_trevortwomey-37.jpg" },
];
const Korn25 = () => {
  return (
    <div className="lookbook-mode">
      <Hero />
      <LookbookViewer photos={photos} />
    </div>
  );
};

export default Korn25;

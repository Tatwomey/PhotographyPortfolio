import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";

const photos = [
    { "src": "/Elias_nonpoint_nyc_trevortwomey.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-2.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-38.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-29.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-3.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-4.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-34.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-35.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-6.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-7.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-30.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-8.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-9.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-10.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-31.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-36.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-41.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-33.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-13.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-14.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-15.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-16.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-17.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-18.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-19.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-39.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-20.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-21.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-40.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-24.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-25.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-26.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-37.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-27.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-28-1.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-43.jpg", "type": "portrait" },
];

const Elias = () => {
  
    const router = useRouter();
  
    useEffect(() => {
      if (typeof window !== "undefined" && !window.location.hash) {
        setTimeout(() => {
          window.location.replace("#elias-photos");
        }, 0);
      }
    }, []);
  
    return (
      <>
        <Hero heading="Nonpoint Photography" message="Explore the captivating visuals of Nonpoint in concert." />
        <Portfolio photos={photos} sectionId="elias-photos" />
      </>
    );
  };
  
  export default Elias;
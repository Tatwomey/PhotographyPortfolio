import React from "react";
import Meta from "@/components/Meta";
import Hero from "@/components/Hero";
import Portfolio from "./Portfolio";

function Music() {
  return (
    <div>
      <Meta
        title="Music Photography - Trevor Twomey"
        description="Explore the dynamic portfolio of music and concert photography by Trevor Twomey."
        keywords="music photography, concert photography, band photos, live music performances"
      />
      <Hero />
      <Portfolio />
    </div>
  );
}

export default Music;

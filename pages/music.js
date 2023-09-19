import React from "react";
import Hero from "./components/Hero";
import Portfolio from "./components/Portfolio";

function music() {
  return (
    <div>
      <Hero
        heading="Music Photos"
        message="This is some of my concert photos"
      />{" "}
      <Portfolio />
    </div>
  );
}

export default music;

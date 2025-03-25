import React from "react";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="hero-wrapper">
      {/* Desktop */}
      <div className="hero-img-desktop">
        <Image
          src="/head-korn-ftl20-San-Francisco-2018-trevor-twomey-1-3.jpg"
          alt="Hero Desktop"
          fill
          priority
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Mobile */}
      <div className="hero-img-mobile">
        <Image
          src="/head-korn-ftl20-San-Francisco-2018-trevor-twomey-1-ios.jpg"
          alt="Hero Mobile"
          fill
          priority
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

export default Hero;

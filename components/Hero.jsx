import React from "react";
import Image from "next/image";

const Hero = ({ heading, message }) => {
  return (
    <div className="hero-section">
      {/* ✅ Background Image Fix for Next.js 13 */}
      <div className="hero-overlay">
        <Image
          src="/head-korn-ftl20-San-Francisco-2018-trevor-twomey-1 ios.jpg"
          alt="Hero"
          layout="fill"
          objectFit="cover"
          priority // ✅ Ensures faster loading
          className="hero-background"
        />
      </div>

      {/* ✅ Hero Content */}
      <div className="hero-content">
        <h1 className="hero-title">{heading}</h1>
        <p className="hero-message">{message}</p>
      </div>
    </div>
  );
};

export default Hero;

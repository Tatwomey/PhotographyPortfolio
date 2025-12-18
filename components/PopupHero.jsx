import React from "react";
import Image from "next/image";

const PopUpHero = () => {
  return (
    <div className="hero-wrapper relative min-h-screen flex items-center justify-center">
      {/* Desktop Image */}
      <div className="hero-img-desktop">
        <Image
          src="/final hero.png"
          alt="Popup Hero Desktop"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Mobile Image */}
      <div className="hero-img-mobile">
        <Image
          src="/final hero.png"
          alt="Popup Hero Mobile"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/60 z-[1]" />

      {/* Headline Text */}
      <div className="absolute z-[2] text-white text-center px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Limited prints available now.
        </h2>
      </div>
    </div>
  );
};

export default PopUpHero;

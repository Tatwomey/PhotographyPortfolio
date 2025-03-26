import React from "react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="hero-wrapper relative">
      {/* ✅ Desktop Hero Image */}
      <div className="hero-img-desktop">
        <Image
          src="/head-korn-ftl20-San-Francisco-2018-trevor-twomey-1-3.jpg"
          alt="Hero Desktop"
          fill
          priority
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* ✅ Mobile Hero Image */}
      <div className="hero-img-mobile">
        <Image
          src="/head-korn-ftl20-San-Francisco-2018-trevor-twomey-1-ios.jpg"
          alt="Hero Mobile"
          fill
          priority
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* ✅ Overlay + CTA */}
      <div className="absolute inset-0 bg-black/60 z-[1]" />
      <div className="absolute z-[2] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Book a Session</h2>
        <p className="text-lg md:text-xl mb-6">Let’s capture something iconic together.</p>
        <Link href="/contact">
          <button className="px-8 py-3 border border-white hover:bg-white hover:text-black transition">
            Book Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;

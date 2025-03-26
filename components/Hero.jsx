import React from "react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="hero-wrapper relative min-h-screen flex items-center justify-center">
      {/* Desktop Image */}
      <div className="hero-img-desktop">
        <Image
          src="/head-korn-ftl20-San-Francisco-2018-trevor-twomey-1-3.jpg"
          alt="Hero Desktop"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Mobile Image */}
      <div className="hero-img-mobile">
        <Image
          src="/head-korn-ftl20-San-Francisco-2018-trevor-twomey-1-ios.jpg"
          alt="Hero Mobile"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-[1]" />

      {/* Text + CTA */}
      <div className="absolute z-[2] text-white text-center px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Book a Session</h2>
        <p className="text-lg md:text-xl mb-6">Let’s capture something iconic together.</p>
        <Link href="/contact#work-with-me" scroll={false}>
          <button className="px-8 py-3 border border-white hover:bg-white hover:text-black transition">
            Book Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;

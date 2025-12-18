// components/PopupHero.jsx
import React from "react";
import Image from "next/image";

export default function PopUpHero() {
  return (
    <section
      className="
        relative w-full overflow-hidden
        flex items-center justify-center
        bg-black
      "
      // ✅ Hero height tuned so it doesn’t feel “massive” on desktop,
      // while still feeling immersive on mobile.
      style={{
        height: "clamp(520px, 72vh, 820px)",
      }}>
      {/* ✅ Desktop image */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src="/hero_desktop.png"
          alt="Popup Hero Desktop"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* ✅ Mobile image */}
      <div className="absolute inset-0 block md:hidden">
        <Image
          src="/mobile_hero.png"
          alt="Popup Hero Mobile"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* ✅ Overlay */}
      <div className="absolute inset-0 bg-black/55 z-[1]" />

      {/* ✅ Content */}
      <div className="relative z-[2] text-white text-center px-6 max-w-[980px]">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Limited prints available now.
        </h2>
      </div>
    </section>
  );
}

import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="flex items-center justify-center h-screen mb-12 bg-fixed bg-center bg-cover custom-img">
      {/* Overlay */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/70 z-10" />
      <div className="p-5 text-white z-20 mt-[-10rem]">
        <Link href="/contact#work-with-me">
          <button className="px-8 py-2 border">Book</button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;

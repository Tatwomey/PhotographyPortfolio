import React from "react";

const Hero = ({ heading, message }) => {
  return (
    <div className="flex items-center justify-center h-screen mb-12 bg-fixed bg-center bg-cover custom-img">
      {/* Overlay */}
      <div className="absolute top-0 left-0 right-0 button-0 bg-black/70 z-[2]" />
      <div className="p-5 text-white z-[2] mt-[-10rem] sm:mt-0"> {/* Adjusted margin-top for mobile */}
        <h2 className="text-3xl sm:text-5xl font-bold">{heading}</h2> {/* Adjusted font size for mobile */}
        <p className="py-5 text-lg sm:text-xl">{message}</p> {/* Adjusted font size for mobile */}
        <button className="px-6 py-2 border text-lg sm:text-xl">Book</button> {/* Adjusted font size for mobile */}
      </div>
    </div>
  );
};

export default Hero;


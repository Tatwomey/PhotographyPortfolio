import React from "react";

const Hero = ({ heading, message }) => {
  return (
    <div className="text-center py-10">
      <h1 className="text-3xl font-bold">{heading}</h1>
      <p className="text-lg mt-2">{message}</p>
    </div>
  );
};

export default Hero;

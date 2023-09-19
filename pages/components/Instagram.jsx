import React from "react";
import igimg1 from "public/igimg1.jpeg";
import igimg2 from "public/igimg2.jpeg";
import igimg3 from "public/igimg3.jpeg";
import igimg4 from "public/igimg4.jpeg";
import igimg5 from "public/igimg5.jpeg";
import igimg6 from "public/igimg6.jpeg";
import Image from "next/image";
import InstagramImg from "./InstagramImg";
const Instagram = () => {
  return (
    <div>
      <p>Follow me on Instagram</p>
      <p>@trevortwomey</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 p-4">
        <InstagramImg socialImg={igimg1} />
        <InstagramImg socialImg={igimg2} />
        <InstagramImg socialImg={igimg3} />
        <InstagramImg socialImg={igimg4} />
        <InstagramImg socialImg={igimg5} />
        <InstagramImg socialImg={igimg6} />
      </div>
    </div>
  );
};

export default Instagram;

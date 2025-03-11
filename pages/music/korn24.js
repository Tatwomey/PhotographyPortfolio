import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";

// All Thievery Corporation photos, fully randomized
const photos = [
  { "src": "/Thievery25/thievery_corporation_terminal5-41.jpg", "type": "portrait" },
  { "src": "/Thievery25/thievery_corporation_terminal5-49.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-14.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-3.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-42.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-25.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-36.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-18.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-8.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-39.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-2.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-12.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-28.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-9.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-31.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-15.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-4.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-24.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-22.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-35.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-23.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-17.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-40.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-20.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-30.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-11.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-19.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-34.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-38.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-27.jpg", "type": "portrait" },
];

const Korn24 = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.hash) {
      setTimeout(() => {
        window.location.replace("#korn-photos");
      }, 0);
    }
  }, []);

  return (
    <>
      <Hero heading="Korn Photography" message="Explore the captivating visuals of Thievery Corporation in concert." />
      <Portfolio photos={photos} sectionId="korn-photos" />
    </>
  );
};

export default Korn24;
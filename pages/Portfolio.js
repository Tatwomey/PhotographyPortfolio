import React, { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";

const photos = [
  // { src: "/aaron-lewis-staind-camden-NJ-2021-trevor-twomey.jpg", type: "portrait" }, // Red tag
  // { src: "/afi-davey-havok-bodies-tour-2022-nyc-trevor-twomey-1.jpg", type: "portrait" }, // Red tag
  { src: "/amy-lee-evanescence-jones-beach-2022-trevor-twomey.jpg", type: "portrait" },
  { src: "/clint-lowery-sevendust-nyc-2022-trevor-twomey.jpg", type: "portrait" },
  { src: "/craig-bonich-brooklyn-ny-2023-trevor-twomey.JPG", type: "portrait" },
  { src: "/drab-majesty-bodies-tour-2022-nyc-trevor-twomey.jpg", type: "portrait" },
  { src: "/fieldy-head-korn-buckhead-trevor-twomey.jpg", type: "portrait" },
  // { src: "/fieldy-korn-allentown-pa-2020-trevor-twomey.jpg", type: "portrait" }, // Red tag
  { src: "/head-hair-korn-camden-nj-2021-trevor-twomey.jpg", type: "portrait" },
  { src: "/head-korn-2015-la-forum-trevor-twomey-1.jpg", type: "landscape" },
  { src: "/head-korn-autograph-camden-nj-2022-trevor-twomey.jpg", type: "portrait" },
  { src: "/head-korn-camden-nj-2022-trevor-twomey.jpg", type: "portrait" },
  { src: "/head-korn-ftl20-san-francisco-trevor-twomey-1.jpg", type: "portrait" },
  { src: "/head-korn-homdel-nj-2021-trevor-twomey.jpg", type: "portrait" },
  // { src: "/head-korn-jones-beach-2022-trevor-twomey.jpg", type: "portrait" }, // Red tag
  { src: "/head-korn-jones-beach-2022-trevor-twomey-2.jpg", type: "portrait" },
  { src: "/head-korn-jones-beach-2022-trevor-twomey-4.jpg", type: "portrait" },
  { src: "/head-korn-los-angeles-2023-trevor-twomey.JPG", type: "portrait" },
  { src: "/head-q-pod-sonny-trevor-twomey.jpg", type: "portrait" },
  { src: "/JD-korn-jones-beach-2022-trevor-twomey-3.jpg", type: "portrait" },
  // { src: "/jd-korn-allentown-pa-2020-trevor-twomey.jpg", type: "portrait" }, // Red tag
  { src: "/JD-korn-camden-nj-2022-trevor-twomey.jpg", type: "portrait" },
  { src: "/JD-korn-crowd-trevor-twomey.jpg", type: "portrait" },
  { src: "/korn-eagles-ballroom-2017-trevor-twomey-1.jpg", type: "landscape" },
  { src: "/korn-fieldy-allentown-pa-2020-trevor-twomey-1.jpg", type: "landscape" },
  { src: "/Korn-JD-Jones-Beach-2022-trevor-twomey.jpg", type: "portrait" },
];

const Portfolio = () => {
  const touchTimer = useRef(null);

  const breakpointCols = {
    default: 4,
    1100: 3,
    700: 2,
    500: 2,
  };

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    alert("© Trevor Twomey Photography 2023. All Rights Reserved.");
  }, []);

  const handleTouchStart = useCallback((e) => {
    touchTimer.current = setTimeout(() => {
      alert("© Trevor Twomey Photography 2023. All Rights Reserved.");
    }, 500);
  }, []);

  const handleTouchEnd = useCallback(() => {
    clearTimeout(touchTimer.current);
  }, []);

  const handleDragStart = useCallback((e) => {
    e.preventDefault();
  }, []);

  const attachEventListeners = useCallback(
    (elements) => {
      elements.forEach((el) => {
        el.removeEventListener("contextmenu", handleContextMenu);
        el.removeEventListener("touchstart", handleTouchStart);
        el.removeEventListener("touchend", handleTouchEnd);
        el.removeEventListener("touchmove", handleTouchEnd);
        el.removeEventListener("dragstart", handleDragStart);

        el.addEventListener("contextmenu", handleContextMenu);
        el.addEventListener("touchstart", handleTouchStart);
        el.addEventListener("touchend", handleTouchEnd);
        el.addEventListener("touchmove", handleTouchEnd);
        el.addEventListener("dragstart", handleDragStart);
      });
    },
    [handleContextMenu, handleTouchStart, handleTouchEnd, handleDragStart]
  );

  useEffect(() => {
    const initialImages = document.querySelectorAll(".my-masonry-grid img");
    attachEventListeners(initialImages);

    // Repeatedly attach event listeners to ensure they remain active
    const intervalId = setInterval(() => {
      attachEventListeners(initialImages);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [attachEventListeners]);

  return (
    <div
      className="max-w-[1240px] mx-auto py-4 sm:py-16 text-center"
      id="music-photography"
    >
      <Masonry
        breakpointCols={breakpointCols}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {photos.map((photo, index) => (
          <div
            className={`relative mb-4 ${
              photo.type === "landscape" ? "my-masonry-grid_column-span-2" : ""
            }`}
            key={photo.src}
          >
            <Image
              src={photo.src}
              alt="Photo"
              width={photo.type === "portrait" ? 500 : 1000}
              height={photo.type === "landscape" ? 750 : 500}
              className="relative cursor-default"
              draggable="false" // Prevent dragging images
            />
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default Portfolio;

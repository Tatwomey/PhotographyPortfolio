import React, { useEffect, useRef, useCallback } from "react";
import Masonry from "react-masonry-css";

const photos = [
    { src: "/JD-korn-jones-beach-2022-trevor-twomey-5-2.jpg", type: "portrait", alt: "Jonathan Davis performing live with Korn at Jones Beach 2022", title: "Jonathan Davis - Korn Live at Jones Beach 2022" },
    { src: "/q-unique-kings-bounty-denial-video-trevor-twomey-1.jpg", type: "portrait", alt: "Q-Unique performing with Kings Bounty during Denial video shoot", title: "Q-Unique - Kings Bounty Denial Video Shoot" },
    { src: "/†††(Crosses)_chino_022024_nyc_trevor_twomey-3.jpg", type: "portrait", alt: "Chino Moreno of ††† (Crosses) performing live in NYC 2024", title: "Chino Moreno - ††† (Crosses) NYC 2024" },
    { src: "/thievery-corporation-capitol-theatre-trevor-twomey.jpg", type: "landscape", alt: "Thievery Corporation live at the Capitol Theatre", title: "Thievery Corporation - Capitol Theatre" },
    { src: "/korn-eagles-ballroom-2017-trevor-twomey-1jpg.jpg", type: "landscape", alt: "Korn live performance at Eagles Ballroom 2017", title: "Korn - Eagles Ballroom 2017" },
    { src: "/ray-luzier-korn-2020-trevor-twomey.jpg", type: "landscape", alt: "Ray Luzier of Korn performing live in 2020", title: "Ray Luzier - Korn Live 2020" },
    { src: "/Natalia-clavier-nublu-trevor-twomey.jpg", type: "landscape", alt: "Natalia Clavier performing live at Nublu", title: "Natalia Clavier - Live at Nublu" },
    { src: "/head-korn-2015-la-forum-trevor-twomey-1.jpg", type: "landscape", alt: "Brian 'Head' Welch of Korn performing at LA Forum 2015", title: "Brian 'Head' Welch - Korn LA Forum 2015" },
    { src: "/raquel-jones-thievery-corporation-pier-17-trevor-twomey-1.jpg", type: "landscape", alt: "Raquel Jones performing with Thievery Corporation at Pier 17", title: "Raquel Jones - Thievery Corporation Pier 17" },
    { src: "/munky-fieldy-korn-eagles-ballroom-2017-trevor-twomey.jpg", type: "landscape", alt: "James 'Munky' Shaffer and Fieldy of Korn at Eagles Ballroom 2017", title: "Munky and Fieldy - Korn Eagles Ballroom 2017" },
    { src: "/jonathan-davis-solo-tour-2018-trevor-twomey.jpg.jpg", type: "landscape", alt: "Jonathan Davis performing solo tour in 2018", title: "Jonathan Davis - Solo Tour 2018" },
    { src: "/amy-lee-evanescence-jones-beach-2022-trevor-twomey.jpg", type: "portrait", alt: "Amy Lee of Evanescence performing live at Jones Beach 2022", title: "Amy Lee - Evanescence Jones Beach 2022" },
    { src: "/munky-korn-camden-nj-2022-trevor-twomey.jpg", type: "portrait", alt: "James 'Munky' Shaffer of Korn performing live in Camden, NJ 2022", title: "Munky - Korn Live Camden NJ 2022" },
    { src: "/mrs-smith-ibanez-nyc-trevor-twomey-2.jpg", type: "portrait", alt: "Mrs. Smith playing Ibanez guitar live in NYC", title: "Mrs. Smith - Ibanez NYC Performance" },
    { src: "/ellias-nonpoint-nyc-2022-trevor-twomey-1.jpg", type: "portrait", alt: "Elias Soriano of Nonpoint performing live in NYC 2022", title: "Elias Soriano - Nonpoint NYC 2022" },
    { src: "/head-korn-camden-NJ-2021-trevor-twomey.jpg", type: "portrait", alt: "Brian 'Head' Welch of Korn performing in Camden, NJ 2021", title: "Head - Korn Camden NJ 2021" },
    { src: "/drab-majesty-bodies-tour-2022-nyc-trevor-twomey.jpg", type: "portrait", alt: "Drab Majesty performing live on the Bodies Tour NYC 2022", title: "Drab Majesty - Bodies Tour NYC 2022" },
    { src: "/ray-luzier-korn-2021-glitch-trevor-twomey.jpg", type: "portrait", alt: "Ray Luzier of Korn performing live in 2021", title: "Ray Luzier - Korn 2021" },
    { src: "/†††(Crosses)_022024_nyc_trevor_twomey-5.jpg", type: "portrait", alt: "††† (Crosses) live performance in NYC 2024", title: "††† (Crosses) - NYC 2024" },
    { src: "/munky-korn-glitch-ftl20-2018-trevor-twomey.jpg", type: "portrait", alt: "James 'Munky' Shaffer of Korn performing live at FTL20 in 2018", title: "Munky - Korn FTL20 2018" },
    { src: "/q-unique-bowery-ballroom-trevortwomey-1.jpg", type: "portrait", alt: "Q-Unique performing live at Bowery Ballroom", title: "Q-Unique - Bowery Ballroom" },
    { src: "/voxmana-nublu-natalia-clavier-trevor-twomey-1.JPG", type: "portrait", alt: "Voxmana performing live at Nublu with Natalia Clavier", title: "Voxmana - Nublu with Natalia Clavier" },
    { src: "/iamx-chris-corner-lpr-2023-trevor-twomey-3.jpg", type: "portrait", alt: "Chris Corner of IAMX performing live at LPR 2023", title: "IAMX - Chris Corner LPR 2023" },
    { src: "/steve-bowery-kings-bounty-band-trevor-twomey-1.jpg", type: "landscape", alt: "Steve performing live with Kings Bounty at Bowery Ballroom", title: "Steve - Kings Bounty Bowery Ballroom" },
    { src: "/q-unique-mic-kings-bounty-band-trevor-twomey-1.JPG", type: "landscape", alt: "Q-Unique with microphone performing live with Kings Bounty", title: "Q-Unique - Kings Bounty Live" },
    { src: "/brazilian-girls-farfield-ct-trevor-twomey-1.jpg", type: "landscape", alt: "Brazilian Girls performing live in Fairfield, CT", title: "Brazilian Girls - Fairfield CT" },
    { src: "/korn-fieldy-allentown-pa-2020-trevor-twomey-1.jpg", type: "landscape", alt: "Fieldy of Korn performing live in Allentown, PA 2020", title: "Fieldy - Korn Allentown PA 2020" },
    { src: "/raquel-jones-capitol-theatre-2018-trevor-twomey.jpg", type: "portrait", alt: "Raquel Jones performing live at Capitol Theatre 2018", title: "Raquel Jones - Capitol Theatre 2018" },
    { src: "/clint-lowery-sevendust-nyc-2022-trevor-twomey.jpg", type: "portrait", alt: "Clint Lowery of Sevendust performing live in NYC 2022", title: "Clint Lowery - Sevendust NYC 2022" },
    { src: "/hash-thievery-corporation-2013-trevor-twomey-1.jpg", type: "portrait", alt: "Hash performing live with Thievery Corporation in 2013", title: "Hash - Thievery Corporation 2013" },
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
    alert("© Trevor Twomey Photography 2025. All Rights Reserved.");
  }, []);

  const handleTouchStart = useCallback(() => {
    touchTimer.current = setTimeout(() => {
      alert("© Trevor Twomey Photography 2025. All Rights Reserved.");
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

    const intervalId = setInterval(() => {
      attachEventListeners(initialImages);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [attachEventListeners]);

  return (
    <div className="max-w-[1240px] mx-auto py-4 sm:py-16 text-center" id="music-photography">
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
            <img
              src={photo.src}
              alt={photo.alt}
              title={photo.title}
              style={{
                maxWidth: "100%",
                height: "auto",
                cursor: "default",
              }}
              draggable="false"
            />
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default Portfolio;

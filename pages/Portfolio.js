import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

const photos = [
  { src: '/JD-korn-jones-beach-2022-trevor-twomey-5-2.jpg', type: 'portrait' },
  { src: '/q-unique-kings-bounty-denial-video-trevor-twomey-1.jpg', type: 'portrait' },
  { src: '/afi-davey-havok-bodies-tour-2022-nyc-trevor-twomey-1.jpg', type: 'portrait' },
  { src: '/†††(Crosses)_chino_022024_nyc_trevor_twomey-3.jpg', type: 'portrait' },
  { src: '/thievery-corporation-capitol-theatre-trevor-twomey.jpg', type: 'landscape' },
  { src: '/korn-eagles-ballroom-2017-trevor-twomey-1jpg.jpg', type: 'landscape' },
  { src: '/ray-luzier-korn-2020-trevor-twomey.jpg', type: 'landscape' },
  { src: '/Natalia-clavier-nublu-trevor-twomey.jpg', type: 'landscape' },
  { src: '/head-korn-2015-la-forum-trevor-twomey-1.jpg', type: 'landscape' },
  { src: '/raquel-jones-thievery-corporation-pier-17-trevor-twomey-1.jpg', type: 'landscape' },
  { src: '/munky-fieldy-korn-eagles-ballroom-2017-trevor-twomey.jpg', type: 'landscape' },
  { src: '/jonathan-davis-solo-tour-2018-trevor-twomey.jpg.jpg', type: 'landscape' },
  { src: '/amy-lee-evanescence-jones-beach-2022-trevor-twomey.jpg', type: 'portrait' },
  { src: '/munky-korn-camden-nj-2022-trevor-twomey.jpg', type: 'portrait' },
  { src: '/mrs-smith-ibanez-nyc-trevor-twomey-2.jpg', type: 'portrait' },
  { src: '/ellias-nonpoint-nyc-2022-trevor-twomey-1.jpg', type: 'portrait' },
  { src: '/head-korn-camden-NJ-2021-trevor-twomey.jpg', type: 'portrait' },
  { src: '/drab-majesty-bodies-tour-2022-nyc-trevor-twomey.jpg', type: 'portrait' },
  { src: '/ray-luzier-korn-2021-glitch-trevor-twomey.jpg', type: 'portrait' },
  { src: '/†††(Crosses)_022024_nyc_trevor_twomey-5.jpg', type: 'portrait' },
  { src: '/munky-korn-glitch-ftl20-2018-trevor-twomey.jpg', type: 'portrait' },
  { src: '/q-unique-bowery-ballroom-trevortwomey-1.jpg', type: 'portrait' },
  { src: '/aaron-lewis-staind-camden-NJ-2021-trevor-twomeytwomey.jpg', type: 'portrait' },
  { src: '/voxmana-nublu-natalia-clavier-trevor-twomey-1.JPG', type: 'portrait' },
  { src: '/iamx-chris-corner-lpr-2023-trevor-twomey-3.jpg', type: 'portrait' },
  { src: '/JD-korn-jones-beach-2022-trevor-twomey-3.jpg', type: 'portrait' },
  { src: '/steve-bowery-kings-bounty-band-trevor-twomey-1.jpg', type: 'landscape' },
  { src: '/q-unique-mic-kings-bounty-band-trevor-twomey-1.JPG', type: 'landscape' },
  { src: '/brazilian-girls-farfield-ct-trevor-twomey-1.jpg', type: 'landscape' },
  { src: '/korn-fieldy-allentown-pa-2020-trevor-twomey-1.jpg', type: 'landscape' },
  { src: '/raquel-jones-capitol-theatre-2018-trevor-twomey.jpg', type: 'portrait' },
  { src: '/munky-korn-camden-NJ-2021-trevor-twomey.jpg', type: 'portrait' },
  { src: '/q-unique-kings-bounty-denial-video-trevor-twomey.jpg', type: 'portrait' },
  { src: '/head-korn-jones-beach-ny-2022-trevor-twomey-.jpg', type: 'portrait' },
  { src: '/lajon-sevendust-nyc-2022-trevor-twomey.jpg', type: 'portrait' },
  { src: '/munky-korn-camden-nj-2022-trevor-twomey-1.jpg', type: 'portrait' },
  { src: '/†††(Crosses)_022024_nyc_trevor_twomey-2.jpg', type: 'portrait' },
  { src: '/head-korn-autograph-camden-nj-2022-trevor-twomey.jpg', type: 'portrait' },
  { src: '/clint-lowery-sevendust-nyc-2022-trevor-twomey.jpg', type: 'portrait' },
  { src: '/JD-korn-jones-beach-2022-trevor-twomey-jpg.jpg', type: 'portrait' },
  { src: '/q-unique-bowery-ballroom-nyc-trevor-twomey.jpg', type: 'portrait' },
  { src: '/head-korn-homdel-nj-2021-trevor-twomey.jpg', type: 'portrait' },
  { src: '/Hash-thievery-corporation-trevor-twomey.jpg', type: 'portrait' },
  { src: '/Korn-JD-Jones-Beach-2022-trevor-twomey.jpg', type: 'portrait' },
  { src: '/evanescence-troy-mclawhorn--trevor-twomey-2022.jpg', type: 'portrait' },
  { src: '/iamx-chris-corner-LPR-2023-trevortwomey-4.jpg', type: 'portrait' },
  { src: '/mike-dijan-kings-bounty-band-trevor-twomey.JPG', type: 'portrait' },
  { src: '/†††(Crosses)_chino_022024_nyc_trevor_twomey.jpg', type: 'portrait' },
  { src: '/lou-lou-thievery-corporation-capitol-theatre-trevor-twomey-1.jpg', type: 'portrait' },
  { src: '/fieldy-korn-allentown-PA-2020-trevor-twomey.jpg', type: 'portrait' },
  { src: '/q-unique-king-bounty-denial-trevor-twomey.jpg', type: 'portrait' },
  { src: '/head-korn-jones-beach-2022-trevor-twomey.jpg', type: 'portrait' },
  { src: '/amy-lee-evanescence-jones-beach-2022-trevor-twomey-2.jpg', type: 'portrait' },
  { src: '/JD-korn-jones-beach-2022-trevor-twomey.jpg', type: 'portrait' },
  { src: '/mrs-smith-ibanez-nyc-trevor-twomey.jpg', type: 'portrait' },
  { src: '/elias-nonpoint-time-square-2022-trevor-twomey.jpg', type: 'portrait' },
  { src: '/mikey_carvajal_islander_nyc_trevortwomey-4.jpg', type: 'portrait' },
  { src: '/iamx-lpr-2023-trevor-twomey.jpg', type: 'portrait' },
  { src: '/JD-korn-jones-beach-2022-trevor-twomey-2.jpg', type: 'portrait' },
  { src: '/hash-thievery-corporation-2013-trevor-twomey-1.jpg', type: 'portrait' },
  { src: '/IAMX-chris-corner-lpr-2023-trevor-twomey-2.jpg', type: 'portrait' },
  { src: '/†††(Crosses)_022024_nyc_trevor_twomey.jpg', type: 'portrait' },
  { src: '/roots-thievery-corporation-2016-trevor-twomey-1 2.JPG', type: 'portrait' },
  { src: '/munky-korn-camden-nj-2022-trevortwomeytest.jpg', type: 'portrait' },
];

const Portfolio = () => {
  const lightboxRef = useRef(null);

  const breakpointCols = {
    default: 4,
    1100: 3,
    700: 2,
    500: 2,
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    alert('© Trevor Twomey Photography 2023. All Rights Reserved.');
  };

  useEffect(() => {
    const handleContextMenu = (e) => {
      const clickedElement = e.target;
      if (clickedElement.closest(".lg-img-wrap")) {
        e.preventDefault();
        alert("© Trevor Twomey Photography 2023. All Rights Reserved.");
      }
    };

    const handleTouchStart = (e) => {
      const clickedElement = e.target;
      if (clickedElement.closest(".prevent-save")) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e) => {
      const clickedElement = e.target;
      if (clickedElement.closest(".prevent-save")) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <div className="max-w-[1240px] mx-auto py-4 sm:py-16 text-center" id="music-photography">
      <Masonry
        breakpointCols={breakpointCols}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {photos.map((photo, index) => (
          <div
            className={`relative mb-4 ${photo.type === 'landscape' ? 'my-masonry-grid_column-span-2' : ''}`}
            key={photo.src}
            onContextMenu={handleRightClick}
          >
            <div className="prevent-save">
              <Image
                src={photo.src}
                alt="Photo"
                width={photo.type === 'portrait' ? 500 : 1000}
                height={photo.type === 'landscape' ? 750 : 500}
                className="relative cursor-pointer"
                onClick={() => {
                  lightboxRef.current?.openGallery(index);
                }}
                priority={index < 10} // Adding priority to the first 10 images for faster loading
              />
              <div className="overlay"></div> {/* Adding overlay for extra protection */}
            </div>
          </div>
        ))}
      </Masonry>

      <LightGallery
        onInit={(ref) => {
          if (ref) {
            lightboxRef.current = ref.instance;
          }
        }}
        id="lightGallery"
        download={false}
        zoom={false}
        speed={500}
        plugins={[lgThumbnail, lgZoom]}
        dynamic
        dynamicEl={photos.map((photo) => ({
          src: photo.src,
          thumb: photo.src,
        }))}
      />
    </div>
  );
};

export default Portfolio;

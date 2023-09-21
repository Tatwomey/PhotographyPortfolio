import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";
import LightGallery from "lightgallery/react";
import LightGalleryComponent from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

const photos = [
  { src: '/munky-korn-camden-nj-2022-trevortwomeytest.jpg' },
  { src: '/evanescence-amy-lee-camden-nj-2022-trevortwomey.jpg' },
  { src: '/JD-korn-jones-beach-2022-trevor-twomey-1.jpg' },
  { src: '/q-unique-bowery-ballroom-trevortwomey-1.jpg' },
  { src: '/hash-thievery-corporation-2013-trevor-twomey-1.jpg' },
  { src: '/head-red-korn-jones-beach-2022-trevor-twomey-1.jpg' }
];

const Portfolio = () => {
  const lightboxRef = useRef(null);

  const handleRightClick = (e) => {
    e.preventDefault();
    alert('© Trevor Twomey Photography 2023. All Rights Reserved.');
  };

  useEffect(() => {
    document.addEventListener("contextmenu", function (e) {
      const clickedElement = e.target;
      if (clickedElement.closest(".lg-img-wrap")) {
        e.preventDefault();
        alert("© Trevor Twomey Photography 2023. All Rights Reserved.");
      }
    });
  }, []);

  const breakpointCols = {
    default: 3,
    900: 2,
    600: 1
  };

  return (
    <div className='max-w-[1240px] mx-auto py-16 text-center'>
      <h1 className='font-bold text-2xl p-4'>Music Photography</h1>
      <Masonry
        breakpointCols={breakpointCols}
        className="flex gap-4"
        columnClassName=""
      >
        {photos.map((photo, index) => (
          <div className="relative" key={photo.src} onContextMenu={handleRightClick}>
            <Image
              src={photo.src}
              alt="Photo"
              width={500}
              height={750}
              layout="responsive" // Set layout to responsive
              className="relative my-4 cursor-pointer"
            />
            <div
              className="absolute w-full h-full inset-0 bg-transparent hover:bg-stone-900 hover:bg-opacity-10 cursor-pointer"
              onClick={() => {
                lightboxRef.current?.openGallery(index);
              }}
            ></div>
          </div>
        ))}
      </Masonry>

      <LightGalleryComponent
        onInit={(ref) => {
          if (ref) {
            lightboxRef.current = ref.instance;
          }
        }}
        id="lightGallery"
        download={true}
        zoom={false}
        speed={500}
        plugins={[lgThumbnail, lgZoom]}
        dynamic
        dynamicEl={photos.map((photo) => ({
          src: photo.src,
          thumb: photo.src
        }))}
      />
    </div>
  );
};

export default Portfolio;

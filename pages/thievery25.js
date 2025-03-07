import React, { useEffect, useRef } from "react";
import Masonry from "react-masonry-css";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import Hero from "@/components/Hero";

// All Thievery Corporation photos, fully randomized
const photos = [
  { "src": "/Thievery25/thievery_corporation_terminal5-41.jpg", "type": "portrait" },
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
    { "src": "/Thievery25/thievery_corporation_terminal5-33.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-24.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-22.jpg", "type": "portrait" },
    { "src": "/Thievery25/thievery_corporation_terminal5-16.jpg", "type": "portrait" },
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

const Thievery25 = () => {
  const lightboxRef = useRef(null);

  const breakpointCols = {
    default: 4,
    1100: 3,
    700: 2,
    500: 2
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    alert('© Trevor Twomey Photography 2025. All Rights Reserved.');
  };

  useEffect(() => {
    document.addEventListener("contextmenu", function (e) {
      const clickedElement = e.target;
      if (clickedElement.closest(".lg-img-wrap")) {
        e.preventDefault();
        alert("© Trevor Twomey Photography 2025. All Rights Reserved.");
      }
    });
  }, []);

  return (
    <div className="max-w-[1240px] mx-auto py-4 sm:py-16">
      <Hero heading="Thievery Corporation Photography" message="Explore the captivating visuals of Thievery Corporation in concert." />
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
            <img
              src={photo.src}
              alt="Photo"
              width={photo.type === 'portrait' ? 500 : 1000}
              height={photo.type === 'landscape' ? 750 : 500}
              className="relative cursor-pointer"
              onClick={() => lightboxRef.current?.openGallery(index)}
            />
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
        download={true}
        zoom={true}
        speed={500}
        plugins={[lgThumbnail, lgZoom]}
        dynamic
        dynamicEl={photos.map((photo) => ({
          src: photo.src,
          thumb: photo.src,
          downloadUrl: photo.src
        }))}
      />
    </div>
  );
};

export default Thievery25;

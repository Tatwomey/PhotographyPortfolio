import React, { useEffect, useRef } from "react";
import Masonry from "react-masonry-css";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css"; // Ensure CSS is correctly imported
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import Hero from "@/components/Hero"; // Verify the path to Hero component

const photos = [
    // List of photos
    { "src": "/Elias_nonpoint_nyc_trevortwomey.jpg", "type": "portrait" },
    // Additional photos
    { "src": "/Elias_nonpoint_nyc_trevortwomey-2.jpg", "type": "portrait" },
    // More photos can be added here
];

const Elias = () => {
  const lightboxRef = useRef(null);

  const breakpointCols = {
    default: 4,
    1100: 3,
    700: 2,
    500: 2
  };

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

  return (
    <div className="max-w-[1240px] mx-auto py-4 sm:py-16">
      <Hero heading="Elias Photography" message="Explore the captivating visuals of Elias in concert." />
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
          downloadUrl: photo.src // Enable direct download from the original source
        }))}
      />
    </div>
  );
};

export default Elias;

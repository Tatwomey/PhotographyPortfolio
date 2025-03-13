import React, { useRef, useState, useEffect, useTransition } from "react";
import Masonry from "react-masonry-css";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

const Portfolio = ({ photos, sectionId }) => {
  const lightboxRef = useRef(null);
  const [startTime, setStartTime] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [isPending, startTransition] = useTransition();

  const breakpointCols = {
    default: 4,
    1100: 3,
    700: 2,
    500: 2,
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!window.trackGAEvent) {
        window.trackGAEvent = (event, data) => {
          if (window.gtag) {
            window.gtag("event", event, data);
          }
        };
      }

      const images = document.querySelectorAll(".portfolio-image");
      const handleClick = (index) => () => handlePhotoClick(photos[index], index);

      images.forEach((img, index) => {
        img.addEventListener("click", handleClick(index));
      });

      return () => {
        images.forEach((img, index) => {
          img.removeEventListener("click", handleClick(index));
        });
      };
    }
  }, [photos]);

  const handlePhotoClick = (photo, index) => {
    startTransition(() => {
      if (window.trackGAEvent) {
        window.trackGAEvent("photo_click", { photo_name: photo.src, index });
      }

      setStartTime(Date.now());
      setCurrentPhoto(photo.src);
    });

    if (lightboxRef.current) {
      lightboxRef.current.openGallery(index);
    }
  };

  return (
    <div id={sectionId} className="max-w-[1240px] mx-auto py-4 sm:py-16">
      <Masonry
        breakpointCols={breakpointCols}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {photos.map((photo, index) => (
          <div key={photo.src} className="relative mb-4">
            <img
              src={photo.src}
              alt={photo.alt || "Photo"}
              className="portfolio-image cursor-pointer"
              draggable="false"
            />
          </div>
        ))}
      </Masonry>

      <LightGallery
        onInit={(ref) => {
          if (ref) lightboxRef.current = ref.instance;
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
          downloadUrl: photo.src,
        }))}
      />
    </div>
  );
};

export default Portfolio;

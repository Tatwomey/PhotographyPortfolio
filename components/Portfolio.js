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
      const images = document.querySelectorAll(".portfolio-image");

      images.forEach((img, index) => {
        img.removeEventListener("click", handlePhotoClick); // Ensure no duplicate listeners
        img.addEventListener("click", () => handlePhotoClick(photos[index], index));
      });

      return () => {
        images.forEach((img) => img.removeEventListener("click", handlePhotoClick));
      };
    }
  }, [photos]);

  const handlePhotoClick = (photo, index) => {
    console.log("📸 Tracking Photo Click:", photo.src, index); // Debug Log

    startTransition(() => {
      if (window.gtag) {
        console.log("✅ Sending gtag event for:", photo.src, index); // Debug Log
        window.gtag("event", "photo_click", { photo_name: photo.src, index });
      } else {
        console.warn("⚠️ window.gtag is undefined, event not sent.");
      }

      setStartTime(Date.now());
      setCurrentPhoto(photo.src);
    });

    if (lightboxRef.current) {
      console.log("🖼️ Opening Lightbox for:", photo.src, index); // Debug Log
      lightboxRef.current.openGallery(index);
    } else {
      console.warn("⚠️ lightboxRef is undefined, Lightbox may not open.");
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
          if (ref) {
            console.log("✅ LightGallery initialized"); // Debug Log
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
          downloadUrl: photo.src,
        }))}
      />
    </div>
  );
};

export default Portfolio;

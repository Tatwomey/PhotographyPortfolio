import React, { useRef, useState, useEffect } from "react";
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

  const breakpointCols = {
    default: 4,
    1100: 3,
    700: 2,
    500: 2,
  };

  // Function to track photo click
  const handlePhotoClick = (photo, index) => {
    if (window.trackGAEvent) {
      window.trackGAEvent("photo_click", {
        photo_name: photo.src,
        index: index,
      });
    }

    // Set start time for photo viewing duration
    setStartTime(Date.now());
    setCurrentPhoto(photo.src);

    // Open lightbox
    lightboxRef.current?.openGallery(index);
  };

  // Function to track photo close and time spent
  const handlePhotoClose = () => {
    if (startTime && currentPhoto) {
      const timeSpent = (Date.now() - startTime) / 1000; // Convert ms to seconds
      if (window.trackGAEvent) {
        window.trackGAEvent("photo_engagement", {
          photo_name: currentPhoto,
          time_spent: timeSpent,
        });
      }
    }

    // Reset tracking
    setStartTime(null);
    setCurrentPhoto(null);
  };

  // Detect when lightbox is closed
  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        handlePhotoClose();
      }
    };

    const handleClickOutside = (event) => {
      if (!document.getElementById("lightGallery")?.contains(event.target)) {
        handlePhotoClose();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [currentPhoto, startTime]);

  return (
    <div id={sectionId} className="max-w-[1240px] mx-auto py-4 sm:py-16">
      <Masonry
        breakpointCols={breakpointCols}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {photos.map((photo, index) => (
          <div
            className={`relative mb-4 ${photo.type === "landscape" ? "my-masonry-grid_column-span-2" : ""}`}
            key={photo.src}
          >
            <img
              src={photo.src}
              alt="Photo"
              style={{
                maxWidth: "100%",
                height: "auto",
                cursor: "pointer",
              }}
              draggable="false"
              onClick={() => handlePhotoClick(photo, index)}
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
          downloadUrl: photo.src,
        }))}
      />
    </div>
  );
};

export default Portfolio;

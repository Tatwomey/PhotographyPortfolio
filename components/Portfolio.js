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

  // ✅ Function to handle clicks
  const handlePhotoClick = (photo, index, event) => {
    event.stopPropagation(); // Prevent LightGallery from interfering
    console.log("📸 Photo Clicked:", photo.src, "Index:", index); // Debugging

    if (window.trackGAEvent) {
      console.log("✅ GA Event Fired");
      window.trackGAEvent("photo_click", {
        photo_name: photo.src,
        index: index,
      });
    } else {
      console.warn("⚠️ GA Event Function Not Found");
    }

    setStartTime(Date.now());
    setCurrentPhoto(photo.src);

    if (lightboxRef.current) {
      lightboxRef.current.openGallery(index);
    }
  };

  // ✅ Function to track photo close and time spent
  const handlePhotoClose = () => {
    if (startTime && currentPhoto) {
      const timeSpent = (Date.now() - startTime) / 1000;
      console.log(`🕒 Time spent on ${currentPhoto}: ${timeSpent}s`);

      if (window.trackGAEvent) {
        window.trackGAEvent("photo_engagement", {
          photo_name: currentPhoto,
          time_spent: timeSpent,
        });
      }
    }

    setStartTime(null);
    setCurrentPhoto(null);
  };

  // ✅ Ensure LightGallery does not block clicks
  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        handlePhotoClose();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
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
            onClick={(e) => handlePhotoClick(photo, index, e)} // ✅ Attach click here
            style={{
              cursor: "pointer",
              position: "relative",
            }}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              style={{
                maxWidth: "100%",
                height: "auto",
                pointerEvents: "auto", // ✅ Ensure clicks register
                userSelect: "none", // Prevents text selection
                WebkitUserDrag: "none", // Disables dragging in Safari
                MozUserSelect: "none",
              }}
              draggable="false"
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
        onBeforeOpen={() => console.log("🔍 Lightbox Opened")}
        onBeforeClose={handlePhotoClose}
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

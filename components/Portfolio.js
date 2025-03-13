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
  const [loadedPhotos, setLoadedPhotos] = useState([]);

  useEffect(() => {
    const updatedPhotos = photos.map((photo) => {
      const img = new Image();
      img.src = photo.src;

      return new Promise((resolve) => {
        img.onload = () => {
          resolve({
            ...photo,
            width: img.naturalWidth,
            height: img.naturalHeight,
            isLandscape: img.naturalWidth > img.naturalHeight, // Correct detection
          });
        };
      });
    });

    Promise.all(updatedPhotos).then(setLoadedPhotos);
  }, [photos]);

  const breakpointCols = {
    default: 4, // Desktop: 4 columns
    1100: 3, // Medium screen: 3 columns
    700: 2, // Small screens: 2 columns
    500: 2, // Mobile: 2 columns (allowing portrait images to stack properly)
  };

  return (
    <div id={sectionId} className="max-w-[1240px] mx-auto py-4 sm:py-16">
      <Masonry
        breakpointCols={breakpointCols}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {loadedPhotos.map((photo, index) => {
          return (
            <div
              key={photo.src}
              className={`image-container ${
                photo.isLandscape ? "landscape" : "portrait"
              }`}
              style={{
                gridColumn: photo.isLandscape ? "span 2" : "span 1", // ✅ Ensures correct layout
              }}
            >
              <img
                src={photo.src}
                alt={photo.alt || "Photo"}
                className="portfolio-image cursor-pointer"
                draggable="false"
              />
            </div>
          );
        })}
      </Masonry>
    </div>
  );
};

export default Portfolio;

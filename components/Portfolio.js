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
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    if (photos.length > 0) {
      setGalleryItems(
        photos.map((photo) => ({
          src: photo.src,
          thumb: photo.src,
          downloadUrl: photo.src,
        }))
      );
    }
  }, [photos]);

  useEffect(() => {
    console.log("🔍 LightboxRef on Mount:", lightboxRef.current);
  }, [lightboxRef]);

  const handlePhotoClick = (event, index) => {
    event.preventDefault();

    if (!lightboxRef.current) {
      console.error("❌ LightGallery has not initialized yet!");
      return;
    }

    console.log(`✅ Opening LightGallery at index ${index}`);
    lightboxRef.current.openGallery(index);
  };

  return (
    <div id={sectionId} className="max-w-[1240px] mx-auto py-4 sm:py-16">
      <Masonry
        breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 2 }}
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
              onClick={(event) => handlePhotoClick(event, index)}
            />
          </div>
        ))}
      </Masonry>

      {galleryItems.length > 0 && (
        <LightGallery
          onInit={(ref) => {
            console.log("✅ LightGallery initialized:", ref.instance);
            lightboxRef.current = ref.instance;
          }}
          id="lightGallery"
          download={true}
          zoom={true}
          speed={500}
          plugins={[lgThumbnail, lgZoom]}
          dynamic
          dynamicEl={galleryItems}
        />
      )}
    </div>
  );
};

export default Portfolio;

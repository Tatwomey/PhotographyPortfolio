import React, { useRef, useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import Image from "next/image";

const Portfolio = ({ photos, sectionId }) => {
  const lightboxRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [orderedPhotos, setOrderedPhotos] = useState([]);

  // ✅ Set ordered photos once (prevents Masonry from shifting order)
  useEffect(() => {
    setOrderedPhotos([...photos]); // Keeps original order
  }, [photos]);

  // ✅ Track window size changes
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Strict Masonry Columns (Prevents 3rd column)
  const breakpointCols = {
    default: 4,  // ✅ 4 columns on large screens
    1200: 2,     // ✅ 2 columns on medium screens (NO 3rd COLUMN)
    768: 2,      // ✅ 2 columns on tablets
    500: 2       // ✅ 2 columns on mobile
  };

  // ✅ Ensure all images are loaded before displaying LightGallery
  useEffect(() => {
    if (typeof window !== "undefined" && photos.length > 0) {
      let loadedImages = 0;
      photos.forEach((photo) => {
        const img = new window.Image();
        img.src = photo.src;
        img.onload = () => {
          loadedImages++;
          if (loadedImages === photos.length) {
            setImagesLoaded(true);
          }
        };
        img.onerror = () => console.error("❌ Failed to load:", photo.src);
      });
    }
  }, [photos]);

  // ✅ Handle image click to open LightGallery with correct index
  const handlePhotoClick = (index) => {
    console.log("📸 Photo Clicked:", orderedPhotos[index]?.src);

    if (lightboxRef.current) {
      console.log("🖼️ Opening Lightbox at index:", index);
      lightboxRef.current.openGallery(index);
    }
  };

  return (
    <div id={sectionId} className="max-w-[1240px] mx-auto py-4 sm:py-16">
      {orderedPhotos.length > 0 && (
        <Masonry
          key={windowWidth} // ✅ Prevents order shift while keeping responsiveness
          breakpointCols={breakpointCols}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {orderedPhotos.map((photo, index) => (
            <div key={photo.src} className={`image-container ${photo.type}`}>
              <Image
                src={photo.src}
                alt="Photo"
                className="portfolio-image cursor-pointer"
                width={photo.type === "landscape" ? 1200 : 800}
                height={photo.type === "landscape" ? 800 : 1200}
                unoptimized
                priority={index < 4} // ✅ Ensures first 4 images load immediately
                loading={index < 4 ? "eager" : "lazy"} // ✅ Fixes lazy loading black placeholders
                onClick={() => handlePhotoClick(index)}
                onError={() => console.error("❌ Image failed to load:", photo.src)}
                onLoad={() => console.log("✅ Image loaded:", photo.src)}
              />
            </div>
          ))}
        </Masonry>
      )}

      {imagesLoaded && orderedPhotos.length > 0 && (
        <LightGallery
          key={orderedPhotos.length} // ✅ Ensures re-initialization
          onInit={(ref) => {
            if (ref) {
              console.log("✅ LightGallery initialized successfully");
              lightboxRef.current = ref.instance;
            }
          }}
          id="lightGallery"
          download={true}
          zoom={true}
          speed={500}
          plugins={[lgThumbnail, lgZoom]}
          dynamic
          dynamicEl={orderedPhotos.map((photo) => ({
            src: photo.src,
            thumb: photo.src,
            downloadUrl: photo.src,
          }))}
        />
      )}
    </div>
  );
};

export default Portfolio;

import React, { useRef, useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css"; // ✅ Removed zoom plugin
import lgThumbnail from "lightgallery/plugins/thumbnail";
import Image from "next/image"; // ✅ Keeping Next.js Image but disabling optimization

const Portfolio = ({ photos, sectionId }) => {
  const lightboxRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [orderedPhotos, setOrderedPhotos] = useState([]);

  // ✅ Strictly Maintain Photo Order (No Masonry Reordering)
  useEffect(() => {
    setOrderedPhotos([...photos]); // Ensures exact array order
  }, [photos]);

  // ✅ Track Window Size to Enforce Layout Rules
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Strict Masonry Columns (NO 3rd Column)
  const breakpointCols = {
    default: 4, // ✅ 4 columns on large screens
    1200: 2, // ✅ 2 columns on medium screens
    768: 2, // ✅ 2 columns on tablets
    500: 2, // ✅ 2 columns on mobile
  };

  // ✅ Ensure ALL Images Load Before Displaying Masonry
  useEffect(() => {
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
  }, [photos]);

  // ✅ Handle Click to Open LightGallery at Correct Index
  const handlePhotoClick = (index) => {
    if (lightboxRef.current) {
      lightboxRef.current.openGallery(index);
    }
  };

  return (
    <div id={sectionId} className="w-full max-w-none px-4 py-2 sm:py-8">

      {imagesLoaded && orderedPhotos.length > 0 && (
        <Masonry
          key={windowWidth} // ✅ Prevents reordering during resize
          breakpointCols={breakpointCols}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {orderedPhotos.map((photo, index) => (
            <div key={photo.src} className={`image-container ${photo.type}`}>
              <Image
                src={photo.src}
                alt={`Photo ${index + 1}`}
                className="portfolio-image cursor-pointer"
                width={photo.type === "landscape" ? 1200 : 800}
                height={photo.type === "landscape" ? 800 : 1200}
                unoptimized // ✅ Ensures full manual control over images
                priority={index < 4} // ✅ First 4 images load immediately
                loading={index < 4 ? "eager" : "lazy"}
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
          speed={500}
          plugins={[lgThumbnail]} // ✅ Removed zoom
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

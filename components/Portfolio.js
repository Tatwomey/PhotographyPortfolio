import React, { useRef, useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import Image from "next/image";

const Portfolio = ({ photos, sectionId }) => {
  const lightboxRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [orderedPhotos, setOrderedPhotos] = useState([]);

  /** ✅ Strictly preserve the original order of photos */
  useEffect(() => {
    setOrderedPhotos([...photos]); // Keeps strict order
  }, [photos]);

  /** ✅ Ensure all images are fully loaded before rendering Masonry */
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

  /** ✅ Adjust Layout Dynamically on Resize */
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setOrderedPhotos([...photos]); // Force Masonry to keep order
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /** ✅ Masonry Layout: Always 2 columns on mobile/tablet, 4 on desktop */
  const breakpointCols = {
    default: 4, // ✅ 4 columns on desktop
    1200: 2, // ✅ 2 columns on medium screens
    768: 2, // ✅ 2 columns on tablets
    500: 2, // ✅ 2 columns on mobile
  };

  /** ✅ Handle image click to open LightGallery */
  const handlePhotoClick = (index) => {
    console.log("📸 Photo Clicked:", orderedPhotos[index]?.src);
    if (lightboxRef.current) {
      console.log("🖼️ Opening Lightbox at index:", index);
      lightboxRef.current.openGallery(index);
    }
  };

  return (
    <div id={sectionId} className="max-w-[1240px] mx-auto py-4 sm:py-16">
      {imagesLoaded && orderedPhotos.length > 0 ? (
        <>
          <Masonry
            breakpointCols={breakpointCols}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
          >
            {orderedPhotos.map((photo, index) => (
              <div key={photo.src} className={`image-container ${photo.type || ""}`}>
                <Image
                  src={photo.src}
                  alt={`Photo ${index + 1}`}
                  className="portfolio-image cursor-pointer"
                  width={photo.type === "landscape" ? 1200 : 800}
                  height={photo.type === "landscape" ? 800 : 1200}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 4} // ✅ Ensures first 4 images load immediately
                  loading={index < 4 ? "eager" : "lazy"} // ✅ Prevents blank placeholders
                  onClick={() => handlePhotoClick(index)}
                  onError={() => console.error("❌ Image failed to load:", photo.src)}
                  onLoad={() => console.log("✅ Image loaded:", photo.src)}
                />
              </div>
            ))}
          </Masonry>

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
            zoom={false} // ✅ Disabled zoom per request
            speed={500}
            plugins={[lgThumbnail]}
            dynamic
            dynamicEl={orderedPhotos.map((photo) => ({
              src: photo.src,
              thumb: photo.src,
              downloadUrl: photo.src,
            }))}
          />
        </>
      ) : (
        <p className="text-center text-white">📸 Loading images...</p>
      )}
    </div>
  );
};

export default Portfolio;

import React, { useRef, useEffect, useState } from "react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import Image from "next/image";
import Lenis from "@studio-freight/lenis";

const Portfolio = ({ photos, sectionId }) => {
  const lightboxRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  /** ✅ Ensure all images are fully loaded before rendering */
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

  /** ✅ Enable smooth scrolling */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const lenis = new Lenis();
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
      return () => lenis.destroy(); // ✅ Cleanup to prevent memory leaks
    }
  }, []);

  /** ✅ Handle image click to open LightGallery */
  const handlePhotoClick = (index) => {
    console.log("📸 Photo Clicked:", photos[index]?.src);
    if (lightboxRef.current) {
      console.log("🖼️ Opening Lightbox at index:", index);
      lightboxRef.current.openGallery(index);
    }
  };

  return (
    <div id={sectionId} className="portfolio-container">
      {imagesLoaded ? (
        <>
          <div className="grid-container">
            {photos.map((photo, index) => (
              <div
                key={photo.src}
                className={`grid-item ${photo.type === "landscape" ? "landscape" : "portrait"}`}
                onClick={() => handlePhotoClick(index)}
              >
                <Image
                  src={photo.src}
                  alt={`Photo ${index + 1}`}
                  width={photo.type === "landscape" ? 1200 : 800}
                  height={photo.type === "landscape" ? 800 : 1200}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 4} // ✅ Ensures first 4 images load immediately
                  loading={index < 4 ? "eager" : "lazy"} // ✅ Prevents blank placeholders
                  onError={() => console.error("❌ Image failed to load:", photo.src)}
                  onLoad={() => console.log("✅ Image loaded:", photo.src)}
                  className="portfolio-image"
                />
                
              </div>
            ))}
          </div>

          <LightGallery
            key={photos.length}
            onInit={(ref) => {
              if (ref) {
                console.log("✅ LightGallery initialized successfully");
                lightboxRef.current = ref.instance;
              }
            }}
            id="lightGallery"
            download={false}
            zoom={false}
            speed={500}
            plugins={[lgThumbnail]}
            dynamic
            dynamicEl={photos.map((photo) => ({
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

import React, { useRef, useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import LightGallery from "lightgallery/react";
import Image from "next/image";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

const Portfolio = ({ photos, sectionId }) => {
  const lightboxRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth); // ✅ Force re-render on resize
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Fixed Breakpoint Columns to Ensure 2-Column Mobile Layout
  const breakpointCols = {
    default: 4, // 4 columns on desktop
    1100: 3,    // 3 columns on medium screens
    700: 2,     // 2 columns on small screens
    500: 2      // ✅ Force 2 columns on mobile
  };

  // ✅ Debugging: Log received photos
  useEffect(() => {
    console.log("📸 Photos received in Portfolio:", photos);
  }, [photos]);

  const handlePhotoClick = (index) => {
    console.log("📸 Photo Clicked:", photos[index]?.src);

    if (lightboxRef.current) {
      console.log("🖼️ Opening Lightbox at index:", index);
      lightboxRef.current.openGallery(index);
    }
  };

  return (
    <div id={sectionId} className="max-w-[1240px] mx-auto py-4 sm:py-16">
    <Masonry
  key={windowWidth} // ✅ Forces re-render on resize
  breakpointCols={breakpointCols}
  className="masonry-grid"
  columnClassName="masonry-grid_column"
>
  {photos.map((photo, index) => (
    <div key={photo.src} className={`image-container ${photo.type}`}>
      <Image
        src={photo.src}
        alt="Photo"
        className="portfolio-image cursor-pointer"
        width={photo.type === "landscape" ? 1200 : 800}
        height={photo.type === "landscape" ? 800 : 1200}
        unoptimized
        priority
        onClick={() => handlePhotoClick(index)}
        onError={() => console.error("❌ Image failed to load:", photo.src)}
        onLoad={() => console.log("✅ Image loaded:", photo.src)}
      />
    </div>
  ))}
</Masonry>

      <LightGallery
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

import React, { useRef, useEffect, useState } from "react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import Image from "next/image";
import Lenis from "lenis";

const Portfolio = ({ photos, sectionId }) => {
  const lightboxRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload so we can animate in once everything is ready
  useEffect(() => {
    if (typeof window === "undefined" || photos.length === 0) return;

    let loaded = 0;
    photos.forEach((p) => {
      const img = new window.Image();
      img.src = p.src;
      img.onload = img.onerror = () => {
        loaded += 1;
        if (loaded === photos.length) setImagesLoaded(true);
      };
    });
  }, [photos]);

  // Smooth scrolling
  useEffect(() => {
    const lenis = new Lenis();
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const handlePhotoClick = (index) => {
    if (lightboxRef.current) lightboxRef.current.openGallery(index);
  };

  return (
    <div id={sectionId} className="portfolio-container">
      {imagesLoaded ? (
        <>
          <div className="grid-container">
            {photos.map((photo, index) => (
              <div
                // key includes type to force a true remount if type changes
                key={`${photo.src}-${photo.type}`}
                className={`grid-item ${
                  photo.type === "landscape" ? "landscape" : "portrait"
                } group cursor-pointer overflow-hidden opacity-0 translate-y-4 animate-fade-in-up`}
                style={{
                  animationDelay: `${index * 75}ms`,
                  animationFillMode: "forwards",
                }}
                onClick={() => handlePhotoClick(index)}>
                <Image
                  src={photo.src}
                  alt={photo.alt || `Photo ${index + 1}`}
                  width={photo.type === "landscape" ? 1200 : 800}
                  height={photo.type === "landscape" ? 800 : 1200}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="portfolio-image transition-all duration-300 group-hover:scale-[1.03] group-hover:brightness-105 group-hover:shadow-xl"
                  priority={index < 4}
                  loading={index < 4 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>

          <LightGallery
            key={photos.length}
            onInit={(ref) => {
              if (ref) lightboxRef.current = ref.instance;
            }}
            id="lightGallery"
            download={false}
            zoom={false}
            speed={500}
            plugins={[lgThumbnail]}
            dynamic
            dynamicEl={photos.map((p) => ({
              src: p.src,
              thumb: p.src,
              downloadUrl: p.src,
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

// components/Portfolio.jsx
import React, { useRef, useEffect, useState, useMemo } from "react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import Image from "next/image";
import Lenis from "lenis";
import { useRouter } from "next/router";

function pushDataLayer(eventPayload) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventPayload);
}

function getPhotoId(photo, portfolioId, index) {
  if (photo?.id && typeof photo.id === "string") return photo.id;
  const n = String(index + 1).padStart(3, "0");
  return `${portfolioId}_${n}`;
}

const Portfolio = ({ photos, sectionId, enableDownload = false }) => {
  const router = useRouter();
  const lightboxRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // --- Analytics state
  const isGalleryOpenRef = useRef(false);
  const activeIndexRef = useRef(null);
  const activeStartMsRef = useRef(null);
  const openedOnceRef = useRef(false);

  const portfolioId = useMemo(() => {
    return (sectionId && String(sectionId).trim()) || "portfolio";
  }, [sectionId]);

  const gated = useMemo(() => {
    const path = router?.pathname || "";
    return path.startsWith("/music/");
  }, [router?.pathname]);

  // Preload
  useEffect(() => {
    if (typeof window === "undefined" || !photos || photos.length === 0) return;

    let loaded = 0;
    let cancelled = false;

    photos.forEach((p) => {
      const img = new window.Image();
      img.src = p.src;
      img.onload = img.onerror = () => {
        if (cancelled) return;
        loaded += 1;
        if (loaded === photos.length) setImagesLoaded(true);
      };
    });

    return () => {
      cancelled = true;
    };
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

  const emitDwellIfNeeded = (reason = "unknown") => {
    const idx = activeIndexRef.current;
    const startMs = activeStartMsRef.current;

    if (idx === null || startMs === null) return;

    const durationMs = Math.round(performance.now() - startMs);

    if (durationMs < 250) {
      activeIndexRef.current = null;
      activeStartMsRef.current = null;
      return;
    }

    const capped = Math.min(durationMs, 10 * 60 * 1000);
    const photo = photos[idx];
    if (!photo) return;

    const photoId = getPhotoId(photo, portfolioId, idx);

    pushDataLayer({
      event: "photo_dwell",
      photo_id: photoId,
      portfolio_id: portfolioId,
      duration_ms: capped,
      gated,
      exit_reason: reason,
    });

    activeIndexRef.current = null;
    activeStartMsRef.current = null;
  };

  const startPhotoView = (idx) => {
    const photo = photos[idx];
    if (!photo) return;

    const photoId = getPhotoId(photo, portfolioId, idx);

    activeIndexRef.current = idx;
    activeStartMsRef.current = performance.now();

    pushDataLayer({
      event: "photo_view",
      photo_id: photoId,
      portfolio_id: portfolioId,
      orientation: photo.type || "unknown",
      gated,
    });
  };

  const handlePhotoClick = (index) => {
    const photo = photos[index];
    if (!photo) return;

    const photoId = getPhotoId(photo, portfolioId, index);

    // Click event that matches your dwell/view IDs
    pushDataLayer({
      event: "photo_click",
      photo_id: photoId,
      portfolio_id: portfolioId,
      gated,
    });

    if (lightboxRef.current) {
      openedOnceRef.current = false; // reset open guard for this session
      lightboxRef.current.openGallery(index);
    }
  };

  const onAfterOpen = () => {
    isGalleryOpenRef.current = true;

    // Prevent double-fire on some LG init edge cases
    if (openedOnceRef.current) return;
    openedOnceRef.current = true;

    const idx =
      typeof lightboxRef.current?.index === "number"
        ? lightboxRef.current.index
        : 0;

    startPhotoView(idx);
  };

  const onAfterSlide = (detail) => {
    if (!isGalleryOpenRef.current) return;

    const nextIndex =
      typeof detail?.index === "number"
        ? detail.index
        : typeof lightboxRef.current?.index === "number"
        ? lightboxRef.current.index
        : null;

    if (nextIndex === null) return;

    emitDwellIfNeeded("slide_change");
    startPhotoView(nextIndex);
  };

  const onBeforeClose = () => {
    emitDwellIfNeeded("modal_close");
    isGalleryOpenRef.current = false;
    openedOnceRef.current = false;
  };

  useEffect(() => {
    const handleRouteStart = () => {
      if (isGalleryOpenRef.current) {
        emitDwellIfNeeded("route_change");
        isGalleryOpenRef.current = false;
        openedOnceRef.current = false;
      }
    };

    router.events.on("routeChangeStart", handleRouteStart);
    return () => router.events.off("routeChangeStart", handleRouteStart);
  }, [router.events]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden" && isGalleryOpenRef.current) {
        emitDwellIfNeeded("tab_blur");
        isGalleryOpenRef.current = false;
        openedOnceRef.current = false;
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [photos]);

  return (
    <div id={sectionId} className="portfolio-container">
      {imagesLoaded ? (
        <>
          <div className="grid-container">
            {photos.map((photo, index) => (
              <div
                key={`${photo.src}-${photo.type}-${index}`}
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
            onAfterOpen={onAfterOpen}
            onAfterSlide={onAfterSlide}
            onBeforeClose={onBeforeClose}
            id="lightGallery"
            download={enableDownload}
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

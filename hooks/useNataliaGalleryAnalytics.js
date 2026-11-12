import { useEffect } from "react";

/**
 * Natalia's editorial viewer already emits photo_click, photo_view and
 * photo_dwell. This hook adds in-page visibility and engagement signals.
 *
 * All custom events are dataLayer pushes; they reach GA4 only when GTM
 * has matching triggers/tags. No names, emails or session IDs are sent.
 */
const portfolioId = "/music/nat26";

export function pushGalleryEvent(event, details = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    portfolio_id: portfolioId,
    gated: true,
    ...details,
  });
}

export function useNataliaGalleryAnalytics(photos) {
  useEffect(() => {
    if (typeof window === "undefined" || !photos?.length) return;

    const seen = new Set();
    const pending = new Map();
    const visible = new Set();
    let endReached = false;

    // Count an impression once, only after >=50% of the photo's
    // layout is in the viewport for a continuous second.
    const impression = (index) => {
      if (
        seen.has(index) ||
        !visible.has(index) ||
        document.visibilityState !== "visible"
      ) return;

      seen.add(index);
      pushGalleryEvent("photo_impression", {
        photo_id: portfolioId + ":" + photos[index].file,
        photo_position: index + 1,
        photo_section: index === 0 ? "cover" : "sequence",
      });

      // Reaching the final photo is NOT the same as seeing every image.
      if (index === photos.length - 1 && !endReached) {
        endReached = true;
        pushGalleryEvent("gallery_end_reached", {
          photos_seen: seen.size,
          photos_total: photos.length,
        });
      }
    };

    const observer = typeof IntersectionObserver === "function"
      ? new IntersectionObserver((entries) => {
          for (const entry of entries) {
            const index = Number(entry.target.dataset.nat26PhotoIndex);
            if (!Number.isInteger(index) || index < 0 || index >= photos.length) continue;

            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
              visible.add(index);
              if (!seen.has(index) && !pending.has(index)) {
                const timeout = window.setTimeout(() => {
                  pending.delete(index);
                  impression(index);
                }, 1000);
                pending.set(index, timeout);
              }
            } else {
              visible.delete(index);
              if (pending.has(index)) {
                window.clearTimeout(pending.get(index));
                pending.delete(index);
              }
            }
          }
        }, { threshold: [0, 0.5, 0.75, 1] })
      : null;

    const elements = document.querySelectorAll("[data-nat26-photo-index]");
    if (observer) elements.forEach((element) => observer.observe(element));

    const reached = new Set();
    const scrollDepths = [25, 50, 75, 100];

    const measureScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;

      const percent = Math.min(100, Math.round((window.scrollY / max) * 100));
      for (const depth of scrollDepths) {
        if (percent >= depth && !reached.has(depth)) {
          reached.add(depth);
          pushGalleryEvent("gallery_scroll_depth", { scroll_percent: depth });
        }
      }
    };

    window.addEventListener("scroll", measureScroll, { passive: true });
    window.addEventListener("resize", measureScroll, { passive: true });
    measureScroll();

    // Foreground time milestones (not proof that a visitor was actively engaged).
    let foregroundSeconds = 0;
    const milestones = new Set([30, 60, 120, 300]);
    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible" || !document.hasFocus()) return;
      foregroundSeconds += 1;

      if (milestones.has(foregroundSeconds)) {
        pushGalleryEvent("gallery_foreground_time", {
          foreground_seconds: foregroundSeconds,
        });
      }
    }, 1000);

    return () => {
      observer?.disconnect();
      for (const timeout of pending.values()) window.clearTimeout(timeout);
      window.removeEventListener("scroll", measureScroll);
      window.removeEventListener("resize", measureScroll);
      window.clearInterval(interval);
    };
  }, [photos]);
}

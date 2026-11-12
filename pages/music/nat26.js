import Head from "next/head";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import { useEffect, useRef, useState } from "react";
import styles from "../../styles/nat26.module.css";

// A standalone cover followed by six balanced, two-photo spreads.
const images = [
  { file: "nat.jpg", width: 2000, height: 3000 },
  { file: "960A4017.jpg", width: 4480, height: 6720 },
  { file: "960A4040.jpg", width: 1707, height: 2560 },
  { file: "960A4044-Edit.jpg", width: 4040, height: 6060 },
  { file: "960A4069.jpg", width: 3830, height: 4957 },
  { file: "960A4077-2.jpg", width: 4444, height: 6666 },
  { file: "960A4082-2.jpg", width: 1693, height: 2539 },
  { file: "960A4099.jpg", width: 4480, height: 6720 },
  { file: "960A4119-Edit.jpg", width: 3675, height: 5145 },
  { file: "960A4135.jpg", width: 3337, height: 5006 },
  { file: "960A4141.jpg", width: 4480, height: 6720 },
  { file: "960A4151.jpg", width: 4480, height: 6720 },
  { file: "natglitch.jpg", width: 3063, height: 4594 },
];

const photos = images.map((image, index) => ({
  ...image,
  src: "/nat26/" + image.file,
  alt: "Natalia Clavier at Lightning Society — photograph " + (index + 1),
}));

function track(event) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

function photoId(index) {
  return "/music/nat26:" + photos[index].file;
}

export async function getServerSideProps({ req, res }) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");

  const token = process.env.NEXTAUTH_SECRET
    ? await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    : null;

  if (
    !Array.isArray(token?.allowedPages) ||
    !token.allowedPages.includes("/music/nat26")
  ) {
    return {
      redirect: {
        destination: "/login?callbackUrl=%2Fmusic%2Fnat26",
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default function NataliaClavierLookbook() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const dialogRef = useRef(null);
  const activePhoto = selectedIndex === null ? null : photos[selectedIndex];
  const isOpen = selectedIndex !== null;

  const openPhoto = (index) => {
    track({
      event: "photo_click",
      photo_id: photoId(index),
      portfolio_id: "/music/nat26",
      gated: true,
      click_source: index === 0 ? "cover" : "grid",
    });
    setSelectedIndex(index);
  };

  const closeViewer = () => {
    if (dialogRef.current?.open) dialogRef.current.close();
    setSelectedIndex(null);
  };

  const step = (direction) => {
    setSelectedIndex((index) =>
      index === null ? null : (index + direction + photos.length) % photos.length
    );
  };

  // Keep the dialog open when switching photographs; restore scrolling on close.
  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const started = performance.now();
    const id = photoId(selectedIndex);

    track({
      event: "photo_view",
      photo_id: id,
      portfolio_id: "/music/nat26",
      orientation: "portrait",
      gated: true,
    });

    return () => {
      const duration = Math.min(Math.round(performance.now() - started), 600000);
      if (duration >= 250) {
        track({
          event: "photo_dwell",
          photo_id: id,
          portfolio_id: "/music/nat26",
          duration_ms: duration,
          gated: true,
          exit_reason: "viewer_change_or_close",
        });
      }
    };
  }, [selectedIndex]);

  return (
    <>
      <Head>
        <title>Natalia Clavier — Lightning Society | Trevor Twomey Photography</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="referrer" content="same-origin" />
      </Head>

      <main className={styles.lookbook}>
        <header className={styles.masthead}>
          <a className={styles.wordmark} href="/">Trevor Twomey</a>
          <div className={styles.mastheadRight}>
            <span>Private selection</span>
            <span className={styles.separator}>/</span>
            <button
              className={styles.signOut}
              type="button"
              onClick={() => signOut({ callbackUrl: "/login?callbackUrl=%2Fmusic%2Fnat26" })}
            >
              Sign out
            </button>
          </div>
        </header>

        <section className={styles.cover} aria-labelledby="nat26-title">
          <div>
            <p className={styles.eyebrow}>Music / 2026 / Selected photographs</p>
            <h1 className={styles.title} id="nat26-title">NATALIA<br />CLAVIER</h1>
            <p className={styles.event}>LIGHTNING SOCIETY</p>
            <a
              className={styles.jump}
              href="#nat26-sequence"
              onClick={(event) => {
                if (typeof document === "undefined") return;
                const destination = document.getElementById("nat26-sequence");
                if (!destination) return;
                event.preventDefault();
                const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                destination.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
                window.history.replaceState(null, "", "#nat26-sequence");
              }}
            >
              View photographs <span className={styles.jumpArrow} aria-hidden="true">↓</span>
            </a>
          </div>

          <figure className={styles.coverFigure}>
            <button
              className={styles.photoButton}
              type="button"
              onClick={() => openPhoto(0)}
              aria-label="Enlarge Natalia Clavier cover photograph"
            >
              <Image
                src={photos[0].src}
                alt={photos[0].alt}
                width={photos[0].width}
                height={photos[0].height}
                sizes="(max-width: 700px) 90vw, 38vw"
                quality={85}
                priority
                className={styles.coverImage}
              />
            </button>
          </figure>
        </section>

        <section
          className={styles.sequence}
          id="nat26-sequence"
          aria-labelledby="nat26-sequence-title"
        >
          <div className={styles.sequenceHead}>
            <div>
              <p className={styles.eyebrow}>Photographs / 01–12</p>
              <h2 className={styles.sequenceTitle} id="nat26-sequence-title">
                Selected<br />photographs
              </h2>
            </div>
            <span className={styles.count}>12 photographs / 6 pairs</span>
          </div>
          <div className={styles.pairs}>
            {photos.slice(1).map((photo, index) => (
              <figure className={styles.pair} key={photo.file}>
                <button
                  className={styles.photoButton}
                  type="button"
                  onClick={() => openPhoto(index + 1)}
                  aria-label={"Enlarge photograph " + (index + 2) + " of 13"}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(max-width: 700px) 46vw, 44vw"
                    quality={85}
                    loading="lazy"
                    className={styles.pairImage}
                  />
                </button>
              </figure>
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <span>Photography &amp; treatments © Trevor Twomey</span>
          <a href="#nat26-title">Back to top ↑</a>
        </footer>
      </main>

      <dialog
        ref={dialogRef}
        className={styles.viewer}
        aria-label="Natalia Clavier photograph viewer"
        onClose={() => setSelectedIndex(null)}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          }
        }}
      >
        <div className={styles.viewerInner}>
          <div className={styles.viewerBar}>
            <span>
              {activePhoto ? (selectedIndex + 1) + " / " + photos.length + " · Natalia Clavier" : ""}
            </span>
            <div className={styles.viewerControls}>
              <button type="button" onClick={() => step(-1)} aria-label="Previous photograph">←</button>
              <button type="button" onClick={() => step(1)} aria-label="Next photograph">→</button>
              <button type="button" onClick={closeViewer}>Close ×</button>
            </div>
          </div>
          <div className={styles.viewerStage}>
            {activePhoto && (
              <Image
                key={activePhoto.file}
                src={activePhoto.src}
                alt={activePhoto.alt}
                width={activePhoto.width}
                height={activePhoto.height}
                sizes="100vw"
                quality={85}
                priority
                className={styles.viewerImage}
              />
            )}
          </div>
          <p className={styles.viewerCaption}>Lightning Society · Trevor Twomey</p>
        </div>
      </dialog>
    </>
  );
}

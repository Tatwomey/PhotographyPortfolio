import { useEffect, useState } from "react";
import Script from "next/script";
import { useSession } from "next-auth/react";

const GoogleAnalytics = () => {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  const { data: session } = useSession();
  const [hashedUserId, setHashedUserId] = useState("anonymous_user");

  useEffect(() => {
    console.log("[GA] GoogleAnalytics component mounted ✅");

    const email = session?.user?.email;

    const hashEmail = async (email) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(email.toLowerCase().trim());
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      console.log("[GA] Hashed user email:", hashHex);
      return hashHex;
    };

    if (email) {
      hashEmail(email).then(setHashedUserId);
    }
  }, [session]);

  if (!gaId) {
    console.warn("[GA] GA ID is missing. Set NEXT_PUBLIC_GOOGLE_ANALYTICS_ID.");
    return null;
  }

  return (
    <>
      {/* Load GA4 Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        onLoad={() => console.log("[GA] gtag.js script loaded ✅")}
      />

      {/* Initialize GA4 with base config */}
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            console.log('[GA] GA4 initialized');

            // Default user_id (anonymous)
            window.__hashedUserId = "anonymous_user";

            // Custom event helper
            window.trackGAEvent = (eventName, eventParams = {}) => {
              console.log('[GA] Custom event fired:', eventName, eventParams);
              if (window.gtag) {
                window.gtag("event", eventName, {
                  ...eventParams,
                  user_properties: {
                    user_identifier: window.__hashedUserId
                  }
                });
              }
            };

            // Gallery image tracking
            document.addEventListener('DOMContentLoaded', function () {
              document.body.addEventListener('click', function (e) {
                const target = e.target;
                if (target.tagName === 'IMG' && target.closest('.gallery')) {
                  const galleryName = window.location.pathname.split('/').pop();
                  const imgSrc = target.src || '';
                  const imgAlt = target.alt || '';
                  const imgClass = target.className || '';

                  window.trackGAEvent('photo_click', {
                    gallery_name: galleryName,
                    image_src: imgSrc,
                    image_alt: imgAlt,
                    image_class: imgClass,
                    page_path: window.location.pathname
                  });
                }
              });
            });
          `,
        }}
      />

      {/* Inject hashed user_id once available */}
      {hashedUserId !== "anonymous_user" && (
        <Script
          id="ga4-user-props"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.__hashedUserId = "${hashedUserId}";
              if (window.gtag) {
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                  user_properties: {
                    user_identifier: "${hashedUserId}"
                  }
                });
                console.log("[GA] GA config updated with hashed user_identifier");
              }
            `,
          }}
        />
      )}
    </>
  );
};

export default GoogleAnalytics;

import { useEffect, useState } from "react";
import Script from "next/script";
import { useSession } from "next-auth/react";

const GoogleAnalytics = () => {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  const { data: session } = useSession();

  const [hashedUserId, setHashedUserId] = useState("anonymous_user");

  useEffect(() => {
    const email = session?.user?.email;

    const hashEmail = async (email) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(email.toLowerCase().trim());
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    };

    if (email) {
      hashEmail(email).then(setHashedUserId);
    }
  }, [session]);

  if (!gaId) {
    console.warn("Google Analytics ID is missing.");
    return null;
  }

  return (
    <>
      {/* Load GA4 Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />

      {/* GA4 base config + debug mode + photo click tracker */}
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // ✅ Force debug mode
            gtag('set', 'debug_mode', true);

            // Default user ID until we inject the real one
            window.__hashedUserId = "anonymous_user";

            // Expose global custom event tracker
            window.trackGAEvent = (eventName, eventParams = {}) => {
              if (window.gtag) {
                window.gtag("event", eventName, {
                  ...eventParams,
                  user_id: window.__hashedUserId,
                  user_identifier: window.__hashedUserId
                });
              }
            };

            // Track clicks on gallery images
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

      {/* Inject hashed user_id + custom dimension */}
      {hashedUserId !== "anonymous_user" && (
        <Script
          id="ga4-user-id"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.__hashedUserId = "${hashedUserId}";
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
                user_id: "${hashedUserId}",
                user_properties: {
                  user_identifier: "${hashedUserId}"
                }
              });
            `,
          }}
        />
      )}
    </>
  );
};

export default GoogleAnalytics;

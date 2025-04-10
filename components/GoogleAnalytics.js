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

      {/* Base GA4 Config and photo click tracker */}
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            window.__hashedUserId = "anonymous_user";

            window.trackGAEvent = (eventName, eventParams = {}) => {
              if (window.gtag) {
                window.gtag("event", eventName, {
                  ...eventParams,
                  user_id: window.__hashedUserId
                });
              }
            };

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

      {/* Inject user_id into GA4 config once available */}
      {hashedUserId !== "anonymous_user" && (
        <Script
          id="ga4-user-id"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.__hashedUserId = "${hashedUserId}";
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
                user_id: "${hashedUserId}"
              });
            `,
          }}
        />
      )}
    </>
  );
};

export default GoogleAnalytics;

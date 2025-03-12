import Script from "next/script";

const GoogleAnalytics = () => {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

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

      {/* Initialize GA4 */}
      <Script 
        id="google-analytics-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });

            // Function to track custom events
            window.trackGAEvent = (eventName, eventParams = {}) => {
              if (window.gtag) {
                window.gtag("event", eventName, eventParams);
              }
            };
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;

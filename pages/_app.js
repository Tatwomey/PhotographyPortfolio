import { useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import Footer from "@/components/Footer";
import "@/styles/globals.css";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { ShopProvider } from "@/contexts/shopContext";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Load GA4
  useEffect(() => {
    if (!GA_TRACKING_ID) {
      console.error("GA4 Measurement ID is missing.");
      return;
    }

    // Initialize dataLayer if missing
    window.dataLayer = window.dataLayer || [];

    function gtag() {
      window.dataLayer.push(arguments);
    }

    window.gtag = gtag;

    // Load GA4 config
    gtag("js", new Date());
    gtag("config", GA_TRACKING_ID, {
      page_path: window.location.pathname,
    });

    console.log("✅ GA4 Initialized with ID:", GA_TRACKING_ID);
  }, []);

  // Track page views
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (window.gtag) {
        window.gtag("config", GA_TRACKING_ID, { page_path: url });
        console.log("📊 GA4 Page View:", url);
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  // Create a global tracking function
  useEffect(() => {
    window.trackGAEvent = (eventName, eventParams = {}) => {
      if (window.gtag) {
        window.gtag("event", eventName, eventParams);
        console.log(`📸 GA4 Event Tracked: ${eventName}`, eventParams);
      } else {
        console.warn("⚠️ GA4 is not loaded yet.");
      }
    };
  }, []);

  return (
    <ShopProvider initialCart={[]}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Google Tag Manager */}
        {GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id=${GTM_ID}';f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
        )}
      </Head>

      {/* GA4 Script - Ensures GA4 loads correctly */}
      {GA_TRACKING_ID && (
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
      )}

      {/* Lucky Orange Tracking */}
      <Script
        src="https://tools.luckyorange.com/core/lo.js?site-id=800b9eb3"
        strategy="afterInteractive"
        async
        defer
      />

      <NavigationProvider>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </NavigationProvider>

      <SpeedInsights />

      <noscript>
        {GTM_ID && (
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        )}
      </noscript>
    </ShopProvider>
  );
}

export default MyApp;

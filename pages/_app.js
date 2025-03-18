import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import Footer from "@/components/Footer";
import "@/styles/globals.css";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { ShopProvider } from "@/contexts/shopContext";
import dynamic from "next/dynamic";

const GoogleAnalytics = dynamic(() => import("@/components/GoogleAnalytics"), { ssr: false });

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

const MyApp = ({ Component, pageProps: { session, ...pageProps } }) => {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  // ✅ Initialize Google Analytics (GA4)
  useEffect(() => {
    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    if (!window.gtag) {
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };

      window.gtag("js", new Date());
      window.gtag("config", GA_ID, { send_page_view: true });

      console.log("✅ Google Analytics Initialized.");
    }

    // Inject GA script if not already added
    if (!document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);

      script.onload = () => console.log("✅ GA Script Loaded Successfully.");
    } else {
      console.log("✅ GA Script Already Present, Skipping.");
    }
  }, []);

  // ✅ Track Page Views on Route Change
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (window.gtag) {
        window.gtag("config", GA_ID, { page_path: url });
        console.log(`📊 GA Tracking Pageview: ${url}`);
      } else {
        console.warn("⚠️ GA Tracking Skipped: gtag not defined.");
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // ✅ Ensure Hydration Consistency
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null; // Avoids hydration mismatch errors

  return (
    <SessionProvider session={session}>
      <ShopProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
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

        <NavigationProvider>
          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </NavigationProvider>

        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        )}
      </ShopProvider>
    </SessionProvider>
  );
};

export default MyApp;

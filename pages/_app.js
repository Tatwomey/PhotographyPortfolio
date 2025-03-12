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

const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const initialCartData = [];

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (window.gtag) {
        window.gtag("config", GA_ID, { page_path: url });
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <ShopProvider initialCart={initialCartData}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {GA_ID && (
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){ dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
                console.log("✅ GA4 Configured!");
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

      <SpeedInsights />

      {/* Google Tag Manager (NoScript Fallback) */}
      {GTM_ID && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      )}
    </ShopProvider>
  );
}

export default MyApp;

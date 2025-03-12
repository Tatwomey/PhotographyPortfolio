import { useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import Footer from "@/components/Footer";
import "@/styles/globals.css";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { ShopProvider } from "@/contexts/shopContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";

const initialCartData = [];

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Track Page Views in GA4 on route change
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (window.gtag) {
        window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
          page_path: url,
        });
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
      </Head>

      {/* Google Analytics */}
      <GoogleAnalytics />

      {/* Google Tag Manager */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-XXXXXXX');
          `,
        }}
      />

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
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
          height="0"
          width="0"
          style="display:none;visibility:hidden"
        ></iframe>
      </noscript>
    </ShopProvider>
  );
}

export default MyApp;

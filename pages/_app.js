// pages/_app.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import dynamic from "next/dynamic";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { ShopProvider } from "/contexts/shopContext";
import "@/styles/globals.css";

const GoogleAnalytics = dynamic(() => import("@/components/GoogleAnalytics"), {
  ssr: false,
});

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const KLAVIYO_KEY = process.env.NEXT_PUBLIC_KLAVIYO_API_KEY;

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  useEffect(() => {
    const originalPush = router.push;

    router.push = (...args) => {
      console.log("🔥 ROUTER.PUSH CALLED:", args);
      return originalPush.apply(router, args);
    };
  }, []);
useEffect(() => {
const handleStart = (url) => {
console.log(
"[ROUTE CHANGE START]",
"from:", router.pathname,
"to:", url,
"\nstack:",
new Error().stack
);
};

router.events.on("routeChangeStart", handleStart);
return () => {
router.events.off("routeChangeStart", handleStart);
};
}, [router]);
  const [hydrated, setHydrated] = useState(false);

  // Klaviyo script
  useEffect(() => {
    if (!KLAVIYO_KEY) return;

    const script = document.createElement("script");
    script.src = `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${KLAVIYO_KEY}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Google Analytics base setup
  useEffect(() => {
    if (!GA_ID) return;

    if (!window.dataLayer) window.dataLayer = [];

    if (!window.gtag) {
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", GA_ID, { send_page_view: true });
    }

    if (
      !document.querySelector(
        `script[src*="googletagmanager.com/gtag/js?id=${GA_ID}"]`
      )
    ) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);
    }
  }, []);

  // GA pageview tracking on route change
  useEffect(() => {
    if (!GA_ID) return;

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

  // Hydration safety check
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Scoped light-mode toggle (for /shop, /popup, and their slugs)
  useEffect(() => {
    const lightModeRoutes = ["/shop", "/popup"];
    const isLightMode = lightModeRoutes.some((path) =>
      router.pathname.startsWith(path)
    );
    document.body.classList.toggle("light-mode", isLightMode);
  }, [router.pathname]);

  if (!hydrated) return null;

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

        {/* Optional GA component if you use it elsewhere */}
        {GA_ID && <GoogleAnalytics GA_ID={GA_ID} />}

        <NavigationProvider>
          <Navbar />
          <Component {...pageProps} />
          <Cart />
          <Footer />
        </NavigationProvider>

        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}></iframe>
          </noscript>
        )}
      </ShopProvider>
    </SessionProvider>
  );
}

export default MyApp;

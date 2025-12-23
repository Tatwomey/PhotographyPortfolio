// pages/_app.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { ShopProvider } from "/contexts/shopContext";
import "@/styles/globals.css";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const KLAVIYO_KEY = process.env.NEXT_PUBLIC_KLAVIYO_API_KEY;

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  // --- Debug router.push stack traces (optional)
  useEffect(() => {
    const originalPush = router.push;

    router.push = (...args) => {
      console.log("🔥 ROUTER.PUSH CALLED:", args);
      return originalPush.apply(router, args);
    };
    // no cleanup; restoring router.push is usually unnecessary in app lifetime
  }, []);

  // --- Debug routeChangeStart stack traces (optional)
  useEffect(() => {
    const handleStart = (url) => {
      console.log(
        "[ROUTE CHANGE START]",
        "from:",
        router.pathname,
        "to:",
        url,
        "\nstack:",
        new Error().stack
      );
    };

    router.events.on("routeChangeStart", handleStart);
    return () => {
      router.events.off("routeChangeStart", handleStart);
    };
  }, [router]);

  // --- Klaviyo script
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

  // --- GA4 base setup (gtag.js) — single source of truth
  useEffect(() => {
    if (!GA_ID) return;

    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    // Define gtag once
    if (!window.gtag) {
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
    }

    // Load gtag.js if not already present
    const existing = document.querySelector(
      `script[src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"]`
    );

    if (!existing) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);
    }

    // Initialize GA once
    // SPA best practice: disable automatic page_view and manually send on route change
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, {
      send_page_view: false,
      // optional: you can set allow_google_signals/allow_ad_personalization_signals if you want tighter privacy
      // allow_google_signals: false,
      // allow_ad_personalization_signals: false,
    });
  }, []);

  // --- Manual pageview tracking on route change (SPA best practice)
  useEffect(() => {
    if (!GA_ID) return;

    const handleRouteChange = (url) => {
      if (!window.gtag) return;

      window.gtag("event", "page_view", {
        page_path: url,
      });
    };

    // Fire once for initial load after hydration
    // (GA initializes before hydration; this ensures first page_view is sent)
    handleRouteChange(router.asPath);

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // --- Hydration safety check
  useEffect(() => {
    setHydrated(true);
  }, []);

  // --- Scoped light-mode toggle (for /shop, /popup, and their slugs)
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

          {/* GTM — keep for other tags (but do NOT also install GA4 inside GTM unless you remove gtag setup) */}
          {GTM_ID && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id=${GTM_ID}'+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
                `,
              }}
            />
          )}
        </Head>

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
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
      </ShopProvider>
    </SessionProvider>
  );
}

export default MyApp;

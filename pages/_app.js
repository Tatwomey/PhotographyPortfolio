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

import AnalyticsSessionBridge from "@/components/AnalyticsSessionBridge";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const KLAVIYO_KEY = process.env.NEXT_PUBLIC_KLAVIYO_API_KEY;

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  // Klaviyo
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

  // SPA Pageviews -> dataLayer (GTM forwards to GA4)
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.dataLayer = window.dataLayer || [];

    const pushPageView = (url) => {
      window.dataLayer.push({
        event: "page_view",
        page_path: url,
        page_location: window.location.href,
        page_title: document.title,
      });
    };

    // initial
    pushPageView(router.asPath);

    // route changes
    router.events.on("routeChangeComplete", pushPageView);
    return () => {
      router.events.off("routeChangeComplete", pushPageView);
    };
  }, [router]);

  // Hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Light mode for /shop + /popup (and their slugs)
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
      {/* user_context -> dataLayer */}
      <AnalyticsSessionBridge />

      <ShopProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          {/* GTM only */}
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

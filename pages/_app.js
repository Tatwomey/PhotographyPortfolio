// pages/_app.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import Script from "next/script";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";

import { NavigationProvider } from "@/contexts/NavigationContext";
import { ShopProvider } from "@/contexts/shopContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

import AnalyticsSessionBridge from "@/components/AnalyticsSessionBridge";

import "@/styles/globals.css";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const KLAVIYO_KEY = process.env.NEXT_PUBLIC_KLAVIYO_API_KEY;

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const [hydrated, setHydrated] =
    useState(false); /* ---------------------------------------
    KLAVIYO SCRIPT (client-only)
  ---------------------------------------- */

  useEffect(() => {
    if (!KLAVIYO_KEY) return;

    const existing = document.querySelector('script[data-klaviyo="onsite"]');
    if (existing) return;

    const script = document.createElement("script");
    script.src = `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${KLAVIYO_KEY}`;
    script.async = true;
    script.setAttribute("data-klaviyo", "onsite");
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []); /* ---------------------------------------
    SPA PAGE VIEWS -> dataLayer (GTM forwards to GA4)
  ---------------------------------------- */

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
    }; // initial

    pushPageView(router.asPath); // route changes

    router.events.on("routeChangeComplete", pushPageView);
    return () => {
      router.events.off("routeChangeComplete", pushPageView);
    };
  }, [router]); /* ---------------------------------------
    HYDRATION
  ---------------------------------------- */

  useEffect(() => {
    setHydrated(true);
  }, []); /* ---------------------------------------
    LIGHT MODE ROUTES
  ---------------------------------------- */

  useEffect(() => {
    const lightModeRoutes = ["/shop", "/popup"];
    const isLightMode = lightModeRoutes.some((path) =>
      router.pathname.startsWith(path),
    );
    document.body.classList.toggle("light-mode", isLightMode);
  }, [router.pathname]);

  if (!hydrated) return null;

  return (
    <SessionProvider session={session}>
            {/* user_context -> dataLayer */}
            
      <AnalyticsSessionBridge />
            {/* ✅ GTM: use next/script (fixes the warning you saw) */}
            
      {GTM_ID && (
        <>
                    
          <Script
            id="gtm-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
`,
            }}
          />
                    
          <Script
            id="gtm-loader"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
          />
                  
        </>
      )}
            
      <CurrencyProvider>
                
        <ShopProvider>
                    
          <Head>
                        
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
                      
          </Head>
                    
          <NavigationProvider>
                        
            <Navbar />
                        
            <Component {...pageProps} />
                        {/* Global Cart Drawer (controlled by context) */}
                        
            <Cart />
                        
            <Footer />
                      
          </NavigationProvider>
                    {/* GTM noscript fallback */}
                    
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
              
      </CurrencyProvider>
          
    </SessionProvider>
  );
}

export default MyApp;

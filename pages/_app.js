import React from 'react';
import Navbar from '@/components/Navbar';
import Head from 'next/head';
import Footer from '@/components/Footer';
import "@/styles/globals.css";
import { NavigationProvider } from '@/contexts/NavigationContext';
import { ShopProvider } from '@/contexts/shopContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import Script from 'next/script';
import { SpeedInsights } from "@vercel/speed-insights/next";

const initialCartData = [];

function MyApp({ Component, pageProps }) {
  return (
    <ShopProvider initialCart={initialCartData}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Google Analytics Script */}
      <GoogleAnalytics />

      <Script id="gtm-script" strategy="afterInteractive">
        {/* GTM script here */}
      </Script>

      {/* Add Lucky Orange Tracking Script */}
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
        {/* GTM noscript content */}
      </noscript>
    </ShopProvider>
  );
}

export default MyApp;

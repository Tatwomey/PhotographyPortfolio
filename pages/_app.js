import React from 'react';
import Navbar from '@/components/Navbar';
import Head from "next/head";
import Footer from '@/components/Footer';
import "@/styles/globals.css";
import { NavigationProvider } from '../contexts/NavigationContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        <Script
          strategy="afterInteractive"
        >
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-M3ZGLXGX');
          `}
        </Script>
      </Head>

      {/* This is the noscript tag for GTM, but Next.js doesn't handle noscript tags in the JSX */}
      {/* You might need another way to handle this, or just skip this part if you're okay with not supporting users with JavaScript disabled */}

      <NavigationProvider>
        <Navbar />
        <GoogleAnalytics/>
        <Component {...pageProps} />
        <Footer />
      </NavigationProvider>
    </>
  );
}

import React from 'react';
import Navbar from '@/components/Navbar';
import Head from "next/head";
import Footer from '@/components/Footer';
import "@/styles/globals.css";
import { NavigationProvider } from '../contexts/NavigationContext';
import { CartProvider } from '@/contexts/CartContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  return (
    <CartProvider> {/* Wrap the application with CartProvider */}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Google Tag Manager scripts */}
      <Script id="gtm-script" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){
            w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-M3ZGLXGX');
        `}
      </Script>

      <NavigationProvider>
        {/* The Navbar can access the context values directly without props */}
        <Navbar />
        <GoogleAnalytics/>
        <Component {...pageProps} />
        <Footer />
      </NavigationProvider>

      {/* Google Tag Manager noscript */}
      <noscript>
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M3ZGLXGX" height="0" width="0" style={{display: 'none', visibility: 'hidden'}}></iframe>
      </noscript>
    </CartProvider> 
  );
}

import React from 'react';
import Navbar from '@/components/Navbar';
import Head from "next/head";
import Footer from '@/components/Footer';
import "@/styles/globals.css";
import { NavigationProvider } from '../contexts/NavigationContext';
import Script from 'next/script';



export default function App({ Component, pageProps }) {

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <NavigationProvider>
        {/* The Navbar can access the context values directly without props */}
        <Navbar />
      <Script strategy="afterinteractive" 
      src="https://www.googletagmanager.com/gtag/js?id=G-H3MT6ZKKN4"/>

      <Script id="google-analytics" strategy="afterInteractive">

        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-H3MT6ZKKN4');
          `}
      </Script>
        <Component {...pageProps} />
        <Footer />
      </NavigationProvider>
    </>
  );
}

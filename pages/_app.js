import React from 'react';
import Navbar from '@/components/Navbar';
import Head from "next/head";
import Footer from '@/components/Footer';
import "@/styles/globals.css";
import { NavigationProvider } from '../contexts/NavigationContext';



export default function App({ Component, pageProps }) {

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <NavigationProvider>
        {/* The Navbar can access the context values directly without props */}
        <Navbar />
      
        <Component {...pageProps} />
        <Footer />
      </NavigationProvider>
    </>
  );
}

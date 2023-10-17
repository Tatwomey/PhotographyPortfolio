import React, { useState } from 'react';
import Navbar from "./components/Navbar";
import Head from "next/head";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const [showAbout, setShowAbout] = useState(false); // Define state here

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Pass down the props to Navbar */}
      <Navbar showAbout={showAbout} setShowAbout={setShowAbout} />

      {/* Pass down the showAbout state to the pages */}
      <Component {...pageProps} showAbout={showAbout} setShowAbout={setShowAbout} />
    </>
  );
}
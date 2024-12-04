import React from "react";
import Meta from "@/components/Meta";
import Hero from "@/components/Hero";
import Portfolio from "./Portfolio";
import Head from "next/head";

function Music() {
  return (
    <>
      <Head>
        <meta name="creator" content="Trevor Twomey" />
        <meta name="copyright" content="© Trevor Twomey" />
        <meta name="description" content="Explore the dynamic portfolio of music and concert photography by Trevor Twomey." />
        <meta name="rights" content="All Rights Reserved" />
        <link rel="license" href="https://www.trevortwomeyphoto.com/licensing" />
        <title>Music Photographer - Trevor Twomey</title>
      </Head>
      <Meta
        title="Music Photographer - Trevor Twomey"
        description="Explore the dynamic portfolio of music and concert photography by Trevor Twomey."
        keywords="music photography, music photographer, New York based music photographer,  NYC music photographer, tour photographer, concert photographer, concert photography, live music photographer, band photos, rock photographer, live band photography, live music performances, Korn, Evanescence, ††† (Crosses), Thievery Corporation, Sevendust, IAMX, Nonpoint, Kings Bounty Band, Korn concert photos, Ray Luzier, Jonathan Davis, James 'Munky' Shaffer, Fieldy, Reggie Arvizu, Brian 'Head' Welch"

      />
      <Hero />
      <Portfolio />
    </>
  );
}

export default Music;

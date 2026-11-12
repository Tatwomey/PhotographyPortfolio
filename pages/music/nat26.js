import React, { useEffect } from "react";
import Head from "next/head";
import { getToken } from "next-auth/jwt";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";

const photos = [
  { src: "/nat26/nat.jpg", type: "portrait" },
  { src: "/nat26/960A4017.jpg", type: "portrait" },
  { src: "/nat26/960A4040.jpg", type: "portrait" },
  { src: "/nat26/960A4044-Edit.jpg", type: "portrait" },
  { src: "/nat26/960A4069.jpg", type: "portrait" },
  { src: "/nat26/960A4077-2.jpg", type: "portrait" },
  { src: "/nat26/960A4082-2.jpg", type: "portrait" },
  { src: "/nat26/960A4099.jpg", type: "portrait" },
  { src: "/nat26/960A4119-Edit.jpg", type: "portrait" },
  { src: "/nat26/960A4135.jpg", type: "portrait" },
  { src: "/nat26/960A4141.jpg", type: "portrait" },
  { src: "/nat26/960A4151.jpg", type: "portrait" },
  { src: "/nat26/natglitch.jpg", type: "portrait" },
];

export async function getServerSideProps({ req, res }) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");

  const token = process.env.NEXTAUTH_SECRET
    ? await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      })
    : null;

  if (!token?.allowedPages?.includes("/music/nat26")) {
    return {
      redirect: {
        destination: "/login?callbackUrl=%2Fmusic%2Fnat26",
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default function NataliaClavierGallery() {
  useEffect(() => {
    const timer = setTimeout(() => {
      document
        .getElementById("nat26-photos")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Natalia Clavier | Trevor Twomey Photography</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
      </Head>

      <Hero
        heading="Natalia Clavier"
        message="Lightning Society | Selected Photographs"
      />

      <Portfolio photos={photos} sectionId="nat26-photos" />
    </>
  );
}

import React from "react";
import Head from "next/head";
import Link from "next/link";

const Licensing = () => {
  return (
    <>
      <Head>
        <title>Licensing | Trevor Twomey Photography</title>
        <meta
          name="description"
          content="Licensing information for Trevor Twomey Photography. All images are copyrighted. Contact for licensing inquiries."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div style={styles.container}>
        <h1 style={styles.heading}>Licensing Page Coming January 2025</h1>
        <p style={styles.text}>
          Thank you for your interest in licensing images from Trevor Twomey Photography. This page is currently under construction.
        </p>
        <p style={styles.text}>
          For immediate inquiries, please email{" "}
          <a href="mailto:info@trevortwomeyphoto.com" style={styles.link}>
            info@trevortwomeyphoto.com
          </a>.
        </p>
        <Link href="/" passHref>
          <span style={styles.button}>Return to Homepage</span>
        </Link>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    textAlign: "center",
    backgroundColor: "#f4f4f4",
    color: "#333",
    padding: "0 20px",
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },
  text: {
    fontSize: "1.2rem",
    marginBottom: "1.5rem",
  },
  link: {
    color: "#0070f3",
    textDecoration: "underline",
  },
  button: {
    display: "inline-block",
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#333",
    textDecoration: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
    cursor: "pointer",
  },
};

export default Licensing;

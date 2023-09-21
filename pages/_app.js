import Navbar from "./components/Navbar";
import Head from "next/head";  // Import the Head component
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}

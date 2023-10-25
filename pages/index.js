import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/music#music-photography');
  }, [router]);

  return (
    <div>
      <Head>
        <title>Trevor Twomey Photography</title>
        <meta name="Trevor Twomey Photography" content="Trevor Twomey Photography" />
      </Head>
      <div>Redirecting...</div>
    </div>
  );
}

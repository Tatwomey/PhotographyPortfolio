import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Meta from '@/components/Meta';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/music#music-photography');
  }, [router]);

  return (
    <div>
      <Meta title="Trevor Twomey Photography" description="Trevor Twomey's portfolio of music and concert photography capturing the energy and passion of live performances." />
      <div>Redirecting...</div>
    </div>
  );
}

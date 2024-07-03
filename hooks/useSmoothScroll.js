import { useEffect } from 'react';
import { useRouter } from 'next/router'; 

export const useSmoothScroll = (hash, ref) => {
  const router = useRouter();

  const scrollToRef = () => {
    if (window.location.hash === hash && ref.current) {
      const element = ref.current;
      const topPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scroll({
        top: topPosition,
        behavior: 'smooth'
      });
    }
  }

  useEffect(() => {
    scrollToRef();
    router.events.on('hashChangeComplete', scrollToRef);  // Add listener for hash changes

    return () => {
      router.events.off('hashChangeComplete', scrollToRef);  // Clean up listener on unmount
    };
  }, [hash, ref, router.events]);
};

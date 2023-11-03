import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';

const GoogleAnalytics = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (window.gtag) {
        window.gtag('config', 'G-H3MT6ZKKN4', {
          page_path: url,
        });
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-H3MT6ZKKN4" strategy="afterInteractive" />
      <Script strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-H3MT6ZKKN4');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;

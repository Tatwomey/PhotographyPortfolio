import Script from 'next/script';

const GoogleAnalytics = () => {
    return (
        <>
            <Script 
                strategy="afterInteractive"
                src="https://www.googletagmanager.com/gtag/js?id=G-H3MT6ZKKN4"
            />

            <Script 
                id="google-analytics-script"  // Added ID attribute here
                strategy="afterInteractive"
            >
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-H3MT6ZKKN4');
                `}
            </Script>
        </>
    );
}

export default GoogleAnalytics;

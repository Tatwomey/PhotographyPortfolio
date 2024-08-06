import Script from 'next/script';

const GoogleAnalytics = () => {
    const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

    return (
        <>
            <Script 
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />

            <Script 
                id="google-analytics-script"
                strategy="afterInteractive"
            >
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}');
                `}
            </Script>
        </>
    );
}

export default GoogleAnalytics;

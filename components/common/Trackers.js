import Head from 'next/head';
import React from 'react';

const Trackers = ({ google, facebook }) => {
    return (
        <Head>

            {google && (
                // Google Tag Manager
                <script
                    async
                    src={`https://www.googletagmanager.com/gtag/js?id=${google}`}
                />
            )}

            {google && (
                // Google Analytics
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${google}', {
                            page_path: window.location.pathname,
                            });
                        `
                    }}
                />
            )}

            {facebook && (
                // Facebook Pixel
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '${facebook}');
                        fbq('track', 'PageView');
                    `
                    }}
                />
            )}

            {facebook && (
                // Facebook Pixel No Script
                <noscript>
                    <img
                        height="1"
                        width="1"
                        style={{ display: "none" }}
                        src={`https://www.facebook.com/tr?id=${facebook}&ev=PageView&noscript=1}`}
                    />
                </noscript>
            )}

        </Head>
    );
};

export default Trackers;
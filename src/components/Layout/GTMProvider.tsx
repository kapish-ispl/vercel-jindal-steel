"use client";

import Script from "next/script";

const GTM_ID = "GTM-NN298K4N";

export { GTM_ID };

export default function GTMProvider() {
    return (
        <Script id="google-consent-defaults" strategy="beforeInteractive">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                window.gtag = gtag;

                gtag('consent', 'default', {
                    analytics_storage: 'denied',
                    ad_storage: 'denied',
                    ad_user_data: 'denied',
                    ad_personalization: 'denied',
                    functionality_storage: 'denied',
                    personalization_storage: 'denied',
                    security_storage: 'granted'
                });
            `}
        </Script>
    );
}
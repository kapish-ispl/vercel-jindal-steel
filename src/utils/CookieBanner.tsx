"use client";

import { useState, useEffect } from "react";
import { GTM_ID } from "@/components/Layout/GTMProvider";

interface CookieBannerProps {
    onAccept?: () => void;
    onReject?: () => void;
    companyName?: string;
    policyLink?: string;
    privacyLink?: string;
    currentPathname?: string;
    excludedPaths?: string[];
}

// Injects the GTM <script> and <noscript> tags into the document
function loadGTM() {
    // Avoid injecting twice
    if (document.getElementById("gtm-script")) return;

    // GTM script tag → <head>
    const script = document.createElement("script");
    script.id = "gtm-script";
    script.innerHTML = `
        (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),
                dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
    `;
    document.head.appendChild(script);

    // GTM noscript tag → top of <body>
    if (!document.getElementById("gtm-noscript")) {
        const noscript = document.createElement("noscript");
        noscript.id = "gtm-noscript";
        noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
        document.body.insertBefore(noscript, document.body.firstChild);
    }
}

const CookieBanner = ({
    onAccept,
    onReject,
    companyName = "Jindal Steel",
    policyLink = "/cookie-policy",
    privacyLink = "/privacy-notice",
    currentPathname = "",
    excludedPaths = [],
}: CookieBannerProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie_consent");
        const isExcluded = excludedPaths.includes(currentPathname);

        if (consent === "accepted") {
            // User already accepted — load GTM immediately and update consent
            loadGTM();
            window.gtag?.("consent", "update", {
                analytics_storage: "granted",
                ad_storage: "granted",
                ad_user_data: "granted",
                ad_personalization: "granted",
                functionality_storage: "granted",
                personalization_storage: "granted",
                security_storage: "granted",
            });
        } else if (!consent && !isExcluded) {
            // No choice yet — show the banner
            setIsVisible(true);
        }
        // If rejected, do nothing — GTM stays unloaded
    }, [currentPathname, excludedPaths]);

    const handleAccept = () => {
        localStorage.setItem("cookie_consent", "accepted");
        loadGTM();
        window.gtag?.("consent", "update", {
            analytics_storage: "granted",
            ad_storage: "granted",
            ad_user_data: "granted",
            ad_personalization: "granted",
            functionality_storage: "granted",
            personalization_storage: "granted",
            security_storage: "granted",
        });
        setIsVisible(false);
        onAccept?.();
    };

    const handleReject = () => {
        localStorage.setItem("cookie_consent", "rejected");
        // GTM never loads — nothing to update
        setIsVisible(false);
        onReject?.();
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Dark Overlay Background */}
            <div className="cookie-overlay-backdrop"></div>

            {/* Banner Content */}
            <div className="cookie-banner-wrapper fixed-bottom bg-white py-3">
                <div className="container cus-container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-12">
                            <div className="d-flex flex-column flex-md-row align-items-center justify-content-between text-center text-md-start">
                                <p className="cookie-text mb-3 mb-md-0 me-md-4">
                                    {companyName} uses cookies to enhance your
                                    browsing experience, analyze site traffic,
                                    and assist in our marketing efforts.

                                    By clicking{" "}
                                    <strong>Accept</strong>,{" "}
                                    you agree to our use of cookies in
                                    accordance with our{" "}
                                    <a href={policyLink}>Cookie Policy</a>.

                                    <br />

                                    For detailed information on how we handle
                                    your personal data, please refer to our{" "}
                                    <a href={privacyLink}>Privacy Notice</a>.
                                </p>

                                <div className="cookie-buttons d-flex gap-2">
                                    <button
                                        onClick={handleAccept}
                                        className="btn btn-accept text-white text-nowrap"
                                    >
                                        Accept All
                                    </button>

                                    <button
                                        onClick={handleReject}
                                        className="btn btn-reject text-white text-nowrap"
                                    >
                                        Reject All
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CookieBanner;
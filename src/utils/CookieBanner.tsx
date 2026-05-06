"use client";
import { useState, useEffect } from "react";

interface CookieBannerProps {
    onAccept?: () => void;
    onReject?: () => void;
    companyName?: string;
    policyLink?: string;
    privacyLink?: string;
    currentPathname?: string;
    excludedPaths?: string[];
}

const CookieBanner = ({
    onAccept,
    onReject,
    companyName = "Jindal Steel",
    policyLink = "/cookie-policy.html",
    privacyLink = "/privacy-policy.html",
    currentPathname = "",
    excludedPaths = [],
}: CookieBannerProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie_consent");
        const isExcluded = excludedPaths.includes(currentPathname);
        if (!consent && !isExcluded) {
            setIsVisible(true);
        }
    }, [currentPathname, excludedPaths]);

    const handleChoice = (choice: "accepted" | "rejected") => {
        localStorage.setItem("cookie_consent", choice);
        setIsVisible(false);
        choice === "accepted" ? onAccept?.() : onReject?.();
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
                                    {companyName} uses cookies to enhance your browsing experience, analyze site traffic, and assist in our marketing efforts. By clicking &quot;Accept,&quot; you agree to our use of cookies in accordance with our <a href={policyLink}>Cookie Policy</a>.
                                    <br />
                                    For detailed information on how we handle your personal data, please refer to our <a href={privacyLink}>Privacy Notice</a>
                                </p>
                                <div className="cookie-buttons d-flex gap-2">
                                    <button
                                        onClick={() => handleChoice("accepted")}
                                        className="btn btn-accept text-white text-nowrap"
                                    >
                                        Accept All
                                    </button>
                                    <button
                                        onClick={() => handleChoice("rejected")}
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
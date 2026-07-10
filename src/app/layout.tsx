import { Suspense } from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { ThemeProvider } from "@/components/Layout/ThemeProvider";
import AppContextProvider from "@/context/AppContext";
import { getMenuData } from "@/lib/getMenuData";

import "@/styles/globals.scss";

import "aos/dist/aos.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import SmoothScrollProvider from "@/components/Layout/SmoothScrollProvider";
import Script from "next/script";

import { Toaster } from "react-hot-toast";
import { AccessibilityProvider, AccessibilityWidget } from "@/modules/accessibility";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const metaImage = "https://www.jindalsteel.com/images/logo/meta.jpg";
const siteUrl = "https://www.jindalsteel.com/";

export const metadata: Metadata = {
  // title: {
  //   default: "Jindal Steel",
  //   template: "%s",
  // },
  // description:
  //   "Jindal Steel is a leading Indian steel company, known for its innovative solutions and commitment to sustainability.",
  // keywords:
  //   "Jindal Steel, Steel Manufacturing, Sustainable Steel, Indian Steel Industry, Steel Products, Power Generation, Infrastructure Development",
  metadataBase: new URL(siteUrl),


  verification: {
    google: "hxhEUPw_d8ReQZZdxoh0GAITxHwayUb6BggozmZGM7U",
  },
  openGraph: {
    url: siteUrl,
    siteName: "Jindal Steel",
    type: "website",
    images: [
      {
        url: metaImage,
        width: 800,
        height: 600,
        alt: "Jindal Steel",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@JindalSteel_In",
    images: [metaImage],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { headerMenu, footerMenu, productData } = await getMenuData();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="google-consent-defaults" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            window.gtag = gtag;

            var consentState = 'denied';
            if (typeof document !== 'undefined' && document.cookie.indexOf('cookie_consent=accepted') > -1) {
                consentState = 'granted';
            }

            gtag('consent', 'default', {
                analytics_storage: consentState,
                ad_storage: consentState,
                ad_user_data: consentState,
                ad_personalization: consentState,
                functionality_storage: consentState,
                personalization_storage: consentState,
                security_storage: 'granted'
            });

            if (consentState === 'granted') {
                // Load GTM
                (function(w,d,s,l,i){
                    w[l]=w[l]||[];
                    w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                    var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),
                        dl=l!='dataLayer'?'&l='+l:'';
                    j.async=true;
                    j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                    j.id='gtm-script';
                    f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-NN298K4N');

                // Load GA
                var gaIds = ["G-MF2JPYQ6CN", "G-RCBN2HFSL7"];
                gaIds.forEach(function(gaId) {
                    var scriptId = 'ga-script-' + gaId;
                    var loaderScript = document.createElement("script");
                    loaderScript.id = scriptId;
                    loaderScript.async = true;
                    loaderScript.src = "https://www.googletagmanager.com/gtag/js?id=" + gaId;
                    document.head.appendChild(loaderScript);

                    var initScript = document.createElement("script");
                    initScript.id = scriptId + "-init";
                    initScript.innerHTML = "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} window.gtag = gtag; gtag('js', new Date()); gtag('config', '" + gaId + "');";
                    document.head.appendChild(initScript);
                });
            }
          `}
        </Script>
      </head>

      <body className={`${poppins.variable}`}>
        <Toaster position="top-center" reverseOrder={false} />

        <Suspense fallback={null}>
          <AccessibilityProvider>
            <AppContextProvider
              initialHeaderMenu={headerMenu}
              initialFooterMenu={footerMenu}
              initialProductData={productData}
            >
              <SmoothScrollProvider>
                <Header />

                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <main>{children}</main>

                  <Footer />
                </ThemeProvider>

                <AccessibilityWidget />
              </SmoothScrollProvider>
            </AppContextProvider>
          </AccessibilityProvider>
        </Suspense>
      </body>
    </html>
  );
}
// "use client";

// import Image from "next/image";
// import { FC } from "react";
// import Slider from "react-slick";

// interface BannerMedia {
//     type: string;
//     cdnPath: string;
// }

// interface Props {
//     bannerMedia: BannerMedia[];
//     tagline: string;
//     pageTitle: string;
// }
// const HomeBanner: FC<Props> = ({ bannerMedia, tagline, pageTitle }) => {
//     const settings = {
//         dots: false,
//         arrows: true,
//         infinite: true,
//         fade: true,
//         speed: 500,
//         autoplay: true,
//         autoplaySpeed: 4000,
//         slidesToShow: 1,
//         slidesToScroll: 1,
//     };

//     return (
//         <>
//             {bannerMedia && bannerMedia.length > 0 &&
//                 <div className="c-banner__wrapper">
//                     <div className="c-banner__wrapper__item_desktop slider__arrow">
//                         <Slider {...settings} >
//                             {bannerMedia.map((data: BannerMedia, index: number) => {
//                                 return (
//                                     data.type === "video" ? (
//                                         <video key={data.cdnPath} loop={true} muted={true} autoPlay={true} playsInline={true} className={`c-banner__item_desktop`}>
//                                             <source src={data.cdnPath} type="video/mp4" />
//                                         </video>
//                                     ) : (
//                                         <>
//                                             <Image
//                                                 key={index}
//                                                 src={data.cdnPath}
//                                                 alt="industry"
//                                                 width={1920}
//                                                 height={1080}
//                                                 className={`c-banner__item_desktop img-fluid`}
//                                                 style={{
//                                                     objectFit: "cover",
//                                                     objectPosition: "center",
//                                                 }}
//                                             />

//                                         </>
//                                     )
//                                 )
//                             }

//                             )}
//                         </Slider>
//                     </div>
//                     <div className="container cus-container">
//                         <div className="row">
//                             <div className="col-12">
//                                 <h1 className="banner__title">
//                                     {tagline != undefined ?
//                                         <div
//                                             dangerouslySetInnerHTML={{ __html: tagline }}
//                                         />
//                                         :
//                                         pageTitle
//                                     }
//                                 </h1>
//                             </div>
//                         </div>
//                     </div>

//                 </div>
//             }
//         </>
//     )
// }

// export default HomeBanner;


"use client";

import Image from "next/image";
import { FC, ReactNode } from "react";
import Slider from "react-slick";

interface BannerMedia {
    type: string;
    cdnPath: string;
    caption: string;
    deviceType: string;
}

interface Props {
    bannerMedia: BannerMedia[];
    tagline: string;
    pageTitle: string;
}

/**
 * MediaItem handles the conditional rendering of a video or image.
 * It also encapsulates common styling and ensures valid paths.
 */
const MediaItem: FC<{ data: BannerMedia }> = ({ data }) => {
    if (!data.cdnPath) return null;

    if (data.type === "video") {
        return (
            <video loop muted autoPlay playsInline className="c-banner__item_desktop" style={{minHeight: '600px'}}>
                <source src={data.cdnPath} type="video/mp4" />
            </video>
        );
    }

    return (
        <Image
            src={data.cdnPath}
            alt="banner"
            width={1920}
            height={1080}
            className="c-banner__item_desktop img-fluid"
            style={{ objectFit: "cover", objectPosition: "center" }}
        />
    );
};

/**
 * BannerSliderSection encapsulates a Slider with its device-specific visibility classes.
 */
const BannerSliderSection: FC<{
    media: BannerMedia[];
    visibilityClass: string;
    settings: any;
}> = ({ media, visibilityClass, settings }) => {
    // Filter by presence of cdnPath to avoid "undefined" URL issues
    const validMedia = media.filter((m) => m.cdnPath);
    if (validMedia.length === 0) return null;

    return (
        <div className={visibilityClass}>
            <Slider {...settings}>
                {validMedia.map((item, idx) => (
                    <MediaItem key={`${item.cdnPath}-${idx}`} data={item} />
                ))}
            </Slider>
        </div>
    );
};


const HomeBanner: FC<Props> = ({ bannerMedia, tagline, pageTitle }) => {
    const sliderSettings = {
        dots: false,
        arrows: true,
        infinite: true,
        fade: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 4000,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    if (!bannerMedia?.length) return null;


    const desktopMedia =
        bannerMedia.filter((m) => m.deviceType === "desktop");

    const mobileMedia =
        bannerMedia.filter((m) => m.deviceType === "mobile");

    const tabletMedia =
        bannerMedia.filter((m) => m.deviceType === "tablet");

    // Fallback Logic
    const finalDesktopMedia =
        desktopMedia.length > 0 ? desktopMedia : bannerMedia;

    const finalMobileMedia =
        mobileMedia.length > 0 ? mobileMedia : finalDesktopMedia;

    const finalTabletMedia =
        tabletMedia.length > 0 ? tabletMedia : finalMobileMedia;

    return (
        <div className="c-banner">
            <div className="c-banner__media">
                {/* Desktop Version: Only shows media with 'desktop' caption */}
                <BannerSliderSection
                    media={finalDesktopMedia}
                    visibilityClass="d-none d-lg-block "
                    settings={sliderSettings}
                />

                <BannerSliderSection
                    media={finalTabletMedia}
                    visibilityClass="d-none d-lg-none d-md-block"
                    settings={sliderSettings}
                />

                <BannerSliderSection
                    media={finalMobileMedia}
                    visibilityClass="d-lg-none"
                    settings={sliderSettings}
                />
            </div>

            <div className="c-banner__content">
                <div className="container cus-container">
                    <div className="row">
                        <div className="col-12">
                            <div className="c-banner__content_box">
                                <h1 className="banner__title">
                                    {tagline ? (
                                        <div dangerouslySetInnerHTML={{ __html: tagline }} />
                                    ) : (
                                        pageTitle
                                    )}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeBanner;

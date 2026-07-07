"use client";

import Image from "next/image";
import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from "swiper/modules";
import { useDeviceType } from "@/hooks/useDeviceType";

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

const MediaItem: FC<{ data: BannerMedia; isActive?: boolean }> = ({ data, isActive = true }) => {
    if (!data.cdnPath) return null;

    if (data.type === "video") {
        return (
            <video
                loop
                muted
                autoPlay
                playsInline
                preload={isActive ? "auto" : "none"}
                className="c-banner__item_desktop"
                style={{ minHeight: "600px" }}
            >
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

const BannerSliderSection: FC<{ media: BannerMedia[] }> = ({ media }) => {
    const validMedia = media.filter((m) => m.cdnPath);
    if (validMedia.length === 0) return null;

    return (
        <Swiper
            modules={[Autoplay, Navigation, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            slidesPerView={1}
            loop={validMedia.length > 1}
            autoplay={
                validMedia.length > 1
                    ? { delay: 4000, disableOnInteraction: false }
                    : false
            }
            navigation={validMedia.length > 1}
            speed={500}
            className="banner-swiper"
        >
            {validMedia.map((item, idx) => (
                <SwiperSlide key={`${item.cdnPath}-${idx}`}>
                    {/* Only the first slide is immediately visible; rest defer preload */}
                    <MediaItem data={item} isActive={idx === 0} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

// ---------------------------------------------------------------------------
// HomeBanner – mounts only the slider for the active breakpoint
// ---------------------------------------------------------------------------

const HomeBanner: FC<Props> = ({ bannerMedia, tagline, pageTitle }) => {
    const breakpoint = useDeviceType();

    if (!bannerMedia?.length) return null;

    const desktopMedia = bannerMedia.filter((m) => m.deviceType === "desktop");
    const mobileMedia = bannerMedia.filter((m) => m.deviceType === "mobile");
    const tabletMedia = bannerMedia.filter((m) => m.deviceType === "tablet");

    // Fallback: if a bucket is empty, cascade from a larger breakpoint
    const finalDesktopMedia = desktopMedia.length > 0 ? desktopMedia : bannerMedia;
    const finalMobileMedia = mobileMedia.length > 0 ? mobileMedia : finalDesktopMedia;
    const finalTabletMedia = tabletMedia.length > 0 ? tabletMedia : finalMobileMedia;

    const activeMedia =
        breakpoint === "desktop"
            ? finalDesktopMedia
            : breakpoint === "tablet"
                ? finalTabletMedia
                : finalMobileMedia;

    return (
        <div className="c-banner">
            <div className="c-banner__media">
                {/* Only the breakpoint-appropriate slider is in the DOM */}
                <BannerSliderSection key={breakpoint} media={activeMedia} />
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

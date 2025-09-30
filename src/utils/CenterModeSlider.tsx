"use client";
import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

interface MediaItem {
    cdnPath: string;
}

interface PostItem {
    title: string;
    content: string;
    media: MediaItem[];
}

interface CenterModeSliderProps {
    postData: PostItem[];
}

const CenterModeSlider: React.FC<CenterModeSliderProps> = ({ postData }) => {
    const prevRef = useRef<HTMLDivElement | null>(null);
    const nextRef = useRef<HTMLDivElement | null>(null);
    const [navDisabled, setNavDisabled] = useState(false);
    const swiperRef = useRef<SwiperType | null>(null);

    // Fallback if only one item
    if (postData.length <= 1) {
        return (
            <div className="row">
                {postData.map((info, idx) => (
                    <div className="col-12" key={idx}>
                        <div className="slider_wrapper">
                            <h5>{info.title}</h5>
                            <div className="ratio ratio-4x3">
                                <img
                                    alt={info.title}
                                    className="img-fluid u-img"
                                    src={info.media[0]?.cdnPath ?? ""}
                                />
                            </div>
                            <p>{info.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const checkNavigation = (swiper: SwiperType) => {
        const isDisabled = swiper.params.navigation
            ? !(swiper.params.navigation as any).enabled
            : false;
        setNavDisabled(isDisabled);
    };

    return (
        <div
            className={`slider-wrapper centermode-slider position-relative ${navDisabled ? "nav-disabled" : ""}`}
        >
            {/* Custom Arrows */}
            <div ref={prevRef} className="custom-arrow prev cursor-pointer">
                <svg width="45" height="28" viewBox="0 0 45 28" fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M15.7916 27.4435C15.0277 28.1857 13.789 28.1853 13.0249 27.4435L0.573056 15.3442C-0.191016 14.6017 -0.191016 13.3983 0.573057 12.6558L13.0249 0.556541C13.789 -0.185334 15.0277 -0.18571 15.7916 0.556541C16.5554 1.29879 16.5551 2.50238 15.7916 3.24486L6.67957 12.0989L45 12.0989L45 15.9011L6.67957 15.9011L15.7916 24.7551C16.5551 25.4976 16.5554 26.7012 15.7916 27.4435Z" fill="#446183" /> </svg>
            </div>

            <div ref={nextRef} className="custom-arrow next cursor-pointer">
                <svg width="45" height="28" viewBox="0 0 45 28" fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M15.7916 27.4435C15.0277 28.1857 13.789 28.1853 13.0249 27.4435L0.573056 15.3442C-0.191016 14.6017 -0.191016 13.3983 0.573057 12.6558L13.0249 0.556541C13.789 -0.185334 15.0277 -0.18571 15.7916 0.556541C16.5554 1.29879 16.5551 2.50238 15.7916 3.24486L6.67957 12.0989L45 12.0989L45 15.9011L6.67957 15.9011L15.7916 24.7551C16.5551 25.4976 16.5554 26.7012 15.7916 27.4435Z" fill="#446183" /> </svg>
            </div>

            <Swiper
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView={3}
                centeredSlides
                loop
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    checkNavigation(swiper);
                }}
                onResize={() => {
                    if (swiperRef.current) checkNavigation(swiperRef.current);
                }}
                navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper: SwiperType) => {
                    if (
                        typeof swiper.params.navigation !== "boolean" &&
                        swiper.params.navigation
                    ) {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                    }
                }}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                        centeredSlides: true,
                        navigation: { enabled: false },
                    },
                    768: {
                        slidesPerView: 3,
                        navigation: { enabled: true },
                    },
                }}
                className="centermode-slider"
            >
                {postData.map((item, index) => (
                    <SwiperSlide key={index}>
                        <div className="slide-item">
                            <div className="slider_wrapper">
                                <h5>{item.title}</h5>
                                <div className="ratio ratio-4x3">
                                    <img
                                        alt={item.title}
                                        className="img-fluid u-img"
                                        src={item.media[0]?.cdnPath ?? ""}
                                    />
                                </div>
                                <p>{item.content}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CenterModeSlider;

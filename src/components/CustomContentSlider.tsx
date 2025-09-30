"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ModularSliderProps {
    data: any; // Array of React elements or objects with props
    itemstoshow?: number | string;
    showdots?: "yes" | "no";
    centermode?: "yes" | "no";
    showarrow?: "yes" | "no";
    autoplay?: "yes" | "no";
}

const ModularSlider: React.FC<ModularSliderProps> = ({
    data,
    itemstoshow = 3,
    showdots = "yes",
    centermode = "no",
    showarrow = "yes",
    autoplay = "no",
}) => {
    const finalData = data.filter((item: any) => item.props !== undefined);
    const slidesToShow = Number(itemstoshow);
    const isCenterMode = centermode === "yes";
    const enableArrows = showarrow === "yes" && finalData.length > slidesToShow;
    const enablePagination = showdots === "yes" && finalData.length > slidesToShow;
    const enableLoop = finalData.length > slidesToShow;
    const enableAutoplay = autoplay === "yes" && enableLoop;

    const prevRef = useRef<HTMLDivElement | null>(null);
    const nextRef = useRef<HTMLDivElement | null>(null);
    const swiperRef = useRef<SwiperType | null>(null);
    const [navDisabled, setNavDisabled] = useState(!enableArrows);

    if (finalData.length === 0) return null;

    // Single item fallback
    if (finalData.length === 1) {
        return (
            <div className="row">
                {finalData.map((item: any, idx: number) => (
                    <div className="col-12" key={idx}>
                        <div className={item.props.className || "slider_wrapper"}>
                            {item.props.children}
                        </div>
                    </div>
                ))}
            </div>
        );
    }


    return (
        <div
            className={`slider-wrapper centermode-slider position-relative ${navDisabled ? "nav-disabled" : ""}`}>
            {/* Custom Arrows */}
            {enableArrows && (
                <>
                    <div ref={prevRef} className="custom-arrow prev cursor-pointer">
                        <svg
                            width="45"
                            height="28"
                            viewBox="0 0 45 28"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M15.7916 27.4435C15.0277 28.1857 13.789 28.1853 13.0249 27.4435L0.573056 15.3442C-0.191016 14.6017 -0.191016 13.3983 0.573057 12.6558L13.0249 0.556541C13.789 -0.185334 15.0277 -0.18571 15.7916 0.556541C16.5554 1.29879 16.5551 2.50238 15.7916 3.24486L6.67957 12.0989L45 12.0989L45 15.9011L6.67957 15.9011L15.7916 24.7551C16.5551 25.4976 16.5554 26.7012 15.7916 27.4435Z"
                                fill="#446183"
                            />
                        </svg>
                    </div>
                    <div ref={nextRef} className="custom-arrow next cursor-pointer">
                        <svg
                            width="45"
                            height="28"
                            viewBox="0 0 45 28"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M15.7916 27.4435C15.0277 28.1857 13.789 28.1853 13.0249 27.4435L0.573056 15.3442C-0.191016 14.6017 -0.191016 13.3983 0.573057 12.6558L13.0249 0.556541C13.789 -0.185334 15.0277 -0.18571 15.7916 0.556541C16.5554 1.29879 16.5551 2.50238 15.7916 3.24486L6.67957 12.0989L45 12.0989L45 15.9011L6.67957 15.9011L15.7916 24.7551C16.5551 25.4976 16.5554 26.7012 15.7916 27.4435Z"
                                fill="#446183"
                            />
                        </svg>
                    </div>
                </>
            )}

            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                slidesPerView={slidesToShow}
                spaceBetween={16}
                loop={enableLoop}
                centeredSlides={isCenterMode}
                autoplay={enableAutoplay ? { delay: 2000, disableOnInteraction: false } : false}
                navigation={enableArrows ? { prevEl: prevRef.current, nextEl: nextRef.current } : false}
                pagination={enablePagination ? { clickable: true } : false}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                onBreakpoint={(swiper) => {
                    const navEnabled =
                        typeof swiper.params.navigation !== "boolean" &&
                        swiper.params.navigation &&
                        (swiper.params.navigation as any).enabled !== false;
                    setNavDisabled(!navEnabled);
                }}
                breakpoints={{
                    0: { slidesPerView: 1, centeredSlides: true, navigation: { enabled: false } },
                    768: { slidesPerView: slidesToShow },
                }}
            >
                {finalData.map((item: any, index: number) => (
                    <SwiperSlide key={index} className={item.props.className || ""}>
                        <div className="slider_wrapper">{item.props.children}</div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ModularSlider;

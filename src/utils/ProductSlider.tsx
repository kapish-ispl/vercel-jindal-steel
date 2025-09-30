"use client";
import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

interface PostItem {
    title: string;
    category: string;
    content: string;
    media: { cdnPath: string }[];
}

interface ProductSliderProps {
    postData: PostItem[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ postData }) => {
    const mainSwiperRef = useRef<SwiperType | null>(null);
    const categorySwiperRef = useRef<SwiperType | null>(null);
    const prevRef = useRef<HTMLDivElement | null>(null);
    const nextRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [navDisabled, setNavDisabled] = useState(false);

    const checkNavigation = (swiper: SwiperType) => {
        setNavDisabled(!swiper.params.navigation);
    };

    useEffect(() => {
        if (mainSwiperRef.current) checkNavigation(mainSwiperRef.current);
    }, []);

    const handleCategoryClick = (index: number) => {
        mainSwiperRef.current?.slideToLoop(index);
        categorySwiperRef.current?.slideToLoop(index);
        setActiveIndex(index);
    };

    return (
        <div className={`slider-wrapper position-relative ${navDisabled ? "nav-disabled" : ""}`}>
            {/* Category Slider */}
            <Swiper
                modules={[Navigation]}
                slidesPerView={5}
                centeredSlides
                loop={true} // Keep loop enabled
                loopAdditionalSlides={1} // <-- Add this line
                spaceBetween={16}
                // onSwiper={(swiper) => (categorySwiperRef.current = swiper)}
                onInit={(swiper) => (categorySwiperRef.current = swiper)}
                watchSlidesProgress
                breakpoints={{
                    0: { slidesPerView: 1, centeredSlides: true },
                    576: { slidesPerView: 3 },
                    768: { slidesPerView: 5 },
                }}
                className="category-slider mb-4"
            >
                {postData.map((item, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className={`cursor-pointer text-center ${activeIndex === index ? "c-heading-40 clr-blue font-bold" : ""}`}
                            onClick={() => handleCategoryClick(index)}
                        >
                            {item.title}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="centermode-slider">
                {/* Custom Arrows */}
                <div ref={prevRef} className="custom-arrow prev cursor-pointer">
                    <svg width="45" height="28" viewBox="0 0 45 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.7916 27.4435C15.0277 28.1857 13.789 28.1853 13.0249 27.4435L0.573056 15.3442C-0.191016 14.6017 -0.191016 13.3983 0.573057 12.6558L13.0249 0.556541C13.789 -0.185334 15.0277 -0.18571 15.7916 0.556541C16.5554 1.29879 16.5551 2.50238 15.7916 3.24486L6.67957 12.0989L45 12.0989L45 15.9011L6.67957 15.9011L15.7916 24.7551C16.5551 25.4976 16.5554 26.7012 15.7916 27.4435Z" fill="#446183" />
                    </svg>
                </div>
                <div ref={nextRef} className="custom-arrow next cursor-pointer">
                    <svg width="45" height="28" viewBox="0 0 45 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.7916 27.4435C15.0277 28.1857 13.789 28.1853 13.0249 27.4435L0.573056 15.3442C-0.191016 14.6017 -0.191016 13.3983 0.573057 12.6558L13.0249 0.556541C13.789 -0.185334 15.0277 -0.18571 15.7916 0.556541C16.5554 1.29879 16.5551 2.50238 15.7916 3.24486L6.67957 12.0989L45 12.0989L45 15.9011L6.67957 15.9011L15.7916 24.7551C16.5551 25.4976 16.5554 26.7012 15.7916 27.4435Z" fill="#446183" />
                    </svg>
                </div>

                {/* Main Product Slider */}
                <Swiper
                    modules={[Navigation]}
                    slidesPerView={3}
                    centeredSlides
                    loop
                    spaceBetween={16}
                    onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    onInit={(swiper) => (mainSwiperRef.current = swiper)}
                    onSlideChange={(swiper) => {
                        setActiveIndex(swiper.realIndex);
                        categorySwiperRef.current?.slideToLoop(swiper.realIndex);
                    }}
                    onBeforeInit={(swiper: SwiperType) => {
                        if (typeof swiper.params.navigation !== "boolean" && swiper.params.navigation) {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                        }
                    }}
                    breakpoints={{
                        0: { slidesPerView: 1, centeredSlides: true, navigation: false },
                        768: { slidesPerView: 3, navigation: { enabled: true } },
                    }}
                >
                    {postData.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div className="slide-item">
                                <div className="slide-category text-center font-semibold mb-2">{item.category}</div>
                                <div className="slider_wrapper">
                                    <div className="ratio ratio-4x3">
                                        <img alt={item.title} className="img-fluid u-img" src={item.media[0]?.cdnPath ?? ""} />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Content below slider */}
                {postData[activeIndex] && (
                    <div className="text-center mt-5">
                        <p className="w-75 m-auto">{postData[activeIndex].content}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductSlider;

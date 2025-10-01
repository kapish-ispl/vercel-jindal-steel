"use client";
import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import useBreakpoint from "@/hooks/useBreakpoint";

// --- Type Definitions ---
interface PostItem {
    title: string;
    category: string;
    content: string;
    media: { cdnPath: string }[];
}

interface ResponsiveOptions {
    slidesPerView: number;
    arrows: boolean;
}

interface ResponsiveSettings {
    [key: string]: Partial<ResponsiveOptions>;
}

interface ResponsiveProp {
    main: ResponsiveSettings;
    category: ResponsiveSettings;
}

interface ProductSliderProps {
    postData: PostItem[];
    responsive?: ResponsiveProp;
}

// --- Component Configuration ---
const MAIN_OPTIONS: EmblaOptionsType = { loop: true, align: "center" };
const CATEGORY_OPTIONS: EmblaOptionsType = {
    loop: true,
    align: "center",
    containScroll: "trimSnaps",
    dragFree: true,
};

const BREAKPOINTS = {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
};

const DEFAULT_RESPONSIVE_SETTINGS: ResponsiveProp = {
    main: {
        mobile: { slidesPerView: 1, arrows: false },
        tablet: { slidesPerView: 3, arrows: false },
        desktop: { slidesPerView: 3, arrows: true },
    },
    category: {
        mobile: { slidesPerView: 3, arrows: false },
        tablet: { slidesPerView: 3, arrows: false },
        desktop: { slidesPerView: 5, arrows: false },
    },
};

// --- The Component ---
const ProductSlider: React.FC<ProductSliderProps> = ({
    postData,
    responsive = DEFAULT_RESPONSIVE_SETTINGS
}) => {
    const [mainRef, mainEmblaApi] = useEmblaCarousel(MAIN_OPTIONS);
    const [categoryRef, categoryEmblaApi] = useEmblaCarousel(CATEGORY_OPTIONS);
    const [activeIndex, setActiveIndex] = useState(0);

    const activeBreakpoint = useBreakpoint(BREAKPOINTS);
    const mainSettings = responsive.main[activeBreakpoint] || responsive.main.desktop;
    const categorySettings = responsive.category[activeBreakpoint] || responsive.category.desktop;

    const scrollPrev = useCallback(() => mainEmblaApi?.scrollPrev(), [mainEmblaApi]);
    const scrollNext = useCallback(() => mainEmblaApi?.scrollNext(), [mainEmblaApi]);

    const handleCategoryClick = useCallback((index: number) => {
        mainEmblaApi?.scrollTo(index);
    }, [mainEmblaApi]);

    useEffect(() => {
        if (!mainEmblaApi || !categoryEmblaApi) return;

        const syncCarousels = () => {
            const newIndex = mainEmblaApi.selectedScrollSnap();
            setActiveIndex(newIndex);
            if (categoryEmblaApi.selectedScrollSnap() !== newIndex) {
                categoryEmblaApi.scrollTo(newIndex);
            }
        };

        mainEmblaApi.on("select", syncCarousels);
        return () => {
            mainEmblaApi.off("select", syncCarousels);
        };
    }, [mainEmblaApi, categoryEmblaApi]);

    return (
        <div className="custom-slider is-center-mode">
            {/* Category Carousel */}
            <div
                className="embla embla--category"
                ref={categoryRef}
                style={{ '--slides-per-view': categorySettings.slidesPerView } as React.CSSProperties}
            >
                <div className="embla__container">
                    {postData.map((item, index) => (
                        <div className="embla__slide embla__slide--category" key={`cat-${index}`}>
                            <div
                                className={`cursor-pointer text-center ${activeIndex === index ? "c-heading-40 clr-blue font-bold" : ""}`}
                                onClick={() => handleCategoryClick(index)}
                            >
                                {item.title}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Carousel & Content Section */}
            <div className="centermode-slider">
                {mainSettings.arrows && (
                    <>
                        <div className="custom-arrow prev" onClick={scrollPrev}>
                            <svg width="45" height="28" viewBox="0 0 45 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.7916 27.4435C15.0277 28.1857 13.789 28.1853 13.0249 27.4435L0.573056 15.3442C-0.191016 14.6017 -0.191016 13.3983 0.573057 12.6558L13.0249 0.556541C13.789 -0.185334 15.0277 -0.18571 15.7916 0.556541C16.5554 1.29879 16.5551 2.50238 15.7916 3.24486L6.67957 12.0989L45 12.0989L45 15.9011L6.67957 15.9011L15.7916 24.7551C16.5551 25.4976 16.5554 26.7012 15.7916 27.4435Z" fill="#446183" /></svg>
                        </div>
                        <div className="custom-arrow next" onClick={scrollNext}>
                            <svg width="45" height="28" viewBox="0 0 45 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path transform="scale(-1, 1) translate(-45, 0)" d="M15.7916 27.4435C15.0277 28.1857 13.789 28.1853 13.0249 27.4435L0.573056 15.3442C-0.191016 14.6017 -0.191016 13.3983 0.573057 12.6558L13.0249 0.556541C13.789 -0.185334 15.0277 -0.18571 15.7916 0.556541C16.5554 1.29879 16.5551 2.50238 15.7916 3.24486L6.67957 12.0989L45 12.0989L45 15.9011L6.67957 15.9011L15.7916 24.7551C16.5551 25.4976 16.5554 26.7012 15.7916 27.4435Z" fill="#446183" /></svg>
                        </div>
                    </>
                )}

                <div
                    className="embla"
                    ref={mainRef}
                    style={{ '--slides-per-view': mainSettings.slidesPerView } as React.CSSProperties}
                >
                    <div className="embla__container">
                        {postData.map((item, index) => (
                            <div className={`embla__slide ${index === activeIndex ? "is-active" : ""}`} key={`main-${index}`}>
                                <div className="slide-item">
                                    <div className="slide-category text-center font-semibold mb-2">{item.category}</div>
                                    <div className="slider_wrapper">
                                        <div className="ratio ratio-4x3">
                                            <img alt={item.title} className="img-fluid u-img" src={item.media[0]?.cdnPath ?? ""} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {postData[activeIndex] && (
                    <div className="text-center mt-5">
                        <p className="center-mode-activeContent m-auto">{postData[activeIndex].content}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductSlider;
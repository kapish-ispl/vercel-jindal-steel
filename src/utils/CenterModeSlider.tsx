"use client";
import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import useBreakpoint from "@/hooks/useBreakpoint";

// --- Type Definitions ---
interface MediaItem {
    cdnPath: string;
}
interface PostItem {
    title: string;
    content: string;
    media: MediaItem[];
}

interface ResponsiveSettings {
    [key: string]: {
        slidesPerView: number;
        arrows: boolean;
    };
}

interface CenterModeSliderProps {
    postData: PostItem[];
    responsive?: ResponsiveSettings;
}

// --- Component Configuration ---
const OPTIONS: EmblaOptionsType = { loop: true, align: "center" };
const BREAKPOINTS = {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
};
const DEFAULT_RESPONSIVE_SETTINGS: ResponsiveSettings = {
    mobile: { slidesPerView: 1, arrows: false },
    tablet: { slidesPerView: 3, arrows: true },
    desktop: { slidesPerView: 3, arrows: true },
};

// --- The Component ---
const CenterModeSlider: React.FC<CenterModeSliderProps> = ({
    postData,
    responsive = DEFAULT_RESPONSIVE_SETTINGS,
}) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
    const [activeIndex, setActiveIndex] = useState(0);

    const activeBreakpoint = useBreakpoint(BREAKPOINTS);
    const settings = responsive[activeBreakpoint] || responsive.desktop;

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
        emblaApi.on("select", onSelect);
        return () => { emblaApi.off("select", onSelect) };
    }, [emblaApi]);

    // Fallback if only one item
    if (postData.length <= 1) {
        return (
            <div className="row">
                {postData.map((info, idx) => (
                    <div className="col-12" key={idx}>
                        <div className="slider_wrapper">
                            <h5>{info.title}</h5>
                            <div className="ratio ratio-4x3">
                                <img alt={info.title} className="img-fluid u-img" src={info.media[0]?.cdnPath ?? ""} />
                            </div>
                            <p>{info.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="custom-slider is-center-mode">
            {settings.arrows && (
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
                className="embla-center-mode"
                ref={emblaRef}
                style={{ '--slides-per-view': settings.slidesPerView } as React.CSSProperties}
            >
                <div className="embla-center-mode__container">
                    {postData.map((item, index) => (
                        <div
                            className={`embla-center-mode__slide ${index === activeIndex ? "is-active" : ""}`}
                            key={index}
                        >
                            <div className="slide-item">
                                <h5>{item.title}</h5>
                                <div className="ratio ratio-4x3">
                                    <img alt={item.title} className="img-fluid u-img" src={item.media[0]?.cdnPath ?? ""} />
                                </div>
                                {/* <p>{item.content}</p> */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {postData[activeIndex] && (
                <div className="text-center mt-5">
                    <p className="w-75 m-auto">{postData[activeIndex].content}</p>
                </div>
            )}
        </div>
    );
};

export default CenterModeSlider;
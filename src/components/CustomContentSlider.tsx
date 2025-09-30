"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useBreakpoint from "@/hooks/useBreakpoint";

// --- Type Definitions ---
interface ResponsiveOptions {
    slidesPerView: number;
    arrows: boolean;
    dots: boolean;
    autoplay: boolean;
    loop: boolean;
    centerMode: boolean;
}

interface ResponsiveSettings {
    [key: string]: Partial<ResponsiveOptions>;
}

interface CustomContentSliderProps {
    data: any;
    responsive?: ResponsiveSettings;
    showdots?: 'yes' | 'no';
    showarrows?: 'yes' | 'no';
    autoplay?: 'yes' | 'no';
    loop?: 'yes' | 'no';
    centermode?: 'yes' | 'no';
    itemstoshow?: number;
}

// --- Component Configuration ---
const BREAKPOINTS = {
    mobile: 0,
    tablet: 767,
    laptop: 991,
    desktop: 1200,
};

const DEFAULT_RESPONSIVE_SETTINGS: ResponsiveSettings = {
    mobile: { slidesPerView: 1, arrows: false, dots: false, autoplay: true, loop: true, centerMode: false },
    tablet: { slidesPerView: 2, arrows: false, dots: false, autoplay: true, loop: true, centerMode: false },
    laptop: { slidesPerView: 3, arrows: false, dots: false, autoplay: true, loop: true, centerMode: false },
    desktop: { slidesPerView: 4, arrows: true, dots: false, autoplay: true, loop: true, centerMode: false },
};

// --- The Component ---
const CustomContentSlider: React.FC<CustomContentSliderProps> = ({
    data,
    responsive = DEFAULT_RESPONSIVE_SETTINGS,
    showdots = 'no',
    showarrows = 'yes',
    autoplay = 'yes',
    loop = 'yes',
    centermode = 'no',
    itemstoshow = 4,
}) => {
    // const slides = React.Children.toArray(children);
    const slides = data?.filter((item: any) => item.props !== undefined);
    const itemCount = slides.length;

    const activeBreakpoint = useBreakpoint(BREAKPOINTS);
    const slidesPerView = useMemo(() => {
        switch (activeBreakpoint) {
            case 'mobile':
                return 1; // Always show 1 on mobile
            case 'tablet':
                return 2; // Always show 2 on tablet
            case 'laptop':
                return 3; // Always show 3 on laptop
            default:
                return itemstoshow; // Use the prop value for desktop
        }
    }, [activeBreakpoint, itemstoshow]);
    const settings = { ...DEFAULT_RESPONSIVE_SETTINGS.desktop, ...responsive[activeBreakpoint] };

    // Determine if the slider features should be active
    const isSliderActive = itemCount > slidesPerView || 1;

    const emblaOptions: EmblaOptionsType = {
        loop: isSliderActive && loop === 'yes',
        align: centermode === 'yes' ? "center" : "start",
    };

    const plugins = useMemo(() => {
        if (isSliderActive && autoplay === 'yes') {
            return [Autoplay()];
        }
        return [];
    }, [isSliderActive, autoplay]);

    const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions, plugins);


    const [activeIndex, setActiveIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        const onUpdate = () => {
            setScrollSnaps(emblaApi.scrollSnapList());
            setActiveIndex(emblaApi.selectedScrollSnap());
            setCanScrollPrev(emblaApi.canScrollPrev());
            setCanScrollNext(emblaApi.canScrollNext());
        };
        emblaApi.on("select", onUpdate);
        emblaApi.on("reInit", onUpdate);
        onUpdate(); // Initial setup
        return () => { emblaApi.off("select", onUpdate).off("reInit", onUpdate) };
    }, [emblaApi]);

    if (!isSliderActive) {
        return (
            <div className="row">
                {slides.map((slide: any, index: number) => (
                    <div className="col-12" key={index}>
                        {slide}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={`custom-content-slider ${settings.centerMode ? "is-center-mode" : ""}`}>
            {showarrows === 'yes' && itemCount > itemstoshow && settings.arrows && (
                <>
                    <div className="custom-arrow prev" onClick={scrollPrev}>
                        <svg width="45" height="28" viewBox="0 0 45 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.7916 27.4435C15.0277 28.1857 13.789 28.1853 13.0249 27.4435L0.573056 15.3442C-0.191016 14.6017 -0.191016 13.3983 0.573057 12.6558L13.0249 0.556541C13.789 -0.185334 15.0277 -0.18571 15.7916 0.556541C16.5554 1.29879 16.5551 2.50238 15.7916 3.24486L6.67957 12.0989L45 12.0989L45 15.9011L6.67957 15.9011L15.7916 24.7551C16.5551 25.4976 16.5554 26.7012 15.7916 27.4435Z" fill="#446183" /></svg>
                    </div>
                    <div className="custom-arrow next" onClick={scrollNext}>
                        <svg width="45" height="28" viewBox="0 0 45 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path transform="scale(-1, 1) translate(-45, 0)" d="M15.7916 27.4435C15.0277 28.1857 13.789 28.1853 13.0249 27.4435L0.573056 15.3442C-0.191016 14.6017 -0.191016 13.3983 0.573057 12.6558L13.0249 0.556541C13.789 -0.185334 15.0277 -0.18571 15.7916 0.556541C16.5554 1.29879 16.5551 2.50238 15.7916 3.24486L6.67957 12.0989L45 12.0989L45 15.9011L6.67957 15.9011L15.7916 24.7551C16.5551 25.4976 16.5554 26.7012 15.7916 27.4435Z" fill="#446183" /></svg>
                    </div>
                </>
            )}

            <div className="embla-content-slider" ref={emblaRef} style={{ '--slides-per-view': slidesPerView } as React.CSSProperties}>
                <div className="embla-content-slider__container">
                    {slides.map((child: any, index: number) => (
                        <div className="embla-content-slider__slide" key={index}>
                            {child}
                        </div>
                    ))}
                </div>
            </div>

            {showdots === 'yes' && settings.dots && (
                <div className="embla-content-slider__dots">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`embla-content-slider__dot ${index === activeIndex ? "is-selected" : ""}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomContentSlider;
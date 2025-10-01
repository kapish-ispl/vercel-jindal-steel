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
    const slides = data?.filter((item: any) => item.props !== undefined);
    const itemCount = slides.length;
    const [activeIndex, setActiveIndex] = useState(0);

    const activeBreakpoint = useBreakpoint(BREAKPOINTS);
    const slidesPerView = useMemo(() => {
        switch (activeBreakpoint) {
            case 'mobile':
                return responsive.mobile?.slidesPerView || 1;
            case 'tablet':
                return responsive.tablet?.slidesPerView || 2;
            case 'laptop':
                return responsive.laptop?.slidesPerView || 3;
            default:
                return itemstoshow;
        }
    }, [activeBreakpoint, itemstoshow, responsive]);

    const mergedResponsive: ResponsiveSettings = useMemo(() => {
        const clone = { ...DEFAULT_RESPONSIVE_SETTINGS };
        Object.keys(clone).forEach((bp) => {
            clone[bp] = {
                ...clone[bp],
                ...responsive[bp],
                centerMode: centermode === "yes", // force override from prop
            };
        });
        return clone;
    }, [responsive, centermode]);

    const settings = mergedResponsive[activeBreakpoint] || mergedResponsive.desktop;

    const isSliderActive = itemCount > 1;

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

    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            setActiveIndex(emblaApi.selectedScrollSnap());
        };

        const onUpdate = () => {
            setScrollSnaps(emblaApi.scrollSnapList());
        };

        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
        emblaApi.on("reInit", onUpdate);
        emblaApi.on("select", onUpdate);

        onSelect();
        onUpdate();

        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
            emblaApi.off("reInit", onUpdate);
            emblaApi.off("select", onUpdate);
        };
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

    // Determine the correct class names based on centermode prop
    const isCenterMode = centermode === "yes";
    const sliderWrapperClass = isCenterMode ? "custom-slider is-center-mode" : "custom-content-slider";
    const emblaViewportClass = isCenterMode ? "embla-center-mode" : "embla-content-slider";
    const emblaContainerClass = isCenterMode ? "embla-center-mode__container" : "embla-content-slider__container";
    const emblaSlideClass = isCenterMode ? "embla-center-mode__slide" : "embla-content-slider__slide";

    return (
        <div className={sliderWrapperClass}>
            {showarrows === 'yes' && itemCount > slidesPerView && settings.arrows && (
                <>
                    <div className="custom-arrow prev" onClick={scrollPrev}>
                        <svg width="45" height="28" viewBox="0 0 45 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.7916 27.4435C15.0277 28.1857 13.789 28.1853 13.0249 27.4435L0.573056 15.3442C-0.191016 14.6017 -0.191016 13.3983 0.573057 12.6558L13.0249 0.556541C13.789 -0.185334 15.0277 -0.18571 15.7916 0.556541C16.5554 1.29879 16.5551 2.50238 15.7916 3.24486L6.67957 12.0989L45 12.0989L45 15.9011L6.67957 15.9011L15.7916 24.7551C16.5551 25.4976 16.5554 26.7012 15.7916 27.4435Z" fill="#446183" /></svg>
                    </div>
                    <div className="custom-arrow next" onClick={scrollNext}>
                        <svg width="45" height="28" viewBox="0 0 45 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path transform="scale(-1, 1) translate(-45, 0)" d="M15.7916 27.4435C15.0277 28.1857 13.789 28.1853 13.0249 27.4435L0.573056 15.3442C-0.191016 14.6017 -0.191016 13.3983 0.573057 12.6558L13.0249 0.556541C13.789 -0.185334 15.0277 -0.18571 15.7916 0.556541C16.5554 1.29879 16.5551 2.50238 15.7916 3.24486L6.67957 12.0989L45 12.0989L45 15.9011L6.67957 15.9011L15.7916 24.7551C16.5551 25.4976 16.5554 26.7012 15.7916 27.4435Z" fill="#446183" /></svg>
                    </div>
                </>
            )}

            <div className={emblaViewportClass} ref={emblaRef} style={{ '--slides-per-view': slidesPerView } as React.CSSProperties}>
                <div className={emblaContainerClass}>
                    {slides.map((child: any, index: number) => (
                        <div className={`${emblaSlideClass} ${index === activeIndex ? "is-active" : ""}`} key={index}>
                            {/* In center mode, an extra wrapper might be needed if your CSS requires it, like in the original slider */}
                            {isCenterMode ? <div className="slide-item">{child}</div> : child}
                        </div>
                    ))}
                </div>
            </div>

            {showdots === 'yes' && !isCenterMode && settings.dots && (
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
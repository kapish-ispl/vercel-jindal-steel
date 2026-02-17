"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import EmblaCarouselWheelGestures from "embla-carousel-wheel-gestures";

interface StackSliderProps {
    data: React.ReactNode[];
    direction?: "left" | "right";
}
interface SlideProps {
    src: string;
}

const StackSlider: React.FC<StackSliderProps> = ({ data, direction = "left", }) => {
    console.log(direction)
    const slides = useMemo(() => {
        if (!data) return [];

        return React.Children.toArray(data)
            .filter(
                (child): child is React.ReactElement<SlideProps> =>
                    React.isValidElement(child) &&
                    typeof (child.props) !== "undefined"
            )
            .map((child, index) => ({
                id: index + 1,
                src: child.props.src,
            }));
    }, [data]);


    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: false, duration: 40 },
        [EmblaCarouselWheelGestures(),]
    );

    const updateStackUI = useCallback(() => {
        if (!emblaApi) return;

        const slides = emblaApi.slideNodes();
        const scrollProgress = emblaApi.scrollProgress();
        const totalSlides = slides.length - 1;

        slides.forEach((slide, index) => {
            // slideProgress: 0 is active, negative is exiting, positive is in the stack
            const slideProgress = index - scrollProgress * totalSlides;
            const htmlSlide = slide as HTMLElement;

            if (slideProgress < 0) {
                const xMove = direction === "right"
                    ? slideProgress * -210
                    : slideProgress * 110;

                const rotation = direction === "right"
                    ? slideProgress * 5
                    : slideProgress * 5;

                htmlSlide.style.transform = `translateX(${xMove}%) rotate(${rotation}deg)`;
                htmlSlide.style.opacity = `${1 + slideProgress}`;
                htmlSlide.style.zIndex = "100";
            } else {
                // --- STACK ANIMATION (Cards behind) ---
                const flexMove = slideProgress * -100;

                // If slider is on right, cards peek from the LEFT (-25px)
                // If slider is on left, cards peek from the RIGHT (+25px)
                const peekFactor = direction === "right" ? -25 : 25;
                const peek = slideProgress * peekFactor;

                const scale = 1 - slideProgress * 0.05;
                const brightness = 1 - slideProgress * 0.1;

                htmlSlide.style.transform = `translateX(calc(${flexMove}% + ${peek}px)) scale(${scale})`;
                htmlSlide.style.filter = `brightness(${brightness})`;
                htmlSlide.style.opacity = "1";
                htmlSlide.style.zIndex = `${slides.length - index}`;
            }
        });
    }, [emblaApi, direction]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("scroll", updateStackUI);
        emblaApi.on("reInit", updateStackUI);
        updateStackUI();
    }, [emblaApi, updateStackUI]);

    return (
        <div className={`c-stack-wrapper noheight ${direction}-dir`}>
            <div className="content-grid">
                <div className="slider-column">
                    <div className="embla" ref={emblaRef}>
                        <div className="embla__container">
                            {slides.map((item, index) => (
                                <div className="embla__slide" key={index}>
                                    <img src={item.src} alt={`Slide ${index}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="controls">
                        <button className="btn" onClick={() => emblaApi?.scrollPrev()}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                        <button className="btn" onClick={() => emblaApi?.scrollNext()}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StackSlider;
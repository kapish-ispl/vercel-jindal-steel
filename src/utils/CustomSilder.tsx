"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";


const CustomSlider = ({ cls, customcls, items, data, arrows, dots, bluearrow, children }: any) => {

    const parsedItems: any = React.useMemo(() => {
        try {
            if (typeof items === "string") {
                const arr = JSON.parse(items);
                if (Array.isArray(arr) && arr.length === 3) return arr;
            }
            if (Array.isArray(items)) return items;
            return [1, 1, 1]; // fallback
        } catch {
            return [1, 1, 1];
        }
    }, [items]);
    const filteredItems = data?.filter((item: any) => item.props != undefined) || children;
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1, });
    const [slidesToShow, setSlidesToShow] = useState(parsedItems[0]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const autoplayInterval = useRef<NodeJS.Timeout | null>(null);

    // ✅ Handle responsive slides
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setSlidesToShow(parsedItems[2]); // mobile
            } else if (window.innerWidth <= 1024) {
                setSlidesToShow(parsedItems[1]); // tablet
            } else {
                setSlidesToShow(parsedItems[0]); // desktop
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [parsedItems]);

    // ✅ Handle slide change event
    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        onSelect();
    }, [emblaApi, onSelect]);

    useEffect(() => {
        if (!emblaApi) return;

        const play = () => {
            emblaApi.scrollNext();
        };

        autoplayInterval.current = setInterval(play, 3000); // ⏱ change 3000ms to your preferred speed

        // Pause on hover
        const emblaRoot = emblaApi.rootNode();
        const handleMouseEnter = () => clearInterval(autoplayInterval.current!);
        const handleMouseLeave = () => {
            autoplayInterval.current = setInterval(play, 3000);
        };

        emblaRoot.addEventListener("mouseenter", handleMouseEnter);
        emblaRoot.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            clearInterval(autoplayInterval.current!);
            emblaRoot.removeEventListener("mouseenter", handleMouseEnter);
            emblaRoot.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [emblaApi]);

    // ✅ Navigation
    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    return (
        <div className={`c-embla ${customcls ? customcls : ""}`}>
            <div className="c-embla__viewport" ref={emblaRef}>
                <div
                    className={`c-embla__container ${cls ? cls : ""}`}
                >
                    {filteredItems?.map((item: any, index: number) => (
                        <div className="c-embla__slide" style={{ flex: `0 0 calc(100% / ${slidesToShow})` }} key={index}>
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* ✅ Navigation Buttons */}
            {(arrows == 'true' && filteredItems.length > slidesToShow) &&
                <div className="c-embla__buttons">
                    <button
                        className="c-embla__arrow c-embla__arrow--prev"
                        onClick={scrollPrev}
                        aria-label="Previous Slide"
                    >
                        <img src={bluearrow == true ? 'url' : "https://docs.jindalsteel.in/document/124/1763981729_Group58.png"} alt="Next" />
                    </button>
                    <button
                        className="c-embla__arrow c-embla__arrow--next"
                        onClick={scrollNext}
                        aria-label="Next Slide"
                    >

                        <img src={bluearrow == true ? 'url' : "https://docs.jindalsteel.in/document/124/1763981729_Group58.png"} alt="Previous" />
                    </button>
                    {/* <button onClick={scrollPrev} className="c-embla__button">
                        ◀
                    </button>
                    <button onClick={scrollNext} className="c-embla__button">
                        ▶
                    </button> */}
                </div>
            }

            {(dots == 'true' && filteredItems.length > slidesToShow) && (
                <div className="c-embla__dots-wrap">
                    {/* Dots */}
                    <div className="c-embla__dots">
                        {filteredItems?.map((_: any, i: number) => (
                            <button
                                key={i}
                                className={`c-embla__dot ${i === selectedIndex ? "is-selected" : ""}`}
                                onClick={() => emblaApi && emblaApi.scrollTo(i)}
                            />
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default CustomSlider;

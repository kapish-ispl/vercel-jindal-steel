"use client";

import React, {
    useEffect,
    useState,
    useCallback,
    useRef,
    ReactNode,
} from "react";
import useEmblaCarousel from "embla-carousel-react";

interface CustomSliderProps {
    cls?: string;
    customcls?: string;
    items?: number[] | string;
    data?: ReactNode[];
    bluearrow?: boolean | string;
    arrows?: boolean | string;
    dots?: boolean | string;
    children?: ReactNode;
}

export default function CustomSlider({
    cls,
    customcls,
    items,
    data,
    arrows = false,
    bluearrow = false,
    dots = false,
    children,
}: CustomSliderProps) {

    const showArrows = arrows === true || arrows === "true";
    const showDots = dots === true || dots === "true";

    // Parse items safely
    const parsedItems = React.useMemo<number[]>(() => {
        try {
            if (typeof items === "string") {
                const parsed = JSON.parse(items);
                if (Array.isArray(parsed) && parsed.length === 4) return parsed;
            }
            if (Array.isArray(items)) return items;
            return [1, 1, 1, 1];
        } catch {
            return [1, 1, 1, 1];
        }
    }, [items]);

    // Select actual slider items
    const filteredItems: ReactNode[] =
        data?.filter((item) => item !== null && item !== undefined && typeof item !== "string") ||
        React.Children.toArray(children).filter(Boolean);

    const [slidesToShow, setSlidesToShow] = useState(parsedItems[0]);

    const canScroll = filteredItems.length > slidesToShow;

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: canScroll,
        align: "start",
        slidesToScroll: 1,
        watchDrag: canScroll,
    });

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    const autoplayInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    // Callbacks
    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    const onInit = useCallback(() => {
        if (!emblaApi) return;
        setScrollSnaps(emblaApi.scrollSnapList());
    }, [emblaApi]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    // Handle responsiveness
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) setSlidesToShow(parsedItems[3]);
            else if (window.innerWidth <= 1024) setSlidesToShow(parsedItems[2]);
            else if (window.innerWidth <= 1200) setSlidesToShow(parsedItems[1]);
            else setSlidesToShow(parsedItems[0]);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [parsedItems]);

    // Re-initialize Embla when conditions change
    useEffect(() => {
        if (emblaApi) {
            emblaApi.reInit({ watchDrag: canScroll, loop: canScroll });
            onInit();
            onSelect();
        }
    }, [emblaApi, canScroll, onInit, onSelect, filteredItems.length, slidesToShow]);

    // Set up Embla event listeners
    useEffect(() => {
        if (!emblaApi) return;

        onInit();
        onSelect();
        emblaApi.on("reInit", onInit);
        emblaApi.on("reInit", onSelect);
        emblaApi.on("select", onSelect);

        return () => {
            emblaApi.off("reInit", onInit);
            emblaApi.off("reInit", onSelect);
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, onInit, onSelect]);

    // Auto play handler
    useEffect(() => {
        if (!emblaApi || !canScroll) return;

        const play = () => emblaApi.scrollNext();
        autoplayInterval.current = setInterval(play, 5000);

        const root = emblaApi.rootNode();
        const handleMouseEnter = () =>
            autoplayInterval.current && clearInterval(autoplayInterval.current);

        const handleMouseLeave = () => {
            autoplayInterval.current = setInterval(play, 5000);
        };

        root.addEventListener("mouseenter", handleMouseEnter);
        root.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            autoplayInterval.current && clearInterval(autoplayInterval.current);
            root.removeEventListener("mouseenter", handleMouseEnter);
            root.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [emblaApi, canScroll]);

    return (
        <div className={`c-embla ${customcls || ""}`}>
            <div className="c-embla__viewport" ref={emblaRef}>
                <div className={`c-embla__container ${cls || ""}`}>
                    {filteredItems?.map((item, index) => (
                        <div
                            key={index}
                            className="c-embla__slide"
                            style={{
                                flex: `0 0 calc(100% / ${slidesToShow})`,
                            }}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            {showArrows && canScroll && (
                <div className="c-embla__buttons">
                    <button
                        className="c-embla__arrow c-embla__arrow--prev"
                        onClick={scrollPrev}
                        aria-label="Previous Slide"
                    >
                       <img className="u-img" src={bluearrow == true ? 'url' : "https://docs.jindalsteel.in/document/124/1771396856_pre-arrow-gray.png"} alt="Previous" />
                    </button>

                    <button
                        className="c-embla__arrow c-embla__arrow--next notransform"
                        onClick={scrollNext}
                        aria-label="Next Slide"
                    >
                        <img className="u-img" src={bluearrow == true ? 'url' : "https://docs.jindalsteel.in/document/124/1771396856_next-arrow-gray.png"} alt="Next" />
                    </button>
                </div>
            )}

            {/* Dots */}
            {showDots && canScroll && (
                <div className="c-embla__dots-wrap" style={{ position: "absolute", bottom: "20px", left: "0", width: "100%", display: "flex", justifyContent: "center" }}>
                    <div className="c-embla__dots" style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                        {scrollSnaps.map((_, i) => (
                            <button
                                key={i}
                                className={`c-embla__dot ${i === selectedIndex ? "is-selected" : ""
                                    }`}
                                onClick={() => emblaApi?.scrollTo(i)}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

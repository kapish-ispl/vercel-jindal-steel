"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";


const SLIDE_DURATION = 5000; // 5 seconds

const STATIC_SLIDES = [
    {
        id: 0,
        category: "INDIA",
        title: "A Truly Global Workforce",
        desc: "Our people work across India, Africa, the Middle East, Australia, and other global markets, forming a diverse and skilled workforce united by shared values. This global presence strengthens collaboration, knowledge exchange, and organisational resilience across geographies.",
        image: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1768991508_Rectangle618.png",
    },
    {
        id: 1,
        category: "AFRICA",
        title: "A Truly Global Workforce",
        desc: "Our people work across India, Africa, the Middle East, Australia, and other global markets, forming a diverse and skilled workforce united by shared values. This global presence strengthens collaboration, knowledge exchange, and organisational resilience across geographies.",
        image: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1769078878_51efca8000a5678e3f0d29c39d5803393939c089.png",
    },
    {
        id: 2,
        category: "MIDDLE EAST",
        title: "Strategic Partnerships",
        desc: "Building resilient infrastructures in the Middle East through collaboration and technology.",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 3,
        category: "AUSTRALIA",
        title: "Leading Sustainability",
        desc: "Setting new standards for environmental excellence in our Australian operations.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1000",
    }
];

export default function CategorySlider() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 }, [
        Autoplay({ delay: SLIDE_DURATION, stopOnInteraction: false })
    ]);

    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
    }, [emblaApi, onSelect]);

    const scrollTo = (index: number) => {
        if (!emblaApi) return;
        emblaApi.scrollTo(index);
        const autoplay = emblaApi.plugins().autoplay;
        if (autoplay) autoplay.reset();
    };

    return (
        <div className="global-slider-wrapper">
            <div
                className="background-blur"
                style={{ backgroundImage: `url(${STATIC_SLIDES[selectedIndex].image})` }}
            />

            <div className="container cus-container">
                <div className="category-nav">
                    {STATIC_SLIDES.map((item, index) => (
                        <div
                            key={item.id}
                            className={`nav-item ${index === selectedIndex ? "active" : ""}`}
                            onClick={() => scrollTo(index)}
                        >
                            {item.category}
                            <div className="underline-container">
                                <div
                                    className="underline-progress"
                                    style={{
                                        width: index === selectedIndex ? "100%" : "0%",
                                        transition: index === selectedIndex
                                            ? `width ${SLIDE_DURATION}ms linear`
                                            : "none"
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="embla" ref={emblaRef}>
                    <div className="embla__container">
                        {STATIC_SLIDES.map((slide) => (
                            <div className="embla__slide" key={slide.id}>
                                <div className="slide-content">
                                    <div className="text-side">
                                        <h2>{slide.title}</h2>
                                        <p>{slide.desc}</p>
                                    </div>
                                    <div className="media-side">
                                        <img src={slide.image} alt={slide.category} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
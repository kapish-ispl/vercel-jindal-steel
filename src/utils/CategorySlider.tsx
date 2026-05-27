"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";


const SLIDE_DURATION = 5000; // 5 seconds

const STATIC_SLIDES = [
    {
        id: 0,
        category: "Jindal Learning",
        title: "Jindal Learning Academy",
        desc: "Designed to shape future-ready professionals, the Jindal Learning Academy is our enterprise-wide learning framework across all levels. It offers structured, role-specific programs focused on managerial excellence, functional skills, leadership development, digital proficiency, compliance, and cultural alignment. ",
        image: "https://docs.jindalsteel.in/document/124/1778577565_Learning-Academy.jpg",
    },
    {
        id: 1,
        category: "Dakshata",
        title: "Dakshata",
        desc: "Dakshata is our enterprise-wide skilling movement focused on enabling excellence at every level, from entry gate to leadership. It’s our way of turning competency into a shared responsibility.",
        image: "https://docs.jindalsteel.in/document/124/1778581124_Dakshata-img1.jpg",
    },
    {
        id: 2,
        category: "Higher Education",
        title: "Higher Education Support",
        desc: "We believe steel is forged stronger through knowledge. That’s why we actively invest in higher education and professional advancement, not just for our Jindalites but for their families too. Because when one learns, many rise.",
        image: "https://docs.jindalsteel.in/document/124/1778577868_Higher-Education.jpg",
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
        <div className="global-slider-wrapper  c-pt75">
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
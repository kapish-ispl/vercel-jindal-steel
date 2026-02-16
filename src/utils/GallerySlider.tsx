import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useDeviceType } from "@/hooks/useDeviceType";
import Image from "next/image";

type Slide = {
    id: number;
    image: string;
};

const slides: Slide[] = [
    { id: 1, image: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1737819452slider1.jpg" },
    { id: 2, image: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1737819454slider11.jpg" },
    { id: 3, image: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1737819455slider12.jpg" },
    { id: 4, image: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1737819455slider13.jpg" },
    { id: 5, image: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1737819455slider14.jpg" },
    { id: 6, image: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1737819455slider15.jpg" },
    { id: 7, image: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1737819455slider16.jpg" },
    { id: 8, image: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1737819456slider17.jpg" },
    { id: 9, image: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1737819456slider18.jpg" },
    { id: 11, image: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1737819456slider19.jpg" },
    { id: 12, image: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1737819451slider20.jpg" },
    { id: 13, image: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1737819452slider2.jpg" },
    { id: 14, image: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1737819452slider3.jpg" },
    { id: 15, image: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1737819452slider4.jpg" },
    { id: 16, image: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1737819453slider5.jpg" },
    { id: 17, image: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1737819453slider6.jpg" },
    { id: 18, image: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1737819453slider7.jpg" },
    { id: 19, image: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1737819454slider8.jpg" },
    { id: 20, image: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1737819454slider9.jpg" },
    { id: 21, image: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1737819454slider10.jpg" },
];

export default function GallerySlider(data: any, thumbnails = true) {
    const device = useDeviceType();
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
    });


    const [selectedIndex, setSelectedIndex] = useState(0);
    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        };

        emblaApi.on("select", onSelect);

        // Set initial index
        onSelect();

        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi]);


    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const scrollTo = useCallback(
        (index: number) => emblaApi && emblaApi.scrollTo(index),
        [emblaApi]
    );
    ;


    return (
        <div className="thumbnailSlider">
            {/* MAIN SLIDER */}
            <div className="thumbnailSlider__main">
                <div className="embla" ref={emblaRef}>
                    <div className="embla__container">
                        {slides.map((slide, index) => (
                            <div className="embla__slide" key={index}>
                                <div className="image-wrapper">
                                    <Image
                                        src={slide.image}
                                        alt="alt"
                                        fill
                                        sizes="(max-width: 640px) 100vw,
               (max-width: 1024px) 90vw,
               100vw"
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                {/* Arrows */}
                <button
                    className="thumbnailSlider__arrow thumbnailSlider__arrow--prev"
                    onClick={scrollPrev}
                    aria-label="Previous slide"
                >
                    <img src="https://docs.jindalsteel.in/document/124/1769843887_previous-arrow.png" alt="" />
                </button>
                <button
                    className="thumbnailSlider__arrow thumbnailSlider__arrow--next"
                    onClick={scrollNext}
                    aria-label="Next slide"
                >
                    <img src="https://docs.jindalsteel.in/document/124/1769843887_next-arrow.png" alt="" />
                </button>
            </div>

            {/* CONDITIONAL NAVIGATION */}
            {
                device !== "mobile" && (
                    <div className={`thumbnailSlider__${thumbnails ? "thumb" : "dots"}`}>
                        {slides.map((slide, index) => {
                            return (
                                thumbnails ? (
                                    <Image
                                        src={slide.image}
                                        alt="alt"
                                        width={50}
                                        height={29}
                                        key={index}
                                        className={`thumbnailSlider__thumb-thumbnail ${index === selectedIndex ? "is-selected" : ""}`}
                                        onClick={() => scrollTo(index)}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ) : (
                                    <button
                                        key={index}
                                        className={`thumbnailSlider__dot ${index === selectedIndex ? "active" : ""}`}
                                        onClick={() => scrollTo(index)}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                )
                            )
                        })}
                    </div>
                )
            }
        </div>
    );
}

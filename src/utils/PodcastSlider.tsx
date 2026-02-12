"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";

type Slide = {
    id: number;
    title: string;
    youtubeUrl: string;
    children: React.ReactNode;
};

interface SlideItemProps {
    title: string;
    youtubeurl: string;
    children: React.ReactNode;
}

interface PodcastSliderProps {
    data: React.ReactNode;
}


const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const PodcastSlider = (props: PodcastSliderProps) => {
    const { data: slideData } = props;

    const slides = useMemo<Slide[]>(() => {
        return React.Children.toArray(slideData)
            .filter((item): item is React.ReactElement<SlideItemProps> =>
                React.isValidElement(item) && !!(item.props as SlideItemProps).title
            )
            .map((item, index) => ({
                id: index + 1,
                title: item.props.title,
                youtubeUrl: item.props.youtubeurl,
                children: item.props.children
            }));
    }, [slideData]);

    console.log(slides);
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "center",
        },
        [
            Autoplay({
                delay: 4000,
                stopOnInteraction: true,
            }),
        ]
    );

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

    const openModal = (url: string) => {
        const videoId = getYouTubeId(url);
        if (videoId) {
            setSelectedVideoId(videoId);
            setIsModalOpen(true);
            document.body.classList.add("modal-open");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVideoId(null);
        document.body.classList.remove("modal-open");
    };

    const scrollPrev = useCallback(() => {
        emblaApi?.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        emblaApi?.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback(
        (index: number) => emblaApi?.scrollTo(index),
        [emblaApi]
    );

    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        };

        onSelect();
        emblaApi.on("select", onSelect);
    }, [emblaApi]);

    return (
        <div className="podcast-slider">

            {/* Arrows */}
            <button
                className="podcast-slider__arrow podcast-slider__arrow--prev"
                onClick={scrollPrev}
            >
                <ChevronLeft color="#fff" />
            </button>

            <button
                className="podcast-slider__arrow podcast-slider__arrow--next"
                onClick={scrollNext}
            >
                <ChevronRight color="#fff" />
            </button>

            {/* Embla */}
            <div className="podcast-slider__viewport" ref={emblaRef}>
                <div className="podcast-slider__container">

                    {slides.map((slide: Slide) => (
                        <div className="podcast-slider__slide" key={slide.id}>
                            <div className="podcast-slider__card">
                                {slide.children}
                                <div
                                    className="podcast-slider__card-play"
                                    onClick={() => openModal(slide.youtubeUrl)}
                                >
                                    <Play color="#fff" />
                                </div>
                            </div>

                            <div className="podcast-slider__caption">
                                {slide.title}
                            </div>
                        </div>
                    ))}

                </div>
            </div>
            {/* YouTube Modal Portal */}
            {isModalOpen && createPortal(
                <div className={`c-modal bgtransparent active`} data-lenis-ignore>
                    <div className="podcast-slider__modal-content">
                        {selectedVideoId && (
                            <div className="podcast-slider__video-wrapper">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}
                        <button className="modle-cls-btn podcastclose" onClick={closeModal}>
                            <div className="close-btn">
                                <X color="#fff" />
                            </div>
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
export default PodcastSlider;
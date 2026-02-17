"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Play, X } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface PodcastSliderProps {
    postData?: any[];
    data?: React.ReactNode;
    autoplay?: boolean | string;
}

const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const PodcastSlider = (props: PodcastSliderProps) => {
    const { postData, autoplay } = props;

    const isAutoplayEnabled = autoplay === true || autoplay === "true";

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "center",
        },
        isAutoplayEnabled ? [
            Autoplay({
                delay: 4000,
                stopOnInteraction: true,
            }),
        ] : []
    );

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [displayItem, setDisplayItem] = useState(postData?.[0]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const prevIndexRef = useRef(0);

    // Sync displayItem if postData changes or initial load
    useEffect(() => {
        if (postData?.length && !displayItem) {
            setDisplayItem(postData[0]);
        }
    }, [postData, displayItem]);

    const openModal = (url: string) => {
        const videoId = getYouTubeId(url || "");
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

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        // Trigger immediately on select for faster feedback
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
        emblaApi.on("select", onSelect);
        return () => { emblaApi.off("select", onSelect); };
    }, [emblaApi]);

    // GSAP Animation Logic
    useGSAP(() => {
        if (!postData?.length) return;

        // Skip animation on initial mount
        if (prevIndexRef.current === selectedIndex && displayItem) return;

        const newItem = postData[selectedIndex];
        setIsTransitioning(true);

        const tl = gsap.timeline({
            onComplete: () => {
                setDisplayItem(newItem);
                prevIndexRef.current = selectedIndex;
                setIsTransitioning(false);
            }
        });

        // Exit Animation (Fade out current) - Made faster (0.2s)
        tl.to(".js-sync-content", {
            opacity: 0,
            y: -15,
            duration: 0.2,
            ease: "power2.in"
        });

    }, { dependencies: [selectedIndex], scope: containerRef });

    useGSAP(() => {
        if (!displayItem) return;

        // Entry Animation (Fade in new) - Made snappier (0.4s)
        gsap.fromTo(".js-sync-content",
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.08 }
        );

    }, { dependencies: [displayItem], scope: containerRef });

    return (
        <div className="row align-items-center mb-100" ref={containerRef}>
            <div className="col-lg-6">
                <div className="c-podcast__wrapper-content pr-77">
                    <div className="hw">
                        <h3 className="c-heading-40 clr-blue ft_semiBold mb-55 js-sync-content">
                            {displayItem?.title}
                        </h3>

                        <div className="genric__content js-sync-content">
                            <p className="c-content-19 clr-secondry">
                                {displayItem?.content}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-lg-6">
                <div className="podcast-slider">
                    <div className="podcast-slider__viewport" ref={emblaRef}>
                        <div className="podcast-slider__container">
                            {postData?.map((item: any, index: number) => (
                                <div className="podcast-slider__slide" key={item.id || index}>
                                    <div className="podcast-slider__card">
                                        <img
                                            alt={item?.title || "Slide"}
                                            className="podcast-slider__image"
                                            src={item?.media?.[0]?.cdnPath}
                                        />
                                        <div
                                            className="podcast-slider__card-play"
                                            onClick={() => openModal(item.metaInfo?.youtube_link)}
                                        >
                                            <Play color="#fff" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="podcast-slider__buttons">
                        <button className="podcast-slider__arrow podcast-slider__arrow--prev" onClick={scrollPrev}>
                            <img src="https://docs.jindalsteel.in/document/124/1761379695_Arrow1Stroke1.png" alt="Prev" />
                        </button>
                        <button className="podcast-slider__arrow podcast-slider__arrow--next" onClick={scrollNext}>
                            <img src="https://docs.jindalsteel.in/document/124/1761379695_Arrow1Stroke1.png" alt="Next" />
                        </button>
                    </div>

                    {isModalOpen && createPortal(
                        <div className="c-modal bgtransparent active" data-lenis-ignore>
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
            </div>
        </div>
    );
};

export default PodcastSlider;
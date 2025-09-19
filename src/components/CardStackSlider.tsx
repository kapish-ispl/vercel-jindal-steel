"use client";

import React, { useEffect, useRef, useState } from "react";

// Card type and cardData array remain the same
type Card = {
    id: number;
    title: string;
    content: string;
    videoUrl?: string;
    imageUrl?: string;
};

const cardData: Card[] = [
    {
        id: 1,
        title: "Paid Search & Shopping",
        content: "Driving measurable growth through meticulous campaign management.",
        videoUrl: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1710498881ForWebSite1.mp4",
    },
    {
        id: 2,
        title: "Creative & Content",
        content: "Crafting compelling narratives and visuals that resonate with your audience.",
        videoUrl: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1710498881ForWebSite1.mp4",
    },
    {
        id: 3,
        title: "Marketing Analytics",
        content: "Leveraging data to uncover insights and inform strategic decisions.",
        videoUrl: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1710498881ForWebSite1.mp4",
    },
    {
        id: 4,
        title: "Paid Social & Influencer",
        content: "Engaging communities and driving conversions through targeted social campaigns.",
        videoUrl: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1710498881ForWebSite1.mp4",
    },
    {
        id: 5,
        title: "Email Marketing",
        content: "Building lasting relationships through personalized email campaigns.",
        videoUrl: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1710498881ForWebSite1.mp4",
    },
];

// ✅ Memoized CardItem component to avoid unnecessary re-renders
const CardItem = React.memo(function CardItem({
    card,
    index,
    activeIndex,
    onClick,
    videoRef,
}: {
    card: Card;
    index: number;
    activeIndex: number;
    onClick: () => void;
    videoRef: (el: HTMLVideoElement | null) => void;
}) {
    const totalCards = cardData.length;
    let offset = index - activeIndex;
    if (offset > totalCards / 2) offset -= totalCards;
    else if (offset < -totalCards / 2) offset += totalCards;

    const absOffset = Math.abs(offset);

    const dynamicStyles: React.CSSProperties = {
        "--tx": `${offset * 20}%`,
        "--scale": 1 - absOffset * 0.15,
        "--tz": `-${absOffset * 100}px`,
        "--rotateY": `${offset * -4}deg`,
        "--zIndex": totalCards - absOffset,
        "--bg-image": card.imageUrl ? `url(${card.imageUrl})` : "none",
    } as React.CSSProperties;

    return (
        <div className="card-item" style={dynamicStyles} onClick={onClick}>
            {card.videoUrl ? (
                <video
                    ref={videoRef}
                    src={card.videoUrl}
                    muted
                    playsInline
                    loop={index === activeIndex} // ✅ Only loop the active video
                    className="card-item__background"
                />
            ) : (
                <div className="card-item__background" />
            )}
            {index !== activeIndex && <div className="card-item__overlay" />}
        </div>
    );
});

export default function CardStackSlider({ props }: any) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [autoplayDirection, setAutoplayDirection] = useState(1);

    const autoplayInterval = useRef<NodeJS.Timeout | null>(null);
    const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    const resumeAutoplayAfterDelay = () => {
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        inactivityTimer.current = setTimeout(() => {
            setIsPaused(false);
        }, 4000);
    };

    useEffect(() => {
        videoRefs.current = videoRefs.current.slice(0, cardData.length);
        return () => {
            if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        };
    }, []);

    const handleCardClick = (index: number) => {
        setIsPaused(true);
        setActiveIndex(index);
        resumeAutoplayAfterDelay();
    };

    const handlePrev = () => {
        setIsPaused(true);
        setActiveIndex((prev) => (prev - 1 + cardData.length) % cardData.length);
        resumeAutoplayAfterDelay();
    };

    const handleNext = () => {
        setIsPaused(true);
        setActiveIndex((prev) => (prev + 1) % cardData.length);
        resumeAutoplayAfterDelay();
    };

    const handleMouseEnter = () => {
        setIsPaused(true);
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };

    const handleMouseLeave = () => {
        setIsPaused(false); // Resume autoplay immediately
    };

    // ✅ Autoplay loop
    useEffect(() => {
        if (!isPaused) {
            autoplayInterval.current = setInterval(() => {
                setActiveIndex((prevIndex) => (prevIndex + 1) % cardData.length);
            }, 5000);
        }
        return () => {
            if (autoplayInterval.current) clearInterval(autoplayInterval.current);
        };
    }, [isPaused]);

    // ✅ Handle direction (optional for future reverse scrolling)
    useEffect(() => {
        if (!isPaused) {
            if (activeIndex >= cardData.length - 1) {
                setAutoplayDirection(-1);
            } else if (activeIndex <= 0) {
                setAutoplayDirection(1);
            }
        }
    }, [activeIndex, isPaused]);

    // ✅ Controlled video playback for active card
    useEffect(() => {
        videoRefs.current.forEach((video, i) => {
            if (!video) return;

            if (i === activeIndex) {
                const playVideo = () => {
                    video.play().catch((error) => {
                        console.warn("Autoplay failed:", error);
                    });
                };

                if (video.readyState >= 2) {
                    playVideo();
                } else {
                    video.addEventListener("loadeddata", playVideo, { once: true });
                }
            } else {
                video.pause();
                video.currentTime = 0;
            }
        });
    }, [activeIndex]);

    return (
        <div className="card-stack-slider-container">
            <div
                className="card-stack-visual"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="card-stack-visual__perspective-root">
                    {cardData.map((card, i) => (
                        <CardItem
                            key={card.id}
                            card={card}
                            index={i}
                            activeIndex={activeIndex}
                            onClick={() => handleCardClick(i)}
                            videoRef={(el) => {
                                videoRefs.current[i] = el;
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="card-controls">
                <button onClick={handlePrev} className="card-controls__button left">
                    {/* <button onClick={handlePrev} className="card-controls__button" disabled={activeIndex === 0}> */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                        <path
                            fillRule="evenodd"
                            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                        />
                    </svg>
                </button>

                <div className="card-controls__content-text">
                    <p key={activeIndex} className="animate-fade-in">
                        {cardData[activeIndex].content}
                    </p>
                </div>

                <button onClick={handleNext} className="card-controls__button right">
                    {/* <button onClick={handleNext} className="card-controls__button" disabled={activeIndex === cardData.length - 1}> */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                        <path
                            fillRule="evenodd"
                            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}

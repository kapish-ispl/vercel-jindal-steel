"use client";
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
const CardSlider = () => {
    const images = [
        {
            src: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1710498881ForWebSite1.mp4",
            caption: "India's Only Syngas Based Coal Classification Plant for Steel Making",
        },
        {
            src: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1710498881ForWebSite1.mp4",
            caption: "Sustainable Energy Solutions for Future",
        },
        {
            src: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1710498881ForWebSite1.mp4",
            caption: "Innovative Green Technology Applications",
        },
        {
            src: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1710498881ForWebSite1.mp4",
            caption: "Towards Cleaner Industrial Growth",
        },
        {
            src: "https://d2lptvt2jijg6f.cloudfront.net/jspsteelpower20/custom/1710498881ForWebSite1.mp4",
            caption: "Advanced Renewable Energy Systems",
        },
    ];
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto play every 5s
    useEffect(() => {
        const interval = setInterval(() => {
            goToNext();
        }, 5000);
        return () => clearInterval(interval);
    }, [activeIndex]);

    const goToPrevious = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setActiveIndex((prevIndex) =>
            (prevIndex + 1) % images.length
        );
    };

    const handleCardClick = (index: number) => {
        if (index === activeIndex) return;
        setActiveIndex(index);
    };

    const getOffset = (index: number) => {
        const total = images.length;
        let offset = index - activeIndex;

        // Ensure proper circular behavior
        if (offset > Math.floor(total / 2)) {
            offset -= total;
        } else if (offset < -Math.floor(total / 2)) {
            offset += total;
        }

        return offset;
    };
    return (
        <>
            <div className="carousel-wrapper">

                <div className="carousel-with-buttons">
                    {/* Left navigation button */}
                    <button className="nav-button left" onClick={goToPrevious}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                    </button>

                    <div className="carousel-container">
                        <AnimatePresence>
                            {images.map((item, index) => {
                                const offset = getOffset(index);
                                const absOffset = Math.abs(offset);
                                const isActive = index === activeIndex;

                                const spread = 60;
                                const depth = 20;

                                return (
                                    <motion.div
                                        key={index}
                                        className="card"
                                        onClick={() => handleCardClick(index)}
                                        initial={{ opacity: 0, x: offset > 0 ? 300 : -300 }}
                                        animate={{
                                            opacity: 1 - absOffset * 0.2,
                                            x: offset * spread,
                                            scale: 1 - absOffset * 0.1,
                                            zIndex: 100 - absOffset,
                                            filter: `blur(${absOffset * 1}px)`,
                                        }}
                                        exit={{ opacity: 0, x: offset > 0 ? 300 : -300 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        style={{
                                            transformOrigin: "center",
                                        }}
                                    >
                                        <div className="image-container">
                                            <video loop={true} muted={true} autoPlay={true} playsInline={true} className={`c-homeSection__people-video cus-shadow`}>
                                                <source src={item.src} type="video/mp4" />
                                            </video>
                                            {/* <img src={item.src} alt={`card-${index}`} /> */}
                                        </div>
                                        {/* Only show caption for active image */}
                                        {isActive && (
                                            <div className="caption-container">
                                                <p className="caption">{item.caption}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Right navigation button */}
                    <button className="nav-button right" onClick={goToNext}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                    </button>
                </div>

                {/* Dots indicator */}
                {/* <div className="dots-container">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            className={`dot ${i === activeIndex ? "active" : ""}`}
                            onClick={() => setActiveIndex(i)}
                        />
                    ))}
                </div> */}
            </div>
        </>
    )
}

export default CardSlider

"use client";

import React, { useState, useEffect, useRef } from 'react';

const slides = [
  {
    id: 1,
    image: "https://docs.jindalsteel.in/document/124/1773926100_Rectangle669.png",
    title: "Board of Directors",
    description: "Provides strategic direction and oversight on sustainability priorities, risk exposure and long-term commitments.",
  },
  {
    id: 2,
    image: "https://docs.jindalsteel.in/document/124/1773926213_075808c619905589d7ad763fdad89048a4221757.png",
    title: "ESG / Sustainability Oversight",
    description: "Reviews performance indicators, monitors risk integration and ensures alignment with regulatory and reporting requirements.",
  },
  {
    id: 3,
    image: "https://docs.jindalsteel.in/document/124/1773926212_51c5dbc70b361e73d47450806bcedd2eef8d57fa.png",
    title: "Executive Leadership",
    description: "Implements sustainability policies, operational targets and internal performance systems.",
  },
  {
    id: 4,
    image: "https://docs.jindalsteel.in/document/124/1773926212_4a195d42704787b01dd089412cdda2c36af40f5f.png",
    title: "Operational Teams",
    description: "Execute sustainability initiatives across manufacturing facilities and monitor day-to-day compliance.",
  }
];

const HighlightCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPaused) return;
    const duration = 5000;
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((current) => (current + 1) % slides.length);
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [activeIndex, isPaused]);

  return (
    <div className="nu-carousel">
      <div className="nu-carousel__container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`nu-carousel__item ${index === activeIndex ? 'is-active' : ''}`}
            onClick={() => { setActiveIndex(index); setProgress(0); }}
          >
            <div className="nu-carousel__image-wrapper">
              <img src={slide.image} alt={slide.title} />
              <div className="nu-carousel__overlay" />
            </div>

            <div className="nu-carousel__content">
              <div className="nu-carousel__pill c-content-32 clr-white ft_medium mb-3">
                {slide.title}
              </div>
              <p className="nu-carousel__desc c-content-20 clr-white ft_light lh_1-6 mb-0">{slide.description}</p>

            </div>
          </div>
        ))}
      </div>

      <div className="nu-carousel__controls">
        <div className="nu-carousel__indicators">
          {slides.map((_, index) => (
            <div key={index} className="nu-carousel__track" onClick={() => { setActiveIndex(index); setProgress(0); }}>
              <div
                className="nu-carousel__fill"
                style={{ width: index === activeIndex ? `${progress}%` : index < activeIndex ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>
        <button className="nu-carousel__pause" onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? '▶' : '||'}
        </button>
      </div>
    </div>
  );
};

export default HighlightCarousel;
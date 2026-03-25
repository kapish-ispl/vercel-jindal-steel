"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';

// const slides = [
//   {
//     id: 1,
//     image: "https://docs.jindalsteel.in/document/124/1773926100_Rectangle669.png",
//     title: "Board of Directors",
//     description: "Provides strategic direction and oversight on sustainability priorities, risk exposure and long-term commitments.",
//   },
//   {
//     id: 2,
//     image: "https://docs.jindalsteel.in/document/124/1773926213_075808c619905589d7ad763fdad89048a4221757.png",
//     title: "ESG / Sustainability Oversight",
//     description: "Reviews performance indicators, monitors risk integration and ensures alignment with regulatory and reporting requirements.",
//   },
//   {
//     id: 3,
//     image: "https://docs.jindalsteel.in/document/124/1773926212_51c5dbc70b361e73d47450806bcedd2eef8d57fa.png",
//     title: "Executive Leadership",
//     description: "Implements sustainability policies, operational targets and internal performance systems.",
//   },
//   {
//     id: 4,
//     image: "https://docs.jindalsteel.in/document/124/1773926212_4a195d42704787b01dd089412cdda2c36af40f5f.png",
//     title: "Operational Teams",
//     description: "Execute sustainability initiatives across manufacturing facilities and monitor day-to-day compliance.",
//   }
// ];

const HighlightCarousel = ({ data, props }: any) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePrev = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
    setProgress(0);
  };

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

  const slides = useMemo(() => {
    if (!data) return [];

    return React.Children.toArray(data)
      .filter(
        (child): child is React.ReactElement<any> =>
          React.isValidElement(child) &&
          typeof (child.props) !== "undefined"
      )
      .map((child, index) => ({
        id: index + 1,
        child: child?.props?.children,
        image: child?.props?.imgsrc,
        title: child?.props?.title,
      }));
  }, [data]);


  return (
    <>
      <div className="row">
        <div className="col-12 col-lg-9">
          <div className="hw mb-40">
            <div>
              <div className="c-heading-60 ft_regular clr-gray lh_1-1 mb-40">Governance Structure</div>

              <p className="c-content-24 lh_1-6 ft_light clr-gray">Sustainability oversight is embedded within the
                company&rsquo;s governance framework, with defined roles to ensure accountability and
                performance monitoring.</p>
            </div>
            <div>
              <button className="nu-carousel__arrow nu-carousel__arrow--prev" onClick={handlePrev} aria-label="Previous slide">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button className="nu-carousel__arrow nu-carousel__arrow--next" onClick={handleNext} aria-label="Next slide">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="nu-carousel">
        <div className="nu-carousel__container">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`nu-carousel__item ${index === activeIndex ? 'is-active' : ''}`}
              onClick={() => { setActiveIndex(index); setProgress(0); }}
            >
              <div className="nu-carousel__image-wrapper">
                <img src={slide.image} alt={`img-${slide.id}`} />
                <div className="nu-carousel__overlay" />
              </div>
              <div className="adjustable__card-items-floatText">
                <h1 className="c-heading-80 ft_regular lh_1-1 clr-white">{slide.title}</h1>
              </div>
              <div className="text-float">
                <h1 className="c-heading-80 ft_regular lh_1-1 clr-white">{slide.title + "."}</h1>
              </div>
              {slide.child}
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
    </>
  );
};

export default HighlightCarousel;
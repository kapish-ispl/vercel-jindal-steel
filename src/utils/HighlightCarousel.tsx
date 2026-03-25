"use client";

import React, { useState, useEffect, useMemo } from "react";

const HighlightCarousel = (props: any) => {
  // ✅ Handle CMS weird structure
  const sectitle = props?.sectitle || props?.props?.sectitle;
  const secdesc = props?.secdesc || props?.props?.secdesc;

  // ✅ CMS may pass children OR data
  const children = props?.children || props?.data;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // ✅ Parse slides safely
  const slides = useMemo(() => {
    if (!children) return [];

    return React.Children.toArray(children)
      .filter((child) => React.isValidElement(child))
      .map((child: any, index) => {
        const p = child.props || {};

        return {
          id: index + 1,
          child: p.children || null,
          image: p.imgsrc || "",
          title: p.title || "",
        };
      });
  }, [children]);

  // ✅ Navigation
  const handlePrev = () => {
    if (!slides.length) return;
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const handleNext = () => {
    if (!slides.length) return;
    setActiveIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  // ✅ Auto slider
  useEffect(() => {
    if (isPaused || !slides.length) return;

    const duration = 5000;
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((curr) => (curr + 1) % slides.length);
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [activeIndex, isPaused, slides.length]);


  return (
    <>
      {/* ✅ Dynamic Header */}
      <div className="row position-relative">
        <div className="col-10 col-lg-9">
          <div className="hw mb-40">
            <div>
              {sectitle && (
                <div className="c-heading-60 ft_regular clr-gray lh_1-1 mb-40">
                  {sectitle}
                </div>
              )}

              {secdesc && (
                <p className="c-content-24 lh_1-6 ft_light clr-gray">
                  {secdesc}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="button__control">
            <button
              className="nu-carousel__arrow nu-carousel__arrow--prev"
              onClick={handlePrev}
            >
              ‹
            </button>

            <button
              className="nu-carousel__arrow nu-carousel__arrow--next"
              onClick={handleNext}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* ❌ If no slides */}
      {!slides.length && (
        <div style={{ padding: "20px" }}>No data from CMS</div>
      )}

      {/* ✅ Carousel */}
      {slides.length > 0 && (
        <div className="nu-carousel">
          <div className="nu-carousel__container">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`nu-carousel__item ${index === activeIndex ? "is-active" : ""
                  }`}
                onClick={() => {
                  setActiveIndex(index);
                  setProgress(0);
                }}
              >
                <div className="nu-carousel__image-wrapper">
                  {slide.image && (
                    <img src={slide.image} alt={`img-${slide.id}`} />
                  )}
                  <div className="nu-carousel__overlay" />
                </div>

                {/* ✅ Title */}
                {slide.title && (
                  <>
                    <div className="adjustable__card-items-floatText">
                      <h1 className="c-heading-80 clr-white">
                        {slide.title}
                      </h1>
                    </div>

                    <div className="text-float">
                      <h1 className="c-heading-80 clr-white">
                        {slide.title}.
                      </h1>
                    </div>
                  </>
                )}

                {/* ✅ Inner CMS content */}
                {slide.child}
              </div>
            ))}
          </div>

          {/* ✅ Indicators */}
          <div className="nu-carousel__controls">
            <div className="nu-carousel__indicators">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className="nu-carousel__track"
                  onClick={() => {
                    setActiveIndex(index);
                    setProgress(0);
                  }}
                >
                  <div
                    className="nu-carousel__fill"
                    style={{
                      width:
                        index === activeIndex
                          ? `${progress}%`
                          : index < activeIndex
                            ? "100%"
                            : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            <button
              className="nu-carousel__pause"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? "▶" : "||"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HighlightCarousel;
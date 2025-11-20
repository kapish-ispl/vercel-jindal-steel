"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";

const SLIDE_DURATION = 3000;

export default function CategorySlider({
  data,
  hidecategory = "false",
  hidelabel = "false",
}: any) {
  const categories = useMemo(() => {
    return (
      data?.flatMap((item: any) => {
        if (
          !item ||
          !item.props ||
          !item.props.category ||
          !item.props.children
        ) {
          return [];
        }
        const categoryName = item.props.category;
        const categoryThumb = item.props.thumb;

        const children = item.props.children;
        const childrenArray = Array.isArray(children) ? children : [children];
        const slidesWithProps = childrenArray.filter(
          (child: any) => child && child.props != undefined
        );

        return [
          {
            name: categoryName,
            thumb: categoryThumb,
            slides: slidesWithProps,
          },
        ];
      }) ?? []
    );
  }, [data]);

  // ✅ LOOP ENABLED AGAIN
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true }, // optional duration (ms)
    [Fade()] // 👈 enable fade plugin
  );

  const [currentCat, setCurrentCat] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState<number[]>(() =>
    categories.map(() => 0)
  );
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [localSlideIndex, setLocalSlideIndex] = useState(0);
  const [restartToken, setRestartToken] = useState(0);
  const stepRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slides = useMemo(() => {
    return (
      categories?.flatMap((categoryElement: any) => {
        const categoryName = categoryElement.name;
        const categoryThumbnail = categoryElement.thumb;
        const children = categoryElement.slides;
        return children.map((childElement: any) => ({
          name: categoryName,
          thumbnail: categoryThumbnail,
          children: childElement,
        }));
      }) ?? []
    );
  }, [categories]);

  // --- AUTOPLAY EFFECT ---
  useEffect(() => {
    if (!emblaApi || isPaused) return;

    const playSlides = () => {
      if (!emblaApi || categories.length === 0) return;

      const cat = categories[currentCat];
      if (!cat) return;

      const slidesCount = cat.slides.length;
      if (slidesCount === 0) return;

      const totalCatDuration = slidesCount * SLIDE_DURATION;
      const stepTime = 100;
      const totalSteps = totalCatDuration / stepTime;
      let step = stepRef.current; // ✅ resume from stored progress

      if (!isPaused) {
        timerRef.current = setInterval(() => {
          step++;
          stepRef.current = step; // ✅ store latest progress before pause
          const catProgress = Math.min((step / totalSteps) * 100, 100);

          setProgress((prevProgress) => {
            const newProgress = [...prevProgress];
            newProgress[currentCat] = catProgress;
            return newProgress;
          });

          // Move to next slide after each duration
          if (step % (SLIDE_DURATION / stepTime) === 0) {
            emblaApi?.scrollNext();
          }

          // When category progress is complete
          if (catProgress >= 100) {
            clearInterval(timerRef.current!);
            stepRef.current = 0; // ✅ reset for next category

            setProgress((prevProgress) => {
              const newProgress = [...prevProgress];
              newProgress[currentCat] = 100;
              return newProgress;
            });

            // ✅ LOOP AGAIN after last category
            if (currentCat < categories.length - 1) {
              setCurrentCat((prev) => prev + 1);
            } else {
              setTimeout(() => {
                setProgress(categories.map(() => 0));
                setCurrentCat(0);
                stepRef.current = 0; // reset fully
              }, 500);
            }
          }
        }, stepTime);
      }
    };

    playSlides();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentCat, emblaApi, restartToken, categories, isPaused]);

  // Scroll to first slide of active category
  useEffect(() => {
    if (!emblaApi) return;
    const index = categories
      .slice(0, currentCat)
      .reduce((acc: any, cat: any) => acc + cat.slides.length, 0);
    emblaApi.scrollTo(index);
  }, [currentCat, emblaApi, categories]);

  // Track current slide and category
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const globalSlideIndex = emblaApi.selectedScrollSnap();
      setCurrentSlideIndex(globalSlideIndex);

      let slideCount = 0;
      let foundCategoryIndex = 0;
      let localSlideIndex = 0;

      if (categories.length === 0) return;

      for (let i = 0; i < categories.length; i++) {
        const categorySlideCount = categories[i].slides.length;
        if (categorySlideCount === 0) continue;

        if (globalSlideIndex < slideCount + categorySlideCount) {
          foundCategoryIndex = i;
          localSlideIndex = globalSlideIndex - slideCount;
          break;
        }
        slideCount += categorySlideCount;
      }

      setActiveCategoryIndex(foundCategoryIndex);
      setLocalSlideIndex(localSlideIndex);
    };

    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, categories]);

  useEffect(() => {
    const wrapper = document.querySelector(".progress-wrapper");
    if (!wrapper) return;

    const handleMouseEnter = () => {
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleMouseLeave = () => {
      setIsPaused(false); // resume using stored progress
    };

    wrapper.addEventListener("mouseenter", handleMouseEnter);
    wrapper.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      wrapper.removeEventListener("mouseenter", handleMouseEnter);
      wrapper.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);



  // Handle category click
  const handleCategoryClick = (index: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const newProgress = categories.map((_: any, i: number) =>
      i < index ? 100 : 0
    );
    setProgress(newProgress);

    setCurrentCat(index);
    setRestartToken((t) => t + 1);

    const slideIndex = categories
      .slice(0, index)
      .reduce((acc: any, cat: any) => acc + cat.slides.length, 0);
    emblaApi?.scrollTo(slideIndex);
  };

  // --- EMBLA UI ---
  const carouselUi = useMemo(
    () => (
      <div className="embla" ref={emblaRef}>
        <div className="embla__container" style={{ display: "flex", overflow: "hidden" }}>
          {slides.map((slide: any, i: number) => (
            <div
              key={i}
              className={`embla__slide ${i === currentSlideIndex ? "active" : ""
                }`}
              style={{
                flex: "0 0 100%",
              }}
            >
              {slide.children}
            </div>
          ))}
        </div>
      </div>
    ),
    [emblaRef, slides, currentSlideIndex]
  );

  const activeCategorySlides = categories[activeCategoryIndex]?.slides || [];
  return (
    <>
      <div className="position-relative">
        {/* --- SECTION 1: CAROUSEL + DOTS --- */}
        <div style={{ position: "relative" }}>
          {carouselUi}
          {activeCategorySlides.length > 1 && (
            <div
              className="dots-container c-dots"
              style={{
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                zIndex: 10,
                // background: "rgba(255,255,255,0.7)",
                padding: "8px",
              }}
            >
              {activeCategorySlides.map((item: any, slideIdx: number) => {
                return (
                  <>
                    <div className="dots-container-wrapper">
                      <span>{item.props.label}</span>
                      <span
                        key={slideIdx}
                        className={`dot ${slideIdx === localSlideIndex ? "active" : ""
                          }`}
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          display: "inline-block",
                          backgroundColor:
                            slideIdx === localSlideIndex ? "#0070f3" : "#e5e5e5",
                          transition: "background-color 0.3s ease",
                        }}
                      ></span>

                    </div>
                  </>

                )
              })}
            </div>
          )}
        </div>

        {/* --- SECTION 2: PROGRESS BARS --- */}
        <div className="progress-wrapper">
          <div className="progress-wrapper-conatiner">
            <div className="container cus-container">
              <div className="row">
                <div className="col-12 d-flex gap-50">
                  {categories.map((cat: any, index: number) => (
                    <div
                      className={`progress-tile ${index === currentCat ? "active" : ""}`}
                      key={index}
                      onClick={() => handleCategoryClick(index)}
                      style={{ cursor: "pointer", marginBottom: "10px", transition: "transform 0.3s ease" }}
                    >
                      {hidelabel !== "true" && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 6,
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <span>{cat.name}</span>
                          </div>
                          <span className="category-thumb">
                            <img src={cat.thumb} alt={cat.name} className="img-fluid" />
                          </span>
                          {/* <span>{progress[index].toFixed(0)}%</span> */}
                        </div>
                      )}

                      {hidecategory !== "true" && (
                        <div
                          style={{
                            height: "1.5px",
                            background: "#6b728080",
                            borderRadius: "99px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${progress[index]}%`,
                              background:
                                index === currentCat
                                  ? "#f47920"
                                  : "#6b728080",
                              transition: "width 0.1s linear",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="progress-wrapper-bottomSpacer"></div>
      </div>
    </>
  );
}

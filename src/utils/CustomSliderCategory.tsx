"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  ReactNode,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";

const SLIDE_DURATION = 3000;

/* ---------------------------------------------
   TYPES
---------------------------------------------- */
export interface CategoryItemElementProps {
  category: string;
  thumb?: string;
  label?: string;
  children: ReactNode | ReactNode[];
  name: string;
}

export type CategorySlide = React.ReactElement<CategoryItemElementProps>;

interface CategorySlides {
  name: string;
  thumb?: string;
  slides: CategorySlide[];
}

interface FlatSlide {
  name: string;
  thumbnail?: string;
  children: ReactNode;
}


interface CategorySliderProps {
  data: any[];
  hidecategory?: boolean | string;
  hidelabel?: boolean | string;
}

/* ---------------------------------------------
   COMPONENT
---------------------------------------------- */

export default function CategorySlider({ data, hidecategory = "false", hidelabel = "false", }: CategorySliderProps) {
  /* -------------------------------
      NORMALIZED BOOLEAN FLAGS
  -------------------------------- */

  const hideCategoryBool = hidecategory === true || hidecategory === "true";
  const hideLabelBool = hidelabel === true || hidelabel === "true";

  /* -------------------------------
      PARSE CATEGORY DATA SAFELY
  -------------------------------- */
  const categories: CategorySlides[] = useMemo(() => {
    return (
      data?.flatMap((item): CategorySlides[] => {
        // Ensure TS knows the prop types
        if (!React.isValidElement<CategoryItemElementProps>(item)) return [];

        const { category, thumb, children } = item.props;
        if (!category || !children) return [];

        const childrenArray = Array.isArray(children)
          ? children
          : [children];

        // Filter only valid slide elements
        const slides = childrenArray.filter(
          (child): child is CategorySlide =>
            React.isValidElement(child) && child.props !== undefined
        );

        return [
          {
            name: category,
            thumb: thumb,
            slides,
          },
        ];
      }) ?? []
    );
  }, [data]);


  /* -------------------------------
      EMBLA CAROUSEL
  -------------------------------- */
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Fade()]
  );

  /* -------------------------------
      STATE
  -------------------------------- */
  const [currentCat, setCurrentCat] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState<number[]>(
    () => categories.map(() => 0)
  );
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [localSlideIndex, setLocalSlideIndex] = useState(0);
  const [restartToken, setRestartToken] = useState(0);

  // Use correct browser timeout signature
  const stepRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressWrapperRef = useRef<HTMLDivElement>(null);

  /* -------------------------------
      FLATTEN ALL SLIDES
  -------------------------------- */
  const slides: FlatSlide[] = useMemo(() => {
    return (
      categories.flatMap((category) =>
        category.slides.map((child) => ({
          name: category.name,
          thumbnail: category.thumb,
          children: child,
        }))
      ) ?? []
    );
  }, [categories]);

  /* -------------------------------
      AUTOPLAY ENGINE
  -------------------------------- */
  useEffect(() => {
    if (!emblaApi || isPaused) return;

    const playSlides = () => {
      const cat = categories[currentCat];
      if (!cat) return;

      const slidesCount = cat.slides.length;
      if (slidesCount === 0) return;

      const totalCatDuration = slidesCount * SLIDE_DURATION;
      const stepTime = 100;
      const totalSteps = totalCatDuration / stepTime;

      let step = stepRef.current;

      timerRef.current = setInterval(() => {
        step++;
        stepRef.current = step;

        const catProgress = Math.min((step / totalSteps) * 100, 100);

        setProgress((prev) => {
          const copy = [...prev];
          copy[currentCat] = catProgress;
          return copy;
        });

        // Slide change
        if (step % (SLIDE_DURATION / stepTime) === 0) {
          emblaApi.scrollNext();
        }

        // Category complete → move next
        if (catProgress >= 100) {
          clearInterval(timerRef.current!);
          stepRef.current = 0;

          if (currentCat < categories.length - 1) {
            setCurrentCat((x) => x + 1);
          } else {
            // restart full cycle
            setTimeout(() => {
              setProgress(categories.map(() => 0));
              setCurrentCat(0);
              stepRef.current = 0;
              // Critical: increment restart token to force effect restart
              // if only one category exists
              setRestartToken((x) => x + 1);
            }, 500);
          }
        }
      }, stepTime);
    };

    playSlides();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentCat, emblaApi, restartToken, categories, isPaused]);

  /* -------------------------------
      ON CATEGORY CHANGE → SCROLL
  -------------------------------- */
  useEffect(() => {
    if (!emblaApi) return;

    const index = categories
      .slice(0, currentCat)
      .reduce((acc, cat) => acc + cat.slides.length, 0);

    emblaApi.scrollTo(index);
  }, [currentCat, emblaApi, categories]);

  /* -------------------------------
      EMBLA SELECT EVENT
  -------------------------------- */
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const globalSlideIndex = emblaApi.selectedScrollSnap();
      setCurrentSlideIndex(globalSlideIndex);

      let cumulative = 0;
      let foundCategory = 0;
      let foundLocal = 0;

      for (let i = 0; i < categories.length; i++) {
        const count = categories[i].slides.length;

        if (globalSlideIndex < cumulative + count) {
          foundCategory = i;
          foundLocal = globalSlideIndex - cumulative;
          break;
        }

        cumulative += count;
      }

      setActiveCategoryIndex(foundCategory);
      setLocalSlideIndex(foundLocal);
    };

    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, categories]);

  /* -------------------------------
      PAUSE ON HOVER
  -------------------------------- */
  useEffect(() => {
    const wrapper = progressWrapperRef.current;
    if (!wrapper) return;

    const handleEnter = () => {
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleLeave = () => setIsPaused(false);

    wrapper.addEventListener("mouseenter", handleEnter);
    wrapper.addEventListener("mouseleave", handleLeave);

    return () => {
      wrapper.removeEventListener("mouseenter", handleEnter);
      wrapper.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  /* -------------------------------
      SYNC PROGRESS STATE
  -------------------------------- */
  useEffect(() => {
    setProgress(categories.map(() => 0));
  }, [categories]);

  /* -------------------------------
      CATEGORY CLICK
  -------------------------------- */
  const handleCategoryClick = (index: number) => {
    if (timerRef.current) clearInterval(timerRef.current);

    setProgress(categories.map((_, i) => (i < index ? 100 : 0)));

    setCurrentCat(index);
    setRestartToken((x) => x + 1);

    const slideIndex = categories
      .slice(0, index)
      .reduce((acc, cat) => acc + cat.slides.length, 0);

    emblaApi?.scrollTo(slideIndex);
  };

  /* -------------------------------
      EMBLA UI
  -------------------------------- */
  const carouselUi = useMemo(
    () => (
      <div className="embla" ref={emblaRef}>
        <div
          className="embla__container"
          style={{ display: "flex", overflow: "hidden" }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`embla__slide ${i === currentSlideIndex ? "active" : ""
                }`}
              style={{ flex: "0 0 100%" }}
            >
              {slide.children}
            </div>
          ))}
        </div>
      </div>
    ),
    [emblaRef, slides, currentSlideIndex]
  );

  const activeCategorySlides =
    categories[activeCategoryIndex]?.slides || [];

  return (
    <>
      <div className="position-relative">
        {/* CAROUSEL + DOTS */}
        <div style={{ position: "relative" }}>
          {carouselUi}

          {activeCategorySlides.length > 1 && (
            <div
              className="dots-container c-dots"
              style={{
                position: "absolute",
                right: 20,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                zIndex: 10,
                padding: 8,
              }}
            >
              {activeCategorySlides.map((item, idx) => (
                <div key={idx} className="dots-container-wrapper">
                  <span>{(item).props?.label}</span>
                  <span
                    className={`dot ${idx === localSlideIndex ? "active" : ""
                      }`}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      display: "inline-block",
                      backgroundColor:
                        idx === localSlideIndex ? "#0070f3" : "#e5e5e5",
                      transition: "background-color 0.3s",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PROGRESS BARS */}
        <div className="progress-wrapper" ref={progressWrapperRef}>
          <div className="progress-wrapper-conatiner">
            <div className="container cus-container">
              <div className="row">
                <div className="col-12 d-flex flex-column flex-lg-row gap-50">
                  {categories.map((cat, index) => (
                    <div
                      key={index}
                      className={`progress-tile ${index === currentCat ? "active" : ""
                        }`}
                      onClick={() => handleCategoryClick(index)}
                      style={{ cursor: "pointer", marginBottom: 10 }}
                    >
                      {!hideLabelBool && (
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
                            <span className="category-thumb">
                              {cat.thumb && (
                                <img
                                  src={cat.thumb}
                                  alt={cat.name}
                                  className="img-fluid"
                                />
                              )}
                            </span>
                          </div>
                        </div>
                      )}

                      {!hideCategoryBool && (
                        <div
                          style={{
                            height: 1.5,
                            background: "#6b728080",
                            borderRadius: 99,
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

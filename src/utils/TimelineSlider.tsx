"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
// Import your arrow icons (using Lucide or your custom IMG URLs)
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TimelineSliderProps {
  cls?: string;
  customcls?: string;
  items?: number[] | string;
  data?: ReactNode[];
  children?: ReactNode;
  containerWidth?: string;
  bluearrow?: boolean; // logic for arrow color
}

export default function TimelineSlider({
  cls,
  customcls,
  items,
  data,
  children,
  containerWidth = "1440px",
  bluearrow = false,
}: TimelineSliderProps) {

  const parsedItems = useMemo<number[]>(() => {
    try {
      if (typeof items === "string") return JSON.parse(items);
      if (Array.isArray(items)) return items;
      return [1, 1, 1, 1];
    } catch { return [1, 1, 1, 1]; }
  }, [items]);

  const filteredItems: ReactNode[] = useMemo(() => {
    return (
      data?.filter((item) => item !== null && typeof item !== "string") ||
      React.Children.toArray(children).filter(Boolean)
    );
  }, [data, children]);

  const [slidesToShow, setSlidesToShow] = useState(parsedItems[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "center",
    slidesToScroll: 1,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    // Get the number directly from the API and pass it to the setter
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w <= 768) setSlidesToShow(parsedItems[3]);
      else if (w <= 1024) setSlidesToShow(parsedItems[2]);
      else if (w <= 1200) setSlidesToShow(parsedItems[1]);
      else setSlidesToShow(parsedItems[0]);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [parsedItems]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
      setSelectedIndex(emblaApi.selectedScrollSnap());
      emblaApi.on("select", () => setSelectedIndex(emblaApi.selectedScrollSnap()));
    }
  }, [emblaApi, filteredItems, slidesToShow]);

  const progressWidth = filteredItems.length > 1
    ? (selectedIndex / (filteredItems.length - 1)) * 100
    : 100;

  return (
    <div className={`timeline-wrapper ${customcls || ""}`}>

      {/* FLUID PROGRESS LINE */}
      <div className="timeline-fluid-line-container">
        <div className="bg-gray-line" />
        <div className="container-sync" style={{ maxWidth: containerWidth }}>
          <div className="line-filled" style={{ width: `${progressWidth}%` }} />
        </div>
      </div>

      <div className="timeline-main-container" style={{ maxWidth: containerWidth }}>
        <div className="embla-viewport" ref={emblaRef} style={{ overflow: "hidden" }}>
          <div className={`embla-container ${cls || ""}`} style={{ display: "flex" }}>
            {filteredItems.map((item, index) => (
              <div
                key={index}
                className="embla-slide"
                style={{ flex: `0 0 ${100 / (slidesToShow || 1)}%`, minWidth: 0 }}
              >
                <div className="slide-content-buffer">
                  {/* 1. DOT INSIDE BUFFER */}
                  <div className="dot-section">
                    <button
                      className={`timeline-dot ${index === selectedIndex ? "is-active" : ""}`}
                      onClick={() => emblaApi?.scrollTo(index)}
                    >
                      <div className="inner-dot" />
                    </button>
                  </div>
                  <div className="c-timeline__container">
                    {/* 2. CMS CONTENT */}
                    <div className="cms-content-wrapper">
                      {item}
                    </div>

                    {/* 3. ARROWS INSIDE BUFFER */}
                    <div className="slide-navigation">
                      <button
                        className="slide-nav-btn prev"
                        onClick={() => emblaApi?.scrollPrev()}
                        disabled={!emblaApi?.canScrollPrev()}
                      >
                        <ChevronLeft size={24} color={bluearrow ? "#0046ad" : "#666"} />
                      </button>

                      <button
                        className="slide-nav-btn next"
                        onClick={() => emblaApi?.scrollNext()}
                        disabled={!emblaApi?.canScrollNext()}
                      >
                        <ChevronRight size={24} color={bluearrow ? "#0046ad" : "#666"} />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
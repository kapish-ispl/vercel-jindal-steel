"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import gsap from "gsap";

interface CircleSliderProps {
  children?: ReactNode;
}

export default function CircleSlider({ children }: CircleSliderProps) {
  const circleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  const [data, setData] = useState<string[]>([]);

  // ✅ persistent rotation (IMPORTANT)
  const rotationRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const circle = circleRef.current;

    if (!container || !circle) return;

    const items = container.querySelectorAll(".item");
    const total = items.length;

    if (!items.length) return;

    let resizeObserver: ResizeObserver;

    /* ✅ Extract CMS data */
    const extractedData: string[] = [];
    items.forEach((item) => {
      const desc = item.getAttribute("data-desc") || "";
      extractedData.push(desc);
    });
    setData(extractedData);

    /* 🔵 Position items in circle */
    const positionItems = () => {
      const size = container.offsetWidth;
      if (!size) return;

      const center = size / 2;
      const radius = center - 3;

      items.forEach((item, i) => {
        const angle = (360 / total) * i - 90;

        const x = center + radius * Math.cos((angle * Math.PI) / 180);
        const y = center + radius * Math.sin((angle * Math.PI) / 180);

        gsap.set(item, { left: x, top: y });
      });
    };

    /* 🔄 Rotation logic (FIXED) */
    const rotateTo = (
      index: number,
      direction: "next" | "prev" | "direct" = "direct"
    ) => {
      setActive(index);

      items.forEach((item) => item.classList.remove("active"));

      const step = 360 / total;

      if (direction === "next") {
        rotationRef.current -= step; // clockwise
      } else if (direction === "prev") {
        rotationRef.current += step; // anticlockwise
      } else {
        rotationRef.current = -(step * index); // initial/direct
      }

      gsap.to(circle, {
        rotation: rotationRef.current,
        duration: 0.6,
        ease: "power3.inOut",

        onUpdate: () => {
          const rot = gsap.getProperty(circle, "rotation");

          items.forEach((item) => {
            gsap.set(item, { rotation: -Number(rot) });
          });
        },

        onComplete: () => {
          items[index]?.classList.add("active");

          gsap.fromTo(
            descRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5 }
          );
        }
      });
    };

    /* ✅ Init */
    requestAnimationFrame(() => {
      setTimeout(() => {
        positionItems();
        rotateTo(0, "direct");
      }, 100);
    });

    /* ✅ Resize */
    resizeObserver = new ResizeObserver(() => {
      positionItems();
    });
    resizeObserver.observe(container);

    /* 🖱 Click */
    items.forEach((item, index) => {
      item.addEventListener("click", () => rotateTo(index, "direct"));
    });

    /* 🔥 Autoplay (always clockwise) */
    let autoPlay = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % total;
        rotateTo(next, "next");
        return next;
      });
    }, 8000);

    const stop = () => clearInterval(autoPlay);

    const start = () => {
      autoPlay = setInterval(() => {
        setActive((prev) => {
          const next = (prev + 1) % total;
          rotateTo(next, "next");
          return next;
        });
      }, 8000);
    };

    container.addEventListener("mouseenter", stop);
    container.addEventListener("mouseleave", start);

    /* 🔘 Buttons */
    let prevBtn: HTMLElement | null = null;
    let nextBtn: HTMLElement | null = null;

    const handleNext = () => {
      setActive((prev) => {
        const next = (prev + 1) % total;
        rotateTo(next, "next");
        return next;
      });
    };

    const handlePrev = () => {
      setActive((prev) => {
        const next = (prev - 1 + total) % total;
        rotateTo(next, "prev");
        return next;
      });
    };

    const attachButtons = () => {
      prevBtn = document.getElementById("circleprevBtn");
      nextBtn = document.getElementById("circlenextBtn");

      if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", handlePrev);
        nextBtn.addEventListener("click", handleNext);
        return true;
      }
      return false;
    };

    if (!attachButtons()) {
      const interval = setInterval(() => {
        if (attachButtons()) clearInterval(interval);
      }, 500);

      setTimeout(() => clearInterval(interval), 5000);
    }

    /* 🧹 Cleanup */
    return () => {
      resizeObserver.disconnect();
      clearInterval(autoPlay);

      container.removeEventListener("mouseenter", stop);
      container.removeEventListener("mouseleave", start);

      prevBtn?.removeEventListener("click", handlePrev);
      nextBtn?.removeEventListener("click", handleNext);
    };
  }, [children]);

  return (
    <div className="circle-wrapper">
      <div className="circle-container" ref={containerRef}>
        <div className="circle-border"></div>

        <div className="circle" ref={circleRef}>
          {children}
        </div>

        <div
          className="center-content c-content-24 clr-gray ft_light lh_1-6"
          ref={descRef}
        >
          {data[active] || ""}
        </div>
      </div>
    </div>
  );
}
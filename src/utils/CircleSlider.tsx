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

  const data = [
    "Responsible sourcing of raw materials aligned with operational efficiency and compliance standards.",
    "Efficient production ensuring sustainability.",
    "Recover valuable materials to minimize waste.",
    "Reuse resources to promote circular economy.",
    "Continuous monitoring and optimization."
  ];

  useEffect(() => {
    const container = containerRef.current;
    const circle = circleRef.current;

    if (!container || !circle) return;

    const items = container.querySelectorAll(".item");
    const total = items.length;

    if (!items.length) return;

    let resizeObserver: ResizeObserver;

    /* 🔵 POSITION ITEMS (SAFE) */
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

    /* 🔄 ROTATE */
    const rotateTo = (index: number) => {
      setActive(index);

      items.forEach((item) => item.classList.remove("active"));

      const angle = -(360 / total) * index;

      gsap.to(circle, {
        rotation: angle,
        duration: 0.6,
        ease: "power3.inOut",

        onUpdate: () => {
          const currentRotation = gsap.getProperty(circle, "rotation");

          items.forEach((item) => {
            gsap.set(item, { rotation: -Number(currentRotation) });
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

    /* ✅ INIT FIX (no refresh issue) */
    requestAnimationFrame(() => {
      setTimeout(() => {
        positionItems();
        rotateTo(0);
      }, 100);
    });

    /* ✅ ResizeObserver (fully responsive) */
    resizeObserver = new ResizeObserver(() => {
      positionItems();
    });
    resizeObserver.observe(container);

    /* 🖱 CLICK */
    items.forEach((item, index) => {
      item.addEventListener("click", () => rotateTo(index));
    });

    /* 🔥 AUTOPLAY */
    let autoPlay = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % total;
        rotateTo(next);
        return next;
      });
    }, 8000);

    const stop = () => clearInterval(autoPlay);
    const start = () => {
      autoPlay = setInterval(() => {
        setActive((prev) => {
          const next = (prev + 1) % total;
          rotateTo(next);
          return next;
        });
      }, 8000);
    };

    container.addEventListener("mouseenter", stop);
    container.addEventListener("mouseleave", start);

    /* 🔘 GLOBAL BUTTON SUPPORT */
    let prevBtn: HTMLElement | null = null;
    let nextBtn: HTMLElement | null = null;

    const handleNext = () => {
      setActive((prev) => {
        const next = (prev + 1) % total;
        rotateTo(next);
        return next;
      });
    };

    const handlePrev = () => {
      setActive((prev) => {
        const next = (prev - 1 + total) % total;
        rotateTo(next);
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

    /* 🧹 CLEANUP */
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
          {data[active]}
        </div>
      </div>
    </div>
  );
}
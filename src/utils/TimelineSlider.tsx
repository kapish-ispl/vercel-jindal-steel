"use client";

import React, { useState, useRef, useEffect, ReactNode, ReactElement } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface TimelineItem {
  title: string;
  desc: string;
}

interface TimelineSliderProps {
  children?: ReactNode;
  data?: string | TimelineItem[]; // Allow data as a JSON string from CMS
}

const DOT_SIZE = 32;
const GAP = 400;

const TimelineSlider = ({ children, data }: TimelineSliderProps) => {
  const [index, setIndex] = useState(0);

  // 1. Robust Data Parsing (Handles CMS JSON string OR Children)
  const timelineData = React.useMemo(() => {
    const results: { title: string; desc: string }[] = [];

    const searchData = (children: ReactNode) => {
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
          const p = child.props as any;
          // If this element has a title, it's a slide!
          if (p.title) {
            results.push({
              title: p.title,
              desc: p.desc || ""
            });
          }
          // Even if it's a slide, look inside it for more slides (fixes nesting)
          if (p.children) {
            searchData(p.children);
          }
        }
      });
    };

    searchData(children);
    return results;
  }, [children]);

  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!cardRef.current || !timelineRef.current || timelineData.length === 0) return;

    const cardRect = cardRef.current.getBoundingClientRect();
    const timelineRect = timelineRef.current.getBoundingClientRect();
    const center = (cardRect.left + cardRect.width / 2) - timelineRect.left;

    dotsRef.current.forEach((dot, i) => {
      if (!dot) return;
      const offset = (i - index) * GAP;
      const x = center - DOT_SIZE / 2 + offset;

      gsap.to(dot, {
        x: x,
        duration: 0.6,
        ease: "power3.out"
      });
    });

    gsap.fromTo([titleRef.current, descRef.current],
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" }
    );

  }, { dependencies: [index, timelineData], scope: containerRef });

  const handleNext = () => {
    if (index < timelineData.length - 1) {
      gsap.to([titleRef.current, descRef.current], {
        y: -15, opacity: 0, duration: 0.2, onComplete: () => setIndex(index + 1)
      });
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      gsap.to([titleRef.current, descRef.current], {
        y: -15, opacity: 0, duration: 0.2, onComplete: () => setIndex(index - 1)
      });
    }
  };

  if (timelineData.length === 0) return null;

  return (
    <section className="tilinesection" ref={containerRef}>
      <div className="timeline" ref={timelineRef}>
        {timelineData.map((_, i) => (
          <div
            key={i}
            ref={(el) => { dotsRef.current[i] = el; }}
            className={`dot ${i === index ? 'active' : ''}`}
            onClick={() => {
              if (i !== index) {
                gsap.to([titleRef.current, descRef.current], {
                  y: -15, opacity: 0, duration: 0.2, onComplete: () => setIndex(i)
                });
              }
            }}
          />
        ))}
      </div>

      <div className="card" ref={cardRef}>
        <h2 className='c-content-32 clr-gray ft_medium' ref={titleRef}>
          {timelineData[index].title}
        </h2>
        <div className='c-content-20 lh_1-6 clr-gray ft_light' ref={descRef}>
          {timelineData[index].desc}
        </div>

        <div className="chain-control">
          <button onClick={handlePrev} disabled={index === 0}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <rect x="0.5" y="0.5" width="43" height="43" rx="21.5" fill="white" stroke="#636466" />
              <path d="M25.2227 27.1094L20.1113 21.998L25.2227 16.8867L23.5391 15.2031L16.7442 21.998L23.5391 28.7929L25.2227 27.1094Z" fill="#636466" />
            </svg>
          </button>

          <button onClick={handleNext} disabled={index === timelineData.length - 1}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <rect x="43.5" y="0.5" width="43" height="43" rx="21.5" transform="rotate(180 43.5 0.5)" fill="white" stroke="#636466" />
              <path d="M18.7793 27.1126L23.8887 22.0032L18.7793 16.8938L20.4622 15.2109L27.2545 22.0032L20.4622 28.7955L18.7793 27.1126Z" fill="#636466" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TimelineSlider;
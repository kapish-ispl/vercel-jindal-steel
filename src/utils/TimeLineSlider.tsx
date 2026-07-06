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
          <button className='prev' onClick={handlePrev} disabled={index === 0}>
            <svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5 20.5L0.93997 11.4999C0.353346 10.9476 0.353346 10.0524 0.93997 9.50014L10.5 0.5" stroke="#A1A1A1" strokeLinecap="round" />
            </svg>

          </button>

          <button className='next' onClick={handleNext} disabled={index === timelineData.length - 1}>
            <svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5 20.5L0.93997 11.4999C0.353346 10.9476 0.353346 10.0524 0.93997 9.50014L10.5 0.5" stroke="#A1A1A1" strokeLinecap="round" />
            </svg>

          </button>
        </div>
      </div>
    </section>
  );
};

export default TimelineSlider;
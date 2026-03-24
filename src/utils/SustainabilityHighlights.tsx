"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const riseData = [
  {
    letter: "R",
    title: "Responsible\nGovernance",
    stats: [
      { value: "57%", desc: "Independent Directors on the Board" },
      { value: "100%", desc: "Ethics & compliance training completion" },
    ],
  },
  {
    letter: "I",
    title: "Inclusive\nGrowth",
    stats: [
      { value: "204,057", desc: "Employee learning hours" },
      { value: "₹267 Cr", desc: "CSR investment in community programs" },
    ],
  },
  {
    letter: "S",
    title: "Sustainable\nenvironment",
    stats: [
      { value: "2.79 tCO₂e", desc: "Emission intensity per tonne of crude steel" },
      { value: "7.85 Cr MWh", desc: "Total energy consumed" },
    ],
  },
  {
    letter: "E",
    title: "Ethical\npartnerships",
    stats: [
      { value: "0", desc: "Confirmed corruption or bribery cases" },
      { value: "3,600 TPD", desc: "Carbon capture capacity at Angul" },
    ],
  },
];

const SustainabilityHighlights = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;

    if (!section || !bg) return;

    const ctx = gsap.context(() => {
      // We have 4 items, so we create a scrub animation that lasts for e.g. 400vh
      const totalItems = riseData.length;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: "top top",
          end: `+=${window.innerHeight * totalItems}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Calculate the current active index based on progress
            const progress = self.progress;
            let mappedIndex = Math.floor(progress * totalItems);
            if (mappedIndex >= totalItems) mappedIndex = totalItems - 1;
            setActiveIndex(mappedIndex);
          },
        },
      });

      // Animate the background moving up smoothly
      tl.to(bg, {
        y: "-30vh",
        ease: "none",
      });

      // Recalculate ScrollTrigger positions since we dynamically added a big pin spacer
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="c-sustainability-highlights" ref={sectionRef}>
      <div className="bg-image-container" ref={bgRef}>
        <img
          src="/images/Rise_1.png"
          alt="Sustainability Factory Background"

        />
      </div>

      <div className="container content-overlay">
        <div className="row">
          <div className="col-12">
            <div className="header-section">
              <h2>
                Sustainability Highlights &ndash; FY 2024&ndash;25
              </h2>
              <p>Key performance indicators across R.I.S.E and ESG dimensions.</p>
            </div>
          </div>
        </div>

        <div className="row flex-grow-1">
          <div className="col-12 rise-container">
            {riseData.map((item, index) => (
              <div
                key={index}
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
                className={`rise-item ${activeIndex === index ? "active" : ""}`}
              >
                <div className="letter-col">
                  <div className="letter">{item.letter}</div>
                  <div className="title-wrap">
                    <div className="title">{item.title}</div>
                  </div>
                </div>

                <div className="data-wrap">
                  {item.stats.map((stat, sIndex) => (
                    <div className="data-item" key={sIndex}>
                      <div className="value">{stat.value}</div>
                      <div className="desc">{stat.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SustainabilityHighlights;

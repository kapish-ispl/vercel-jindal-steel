"use client";

import React, { ReactNode, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function CustomHorizontalScroll({ data }: { data: (ReactNode | string)[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const filteredItems = useMemo(() => {
    return data
      .filter(
        (item): item is React.ReactElement =>
          React.isValidElement(item)
      )
      .map((item, index) => (
        <React.Fragment key={index}>{item}</React.Fragment>
      ));
  }, [data]);

  useGSAP(() => {
    const sections = gsap.utils.toArray(".panel");
    const totalWidth = sections.length * 100; // 100vw per panel
    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => `+=${sectionRef.current?.offsetWidth ?? 0}`,
      },
    });
  }, []);

  return (
   
    <section
      ref={sectionRef}
      className="horizontal-section"
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
      }}
    >
       <div className="container cus-container">
          <div className="row">
            <div className="col-12">
              <div className="hw mt-3">
                <div className="clr-gray c-heading-50 text-center text-center ft_semiBold">A Legacy of Strength</div>
              </div>
            </div>
          </div>
      </div>
      <div
        ref={containerRef}
        className="horizontal-container"
        style={{
          display: "flex",
          height: "100%",
          width: `${filteredItems.length}00vw`
        }}
      >
        {filteredItems?.map((item: ReactNode, index: number) => (
          <div className="panel horizontalScroll-item" style={{
            flex: "0 0 100vw",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }} key={index}>
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

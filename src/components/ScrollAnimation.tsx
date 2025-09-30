"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useDeviceType } from "@/hooks/useDeviceType";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface Panel {
    id: number;
    img: string;
    mobImg?: string;
    heading: string;
    children?: React.ReactNode;
}

const ScrollAnimation = (props: any) => {
    const { data: bannerData, className } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showDots, setShowDots] = useState(false);
    const device = useDeviceType();

    const headingRefs = useRef<HTMLHeadingElement[]>([]);
    headingRefs.current = [];

    const addToRefs = (el: HTMLHeadingElement | null) => {
        if (el && !headingRefs.current.includes(el)) {
            headingRefs.current.push(el);
        }
    };

    const panelsData: Panel[] = useMemo(() => {
        if (!bannerData) return [];
        return bannerData
            ?.filter((item: any) => item.props !== undefined)
            ?.map((item: any, index: number) => ({
                id: index + 1,
                heading: item.props?.heading,
                img: item.props?.imgsrc,
                mobImg: item.props?.mobimgsrc,
                children: item.props?.children,
            }));
    }, [bannerData]);
    const dataLength = panelsData.length;

    useEffect(() => {
        const sections = gsap.utils.toArray<HTMLElement>(".panel");

        ScrollTrigger.getAll().forEach((t) => t.kill());

        // Main vertical scroll
        gsap.to(sections, {
            yPercent: -100 * (dataLength - 1),
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                pin: true,
                snap: 1 / (dataLength - 1),
                end: () => "+=" + containerRef.current!.offsetHeight,
                scrub: 1,
                onEnter: () => setShowDots(true),
                onLeave: () => setShowDots(false),
                onEnterBack: () => setShowDots(true),
                onLeaveBack: () => setShowDots(false),
            },
        });

        // SplitText animation for each heading
        headingRefs.current.forEach((heading) => {
            const split = new SplitText(heading, { type: "words,chars" });

            gsap.from(split.chars, {
                scrollTrigger: {
                    trigger: heading,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
                duration: 0.6,
                opacity: 0,
                y: 40,
                stagger: 0.05,
                ease: "power3.out",
            });
        });
    }, [dataLength]);

    return (
        <>
            <section className={`generic_hr_scroll hidden xl:block ${className ?? ""}`}>
                <div style={{ position: "relative" }}>
                    <div ref={containerRef} className="container_jj">
                        {panelsData.length > 0 &&
                            panelsData.map((item, index) => (
                                <section key={index} className="panel red">
                                    <div className="slide-content">
                                        <div
                                            className="generic_hr_scroll_section relative scrollable_box v4"
                                            style={{
                                                backgroundImage: `url(${device === "desktop" ? item.img : item.mobImg
                                                    })`,
                                            }}
                                        >
                                            <div className="container z-20 scrollable_box_container">
                                                <div className="row h-full">
                                                    <div className="col-12 h-full">
                                                        <div className="scrollable_box_content h-full flex flex-col justify-between pt-28 pb-20">
                                                            <div className="scrollable_box_content_head">
                                                                <h2
                                                                    ref={addToRefs}
                                                                    className={`pannel-heading c-heading-65 clr-green heading-${item.id}`}
                                                                >
                                                                    {item.heading}
                                                                </h2>
                                                            </div>
                                                            {item.children}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            ))}
                    </div>

                    {showDots && (
                        <div className="dots">
                            {Array.from({ length: dataLength }).map((_, idx) => (
                                <span key={idx} className={activeIndex === idx ? "active" : ""} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default ScrollAnimation;

"use client";

import React, { useRef, useLayoutEffect, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface Panel {
    id: number;
    img: string;
    mobimg?: string;
    heading: string;
    children?: React.ReactNode;
}

const ScrollAnimation = (props: any) => {
    const main = useRef<HTMLDivElement | null>(null);
    const timeline = useRef<gsap.core.Timeline | null>(null);
    const { data: bannerData } = props;

    const panelsData: Panel[] = useMemo(() => {
        if (!bannerData) return [];
        return bannerData
            ?.filter((item: any) => item.props !== undefined)
            ?.map((item: any, index: number) => ({
                id: index + 1,
                heading: item.props?.heading,
                img: item.props?.imgsrc,
                mobImg: item.props?.imgsrc,
                children: item.props?.children,
            }));
    }, [bannerData]);

    console.log(panelsData, "panelsData")
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const dots = gsap.utils.toArray<HTMLElement>(".dot");
            const setActiveDot = (index: number) => {
                dots.forEach((d) => d.classList.remove("active"));
                if (dots[index]) dots[index].classList.add("active");
            };

            // hide nav dots initially
            gsap.set(".nav-dots", { autoAlpha: 0 });
            setActiveDot(0);

            // timeline pinned to panels-container
            timeline.current = gsap.timeline({
                scrollTrigger: {
                    trigger: ".panels-container",
                    start: "top top",
                    pin: true,
                    scrub: true,
                    snap: {
                        snapTo: 1 / (panelsData.length - 1),
                        duration: { min: 0.2, max: 0.6 },
                        ease: "power1.inOut",
                    },
                    end: () => "+=" + panelsData.length * window.innerHeight,
                    onEnter: () => gsap.to(".nav-dots", { autoAlpha: 1, duration: 0.3 }),
                    onLeave: () => gsap.to(".nav-dots", { autoAlpha: 0, duration: 0.3 }),
                    onEnterBack: () => gsap.to(".nav-dots", { autoAlpha: 1, duration: 0.3 }),
                    onLeaveBack: () => gsap.to(".nav-dots", { autoAlpha: 0, duration: 0.3 }),
                    onUpdate: (self) => {
                        const idx = Math.round(self.progress * (panelsData.length - 1));
                        setActiveDot(idx);
                    },
                },
            });

            panelsData.forEach((panel, i) => {
                const panelSelector = `.panel-${panel.id}`;
                const headingSelector = `.heading-${panel.id}`;
                const step = i;

                timeline.current!
                    .fromTo(
                        `${panelSelector} .parallax-img`,
                        { scale: 1, y: 0 }, // start
                        { scale: 1.15, y: -20, ease: "power1.inOut", duration: 1 },
                        step
                    )
                    .fromTo(
                        new SplitType(headingSelector, { types: "chars" }).chars,
                        { y: 80, opacity: 0 }, // start
                        {
                            y: 0,
                            opacity: 1,
                            stagger: 0.05,
                            ease: "power2.out",
                            duration: 0.6,
                        },
                        step + 0.2
                    );
            });

            const containerEl = document.querySelector(
                ".panels-container"
            ) as HTMLElement | null;
            if (containerEl) {
                dots.forEach((dot, idx) => {
                    const clickHandler = () => {
                        const containerTop =
                            containerEl.getBoundingClientRect().top + window.pageYOffset;
                        const targetY = containerTop + idx * window.innerHeight;
                        gsap.to(window, {
                            duration: 0.8,
                            ease: "power2.inOut",
                            scrollTo: targetY,
                        });
                    };
                    dot.addEventListener("click", clickHandler);
                    (dot as any).__gsapClickHandler = clickHandler;
                });
            }
        }, main);

        // ensure ScrollTrigger recalculates on resize
        const onResize = () => {
            ScrollTrigger.refresh();
        };
        window.addEventListener("resize", onResize);

        return () => {
            const dots = document.querySelectorAll(".dot");
            dots.forEach((dot) => {
                const h = (dot as any).__gsapClickHandler;
                if (h) dot.removeEventListener("click", h);
            });
            window.removeEventListener("resize", onResize);
            ctx.revert();
        };
    }, [panelsData]);

    return (
        <div ref={main} className="scroll-animation-container">
            <div className="panels-container">
                {panelsData.map((panel) => (
                    <section key={panel.id} className={`panel panel-${panel.id}`}>
                        <div className="parallax-container">
                            <img
                                src={panel.img}
                                alt={panel.heading}
                                className="parallax-img"
                            />
                        </div>

                        <div className="container cus-container h-100">
                            <div className="row h-100">
                                <div className="col-12 h-100">
                                    <div className="scrollable_box_content h-100">
                                        <div className="scrollable_box_content_head">
                                            <h2
                                                className={`pannel-heading c-heading-65 clr-green heading-${panel.id}`}
                                            >
                                                {panel.heading}
                                            </h2>
                                        </div>
                                        {panel.children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            {
                panelsData.length > 1 && (
                    <nav className="nav-dots">
                        <ul>
                            {panelsData.map((_, i) => (
                                <li key={i} className="dot"></li>
                            ))}
                        </ul>
                    </nav>
                )

            }
        </div>
    );
};

export default ScrollAnimation;

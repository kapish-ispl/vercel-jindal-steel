"use client";

import React, { useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import SplitType from "split-type";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface Panel {
    id: number;
    img: string;
    mobImg?: string;
    heading: string;
    children?: React.ReactNode;
}

const ScrollAnimation = (props: any) => {
    const main = useRef<HTMLDivElement | null>(null);
    const timeline = useRef<gsap.core.Timeline | null>(null);
    const { data: bannerData } = props;
    const device = useDeviceType();

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

    useGSAP(() => {
        if (!panelsData || panelsData.length === 0) {
            return;
        }

        const dots = gsap.utils.toArray<HTMLElement>(".dot");
        const splitInstances: SplitType[] = [];

        const setActiveDot = (index: number) => {
            dots.forEach((d) => d.classList.remove("active"));
            if (dots[index]) dots[index].classList.add("active");
        };

        gsap.set(".nav-dots", { autoAlpha: 0 });
        setActiveDot(0);
        gsap.set(".panel", { autoAlpha: 0 });
        gsap.set(".panel-1", { autoAlpha: 1 });

        timeline.current = gsap.timeline({
            scrollTrigger: {
                trigger: ".panels-container",
                start: "top top",
                pin: true,
                scrub: 3,

                markers: true,
                end: () => `+=${(panelsData.length - 1.5) * 100}%`,
                onEnter: () => gsap.to(".nav-dots", { autoAlpha: 1, duration: 0.3 }),
                onLeave: () => gsap.to(".nav-dots", { autoAlpha: 0, duration: 0.3 }),
                onEnterBack: () => gsap.to(".nav-dots", { autoAlpha: 1, duration: 0.3 }),
                onLeaveBack: () => gsap.to(".nav-dots", { autoAlpha: 0, duration: 0.3 }),
                onUpdate: (self) => {
                    const idx = Math.round(self.progress * (panelsData.length - 1));
                    setActiveDot(idx);
                },
                invalidateOnRefresh: true,
            },
        });

        panelsData.forEach((panel, i) => {
            const panelSelector = `.panel-${panel.id}`;
            const headingEl = main.current?.querySelector(`.heading-${panel.id}`);
            if (!headingEl) return;

            const split = new SplitType(headingEl as HTMLElement, { types: "chars" });
            splitInstances.push(split);

            timeline.current!.fromTo(
                `${panelSelector} .parallax-img`,
                { scale: 1.15, },
                { scale: 1, ease: "back.inOut" },
                i
            );

            // --- MODIFICATION FOR SMOOTH FADE ---
            // Animate the visibility with a duration and ease for a cross-fade effect.
            if (i > 0) {
                const prevPanelSelector = `.panel-${panelsData[i - 1].id}`;
                const transitionDuration = 0.4; // Adjust this value for faster/slower fades
                const transitionEase = "power1.inOut";

                // At the start of this panel's section (time 'i'), fade OUT the previous one.
                timeline.current!.to(prevPanelSelector, {
                    autoAlpha: 0,
                    duration: transitionDuration,
                    ease: transitionEase
                }, i);

                // And at the same time, fade IN the current one.
                timeline.current!.to(panelSelector, {
                    autoAlpha: 1,
                    duration: transitionDuration,
                    ease: transitionEase
                }, i);
            }
            // --- END MODIFICATION ---

            // Text animation for the current panel
            timeline.current!.from(split.chars, {
                y: 50,
                opacity: 0,
                stagger: 0.05,
                ease: "power2.inOut",
            }, i);
        });

        const containerEl = main.current?.querySelector(".panels-container") as HTMLElement | null;
        if (containerEl) {
            dots.forEach((dot, idx) => {
                const clickHandler = () => {
                    const containerTop = containerEl.getBoundingClientRect().top + window.scrollY;
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

        const refreshTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 200);

        return () => {
            clearTimeout(refreshTimeout);
            splitInstances.forEach(split => split.revert());
            dots.forEach((dot) => {
                const handler = (dot as any).__gsapClickHandler;
                if (handler) {
                    dot.removeEventListener("click", handler);
                }
            });
        };

    }, { scope: main, dependencies: [panelsData] });

    return (
        <div ref={main} className="scroll-animation-container">
            <div className="panels-container">
                {panelsData.map((panel) => (
                    <section key={panel.id} className={`panel panel-${panel.id}`}>
                        <div className="parallax-container">
                            <img
                                src={device === "desktop" ? panel.img : panel.mobImg}
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

            {panelsData.length > 1 && (
                <nav className="nav-dots">
                    <ul>
                        {panelsData.map((_, i) => (
                            <li key={i} className="dot"></li>
                        ))}
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default ScrollAnimation;
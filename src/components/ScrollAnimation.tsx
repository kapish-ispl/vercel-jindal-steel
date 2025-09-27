"use client";

import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface Panel {
    id: number;
    img: string;
    heading: string;
}

const panelsData: Panel[] = [
    {
        id: 1,
        img: "https://d2lptvt2jijg6f.cloudfront.net/124/1758871476_Rectangle91.png",
        heading: "Coal",
    },
    {
        id: 2,
        img: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1800&q=80",
        heading: "Discover Beauty",
    },
    {
        id: 3,
        img: "https://images.unsplash.com/photo-1756726270255-9689c64a49d1?q=80&w=1410&auto=format&fit=crop",
        heading: "Find Yourself",
    },
];

const ScrollAnimation: React.FC = (props: any) => {

    const { data: bannerData } = props;
    console.log(bannerData)
    const main = useRef<HTMLDivElement | null>(null);
    const timeline = useRef<gsap.core.Timeline | null>(null);

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
                    scrub: 1,
                    // <--- important: use (panels - 1) screens worth of scroll
                    end: () => "+=" + (panelsData.length - 1) * window.innerHeight,
                    onEnter: () => gsap.to(".nav-dots", { autoAlpha: 1, duration: 0.3 }),
                    onLeave: () => gsap.to(".nav-dots", { autoAlpha: 0, duration: 0.3 }),
                    onEnterBack: () => gsap.to(".nav-dots", { autoAlpha: 1, duration: 0.3 }),
                    onLeaveBack: () => gsap.to(".nav-dots", { autoAlpha: 0, duration: 0.3 }),
                    onUpdate: (self) => {
                        // progress is 0..1 — map to nearest panel index
                        const prog = self.progress;
                        const idx = Math.round(prog * (panelsData.length - 1));
                        setActiveDot(idx);
                    },
                },
            });

            // build animations (no .call used for dot updates)
            panelsData.forEach((panel, i) => {
                const panelSelector = `.panel-${panel.id}`;
                const headingSelector = `.heading-${panel.id}`;

                // Parallax image animation and heading split animation
                timeline.current!
                    .to(
                        `${panelSelector} .parallax-img`,
                        { scale: 1.15, y: "-20px", ease: "power1.inOut" },
                        // spread animations over the timeline; small offset to sequence nicely
                        i === 0 ? 0 : `+=0.01`
                    )
                    .from(
                        new SplitType(headingSelector, { types: "chars" }).chars,
                        {
                            y: 80,
                            opacity: 0,
                            stagger: 0.05,
                            ease: "power2.out",
                        },
                        "<0.2"
                    );

                // fade/scale out before next panel (except last)
                if (i < panelsData.length - 1) {
                    timeline.current!.to(panelSelector, { scale: 1.2, opacity: 0, ease: "power2.in" }, "+=0.5");
                }
            });

            // make dots clickable: scroll to panel's progress position
            const containerEl = document.querySelector(".panels-container") as HTMLElement | null;
            if (containerEl) {
                dots.forEach((dot, idx) => {
                    const clickHandler = () => {
                        // top of container in document coordinates
                        const containerTop = containerEl.getBoundingClientRect().top + window.pageYOffset;
                        // compute target scroll y: top + idx * viewport height
                        const targetY = containerTop + idx * window.innerHeight;
                        gsap.to(window, { duration: 0.8, ease: "power2.inOut", scrollTo: targetY });
                    };
                    dot.addEventListener("click", clickHandler);

                    // cleanup listener on revert by storing a property we can remove later if needed.
                    // ctx.revert() will remove DOM changes, but event listeners added to existing DOM should be removed manually.
                    // We'll attach the handler to the element so we can remove it in cleanup.
                    (dot as any).__gsapClickHandler = clickHandler;
                });
            }
        }, main);

        // ensure ScrollTrigger recalculates on resize (end uses viewport height)
        const onResize = () => {
            ScrollTrigger.refresh();
        };
        window.addEventListener("resize", onResize);

        return () => {
            // remove click listeners we added
            const dots = document.querySelectorAll(".dot");
            dots.forEach((dot) => {
                const h = (dot as any).__gsapClickHandler;
                if (h) dot.removeEventListener("click", h);
            });

            window.removeEventListener("resize", onResize);
            ctx.revert(); // revert all GSAP modifications
        };
    }, []);

    return (
        <div ref={main} className="scroll-animation-container">
            <div className="panels-container">
                {panelsData.map((panel) => (
                    <section key={panel.id} className={`panel panel-${panel.id}`}>
                        <div className="parallax-container">
                            <img src={panel.img} alt={panel.heading} className="parallax-img" />
                        </div>

                        <div className="container cus-container h-100">
                            <div className="row h-100">
                                <div className="col-12 h-100">
                                    <div className="scrollable_box_content h-100">
                                        <div className="scrollable_box_content_head">
                                            <h2 className={`pannel-heading c-heading-65 clr-green heading-${panel.id}`}>{panel.heading}</h2>
                                        </div>

                                        <div className="scrollable_box_content_bottom row list_view v3">
                                            <div className="col-12 col-lg-3 list_view_container">
                                                <div className="list_view_info">
                                                    <div className="list_view_content">
                                                        <span className="list_view_content_desc">Domestic Operations</span>
                                                    </div>
                                                    <div className="list_view_content_title c-heading-40 clr-primary">
                                                        <span>15.7</span> <span> MTPA</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-lg-3 list_view_container">
                                                <div className="list_view_info">
                                                    <div className="list_view_content">
                                                        <span className="list_view_content_desc">International Operations </span>
                                                    </div>
                                                    <div className="list_view_content_title c-heading-40 clr-primary">
                                                        <span>7.4</span> <span> MTPA</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            <nav className="nav-dots">
                <ul>
                    {panelsData.map((_, i) => (
                        <li key={i} className="dot"></li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default ScrollAnimation;

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
        img: "https://images.unsplash.com/photo-1757778281735-f26d15bff432?q=80&w=1170&auto=format&fit=crop",
        heading: "Explore Worlds",
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
    {
        id: 4,
        img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=80",
        heading: "Create Anew",
    },
];

const ScrollAnimation: React.FC = () => {
    const main = useRef<HTMLDivElement>(null);
    const timeline = useRef<gsap.core.Timeline>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const dots = gsap.utils.toArray<HTMLElement>(".dot");

            const setActiveDot = (index: number) => {
                dots.forEach((dot) => dot.classList.remove("active"));
                if (dots[index]) dots[index].classList.add("active");
            };

            gsap.set(".nav-dots", { autoAlpha: 0 });

            timeline.current = gsap.timeline({
                scrollTrigger: {
                    trigger: ".panels-container",
                    pin: true,
                    scrub: 2,
                    end: () => "+=" + panelsData.length * window.innerHeight,
                    onEnter: () =>
                        gsap.to(".nav-dots", { autoAlpha: 1, duration: 0.5 }),
                    onLeave: () =>
                        gsap.to(".nav-dots", { autoAlpha: 0, duration: 0.5 }),
                    onEnterBack: () =>
                        gsap.to(".nav-dots", { autoAlpha: 1, duration: 0.5 }),
                    onLeaveBack: () =>
                        gsap.to(".nav-dots", { autoAlpha: 0, duration: 0.5 }),
                },
            });

            // Loop panels
            panelsData.forEach((panel, i) => {
                const headingSelector = `.heading-${panel.id}`;
                const panelSelector = `.panel-${panel.id}`;

                timeline.current!
                    .addLabel(`panel${panel.id}_start`)
                    .call(() => setActiveDot(i))
                    .to(`${panelSelector} .parallax-img`, {
                        scale: 1.15,
                        y: "-20px",
                        ease: "power1.inOut",
                    }, "<")
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

                // Fade out panels except the last one
                if (i < panelsData.length - 1) {
                    timeline.current!.to(
                        panelSelector,
                        { scale: 1.2, opacity: 0, ease: "power2.in" },
                        "+=0.5"
                    );
                }
            });
        }, main);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={main} className="scroll-animation-container">
            <div className="panels-container">
                {panelsData.map((panel) => (
                    <section key={panel.id} className={`panel panel-${panel.id}`}>
                        <div className="parallax-container">
                            <img src={panel.img} alt={panel.heading} className="parallax-img" />
                        </div>
                        <h2 className={`pannel-heading heading-${panel.id}`}>{panel.heading}</h2>
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

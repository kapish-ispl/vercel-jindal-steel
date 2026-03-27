'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const CustomCircleAnimation = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const blueRef = useRef<HTMLDivElement>(null);
    const greenRef = useRef<HTMLDivElement>(null);
    const orangeRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current || !blueRef.current || !greenRef.current || !orangeRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "center center",
                end: "+=4000", // Massively stretched distance to map the entire experience slowly
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                scrub: 1,
            }
        });

        // Initialize Base Z-indexes
        gsap.set(blueRef.current, { zIndex: 1 });
        gsap.set(greenRef.current, { zIndex: 2 });
        gsap.set(orangeRef.current, { scale: 1, opacity: 0, zIndex: 5 });

        // Phase 1: Swap positions.
        tl.fromTo(blueRef.current, { xPercent: -55 }, { xPercent: 55, duration: 2, ease: 'none' }, 0)
            .fromTo(greenRef.current, { xPercent: 55 }, { xPercent: -55, duration: 2, ease: 'none' }, 0);

        // Pause visually swapped at the edges reduced to absolute minimum (just enough to prevent jarring snapping)
        tl.to({}, { duration: 0.1 });

        // Explicit zIndex flip locked into the timeline map
        tl.fromTo(blueRef.current, { zIndex: 1 }, { zIndex: 3, duration: 0.01, ease: 'none' }, "+=0");

        // Phase 2: Translate both perfectly back into the center
        tl.fromTo(blueRef.current, { xPercent: 55 }, { xPercent: 0, duration: 2, ease: 'none' }, "+=0")
            .fromTo(greenRef.current, { xPercent: -55 }, { xPercent: 0, duration: 2, ease: 'none' }, "<");

        // Pause totally overlapping reduced to absolute minimum
        tl.to({}, { duration: 0.1 });

        // Phase 3: Morph to Orange!
        tl.fromTo(orangeRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: "none" }, "+=0");

        // ERADICATED FINAL DEAD ZONE! The timeline physically concludes the exact instant the orange opacity locks 1.
        // It immediately unpins, and instantly un-merges the millisecond you reverse-scroll without any physical "stuck" latency!

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="rise-esg-section">
            <div>
                <div className="row">
                    <div className="col-12 col-lg-9">
                        <div className="hw">
                            <div className="c-heading-60 ft_regular clr-gray lh_1-1 mb-40">RISE &times; ESG Integration</div>

                            <p className="c-content-24 ft_light lh_1-6 clr-gray">RISE defines direction. ESG measures performance. The RISE framework guides strategic intent across operations, while ESG provides the structure for measurement, reporting and accountability.</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="rise-esg-circles-wrapper">
                            <div ref={blueRef} className="rise-esg-circle circle-blue">
                                <span className="circle-text ft_semiBold">R.I.S.E</span>
                            </div>
                            <div ref={greenRef} className="rise-esg-circle circle-green">
                                <span className="circle-text ft_semiBold">E.S.G.</span>
                            </div>
                            <div ref={orangeRef} className="rise-esg-circle circle-orange">
                                <span className="circle-text mb-0 mb-sm-2 ft_semiBold">R.I.S.E</span>
                                <span className="circle-subtext c-content-24 clr-white lh_1-6 ft_medium">Integrated Sustainable<br />Performance</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomCircleAnimation;

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CustomCircleAnimation = () => {
    const sectionRef = useRef(null);
    const containerRef = useRef(null);
    const leftCircle = useRef(null);
    const rightCircle = useRef(null);
    const centerContent = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=150%", // Adjust this to make the scroll faster or slower
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                }
            });

            tl.to(leftCircle.current, {
                xPercent: 50, // Move toward center
                backgroundColor: "#d58b61", // The orange merge color
                duration: 2
            }, 0)
                .to(rightCircle.current, {
                    xPercent: -50, // Move toward center
                    backgroundColor: "#d58b61",
                    opacity: 0, // Fade out the secondary circle
                    duration: 2
                }, 0)
                .to(centerContent.current, {
                    opacity: 1,
                    scale: 1,
                    duration: 1
                }, "-=0.5"); // Start appearing just before circles fully merge

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="esg-integration-wrapper" ref={sectionRef}>

            <div className="circles-container" ref={containerRef}>
                {/* Left Circle (RISE) */}
                <div className="circle rise-circle" ref={leftCircle}>
                    <div className="circle-text">
                        <span>R.I.</span>
                        <span>S.E</span>
                    </div>
                </div>

                {/* Right Circle (ESG) */}
                <div className="circle esg-circle" ref={rightCircle}>
                    <div className="circle-text">
                        <span>E.S.G.</span>
                    </div>
                </div>

                {/* Overlaid content that appears on merge */}
                <div className="merged-content" ref={centerContent}>
                    <h3>R.I. S.E</h3>
                    <p>Integrated Sustainable Performance</p>
                </div>
            </div>
        </section>
    );
};

export default CustomCircleAnimation;
import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const CustomCircleAnimation = () => {
    const sectionRef = useRef(null);
    const containerRef = useRef(null);
    const leftCircle = useRef(null);
    const rightCircle = useRef(null);
    const centerContent = useRef(null);
    // New refs for the text inside circles
    const leftText = useRef(null);
    const rightText = useRef(null);

    useGSAP(() => {
        ScrollTrigger.normalizeScroll(true);
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=150%",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    pinSpacing: true,
                    invalidateOnRefresh: true,

                }
            });

            tl.to(leftCircle.current, {
                xPercent: 50,
                backgroundColor: "#D78E5E",
                duration: 2
            }, 0)
                .to(rightCircle.current, {
                    xPercent: -50,
                    backgroundColor: "#D78E5E",
                    opacity: 0,
                    duration: 2
                }, 0)
                // ADDED: Fade out the circle text as they move
                .to([leftText.current, rightText.current], {
                    opacity: 0,
                    duration: 1 // Fades out halfway through the merge
                }, 0)
                .to(centerContent.current, {
                    opacity: 1,
                    scale: 1,
                    duration: 1
                }, "-=0.5");

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="esg-integration-wrapper" ref={sectionRef}>
            <div className="circles-container" ref={containerRef}>
                <div className="circle rise-circle" ref={leftCircle}>
                    <div className="circle-text c-heading-60 ft_SemiBold lh_1-6" ref={leftText}>
                        <span>R.I.S.E</span>
                    </div>
                </div>

                <div className="circle esg-circle" ref={rightCircle}>
                    <div className="circle-text c-heading-60 ft_SemiBold lh_1-6" ref={rightText}>
                        <span>E.S.G.</span>
                    </div>
                </div>

                <div className="merged-content" ref={centerContent}>
                    <h3 className='c-heading-60 ft_SemiBold lh_1-6'>R.I. S.E</h3>
                    <p className='c-content-24 ft_mediun lh_1-6'>Integrated Sustainable Performance</p>
                </div>
            </div>
        </section>
    );
};

export default CustomCircleAnimation;
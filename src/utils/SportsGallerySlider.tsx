"use client";

import React, { useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const SportsGallerySlider = ({ data }: { data: any }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const CARD_DATA = useMemo(() => {
        if (!data) return [];

        return React.Children.toArray(data)
            .filter(
                (child): child is React.ReactElement<any> =>
                    React.isValidElement(child) &&
                    typeof (child.props) !== "undefined"
            )
            .map((child, index) => ({
                id: index + 1,
                title: child.props.title,
                img: child.props.imgsrc,
                desc: child.props.children,
                event: child.props.event,
            }));
    }, [data]);


    useGSAP(() => {
        const section = sectionRef.current;
        const totalWidth = section?.scrollWidth;
        const windowWidth = window.innerWidth;

        const pin = gsap.fromTo(section,
            { x: 0 },
            {
                x: -(totalWidth! - windowWidth + 100), // Scroll until the last card is visible
                ease: "none",
                scrollTrigger: {
                    trigger: triggerRef.current,
                    pin: true,
                    scrub: 1,
                    start: "top top",
                    end: () => `+=${(totalWidth || 0) * 0.5}`,
                    invalidateOnRefresh: true,
                }
            }
        );

        return () => pin.kill();
    }, { scope: triggerRef });

    return (
        <section className="sports-scroll-outer" ref={triggerRef}>
            <div className="container cus-container">
                <div className="sports-header mb-60">
                    <h2 className="c-heading-60 ft_bold clr-gray lh_1-6">Sports That Build Us</h2>
                    <p className="c-content-32 ft_extraLight clr-gray lh_1-5 width-1050">
                        Beyond the desk, we foster physical fitness, resilience, and camaraderie
                        through our vibrant sports culture. Scroll down to explore.
                    </p>
                </div>

                <div className="sports-gallery-wrapper" ref={sectionRef}>
                    {CARD_DATA.map((card) => (
                        <div key={card.id} className="sport-card">
                            <div className="card-inner" style={{ backgroundImage: `url(${card.img})` }}>
                                <div className="card-content">
                                    <span className="event-label c-content-16 clr-primary lh_1-4 ft_bold">{card.event}</span>
                                    <h3 className='c-content-24 clr-white lh_1-3 ft_bold'>{card.title}</h3>
                                    <p className='c-content-16 clr-white lh_1-5 ft_medium mb-0'>{card.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SportsGallerySlider;
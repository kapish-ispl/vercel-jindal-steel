"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const ScrollProgress = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const rows = gsap.utils.toArray<HTMLElement>(".water-row");

        rows.forEach((row) => {
            const fill = row.querySelector(".progress-fill");

            gsap.to(fill, {
                width: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: row,
                    start: "top 80%",
                    end: "top 20%",
                    scrub: true,
                }
            });
        });
    }, { scope: sectionRef });

    const rowData = [
        {
            id: 1,
            title: "Efficient Water Use",
            color: "#F47920", // Orange
            img: "https://docs.jindalsteel.in/document/124/1773731449_EfficientWaterUse.png",
            disc: "Operational systems are designed to optimise water consumption across production processes."
        },
        {
            id: 2,
            title: "Water Treatment & Recycling",
            color: "#8fa35d", // Green
            img: "https://docs.jindalsteel.in/document/124/1773732172_WaterTreatment.png",
            disc: "Process water is treated and reused within operations, supporting circular water management practices."
        },
        {
            id: 3,
            title: "Zero Liquid Discharge",
            color: "#446183", // Blue
            img: "https://docs.jindalsteel.in/document/124/1773732545_ZeroLiquidDischarge.png",
            disc: "Zero liquid discharge systems at key facilities help ensure that treated water is recovered and reused within the plant boundary."
        },
    ];

    return (
        <section ref={sectionRef}>
            <div>
                {rowData.map((item) => (
                    <div className="row water-row" key={item.id}>
                        <div className="col-12 col-md-6" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
                            {/* Removed withborder and border-orange classes */}
                            <div className="hw mb-40 position-relative">
                                {/* Progress wrapper is now ABOVE the title */}
                                <div className="custom-progress-wrapper top-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ backgroundColor: item.color }}
                                    ></div>
                                </div>
                                <div className="c-heading-48 clr-gray ft_medium lh_1-2 mt-3">
                                    {item.title}
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <div className="c-bento__card__wrapper with-gradient mb-2" data-aos="fade-left" data-aos-duration="1000">
                                <div className="c-bento__card__wrapper_media">
                                    <img
                                        alt="card media"
                                        className="img-fluid u-img"
                                        src={item.img}
                                    />
                                </div>
                            </div>
                            <div className="genric__content" data-aos="fade-left" data-aos-duration="2000">
                                <p className="c-content-24 clr-gray ft_light lh_1-6 mb-40">
                                    {item.disc}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

            </div>

        </section>
    );
};

export default ScrollProgress;
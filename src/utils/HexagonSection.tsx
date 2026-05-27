import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const STEPS_DATA = [
    {
        id: 1,
        title: "Receipt And Logging",
        desc: "Formal recording of all incoming requests and community grievances."
    },
    {
        id: 2,
        title: "Acknowledgement",
        desc: "Official confirmation sent to the complainant within 48 hours."
    },
    {
        id: 3,
        title: "Preliminary Assessment",
        desc: "Screening and categorization by the specialized CSR team."
    },
    {
        id: 4,
        title: "Investigation",
        desc: "Impartial review conducted by the designated Grievance Officer."
    },
    {
        id: 5,
        title: "Resolution and communication",
        desc: "A resolution plan is finalised and formally communicated to the complainant."
    },
    {
        id: 6,
        title: "Appeal and closure",
        desc: "The case is closed upon acceptance  of the resolution by the complainant;  unresolved cases may be escalated through an appeal. All records are  maintained for audits."
    }
];

const HexagonSection = ({ data, props }: any) => {
    const hexagonSection = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const stepsWrapperRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();
        const rows = gsap.utils.toArray('.process__row');
        const masterTl = gsap.timeline({
            scrollTrigger: {
                trigger: hexagonSection.current,
                start: "top top",
                end: () => `+=${rows.length * 500}`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            }
        });


        rows.forEach((row: any, index: number) => {
            const leftP = row.querySelector('.process__path--left');
            const rightP = row.querySelector('.process__path--right');
            const num = row.querySelector('.process__number');

            // Setup SVG paths
            [leftP, rightP].forEach(p => {
                const length = p.getTotalLength();
                gsap.set(p, {
                    strokeDasharray: length,
                    strokeDashoffset: length,
                    autoAlpha: 0
                });
            });

            const moveUp = index > 0 ? (index * 122) : 0;

            // Animation sequence
            masterTl.to(row, {
                opacity: 1,
                y: 0,
                duration: 0.4
            });

            if (index > 0) {
                masterTl.to(stepsWrapperRef.current, {
                    y: -moveUp,
                    duration: 0.5,
                    ease: "power1.inOut"
                }, "<");
            }

            masterTl.to([leftP, rightP], {
                autoAlpha: 1,
                strokeDashoffset: 0,
                duration: 1.2,
                ease: "none"
            })
                .to(num, {
                    opacity: 1,
                    duration: 0.3
                }, "-=0.3");
        });

    }, { scope: hexagonSection });

    return (

        <>
            <div className="row" ref={hexagonSection}>

                <div className="col-12 col-lg-5"><img alt="img" className="img-fluid u-img ratio ratio-1x1"
                    src="https://docs.jindalsteel.in/document/124/1779342539_redressal.webp" /></div>

                <div className="col-12 col-lg-7">
                    <div className="process__content" ref={containerRef}>
                        <div className="process__steps-wrapper" ref={stepsWrapperRef}>
                            {STEPS_DATA.map((step) => (
                                <div key={step.id} className="process__row">
                                    <div className="process__hex-box">
                                        <svg className="process__svg" viewBox="0 0 100 115">
                                            <path className="process__path process__path--left" d="M 50 2 L 2 30 L 2 85 L 50 113" />
                                            <path className="process__path process__path--right" d="M 50 2 L 98 30 L 98 85 L 50 113" />
                                        </svg>
                                        <div className="process__number">{step.id}</div>
                                    </div>
                                    <div className="process__description">
                                        <h3 className="process__title c-content-24 lh_1-6 ft_semiBold clr-primary">{step.title}</h3>
                                        <p className="process__text c-content-20 ft_light lh_1-6 clr-secondary">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HexagonSection;
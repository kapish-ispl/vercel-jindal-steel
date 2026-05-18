import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const timelineData = [
    {
        title: "Pre- & Post Training Evaluation",
        description: "Measuring improvement in knowledge and skill levels"
    },
    {
        title: "Operational KPIs",
        description: "Tracking reductions in incidents, downtime, and quality deviations"
    },
    {
        title: "On-the-Job Performance",
        description: "Monitoring real-time safety practices and productivity gains."
    },
    {
        title: "ROI Analysis",
        description: "Assessing cost-benefit and business impact of training"
    },
    {
        title: "Feedback Systems",
        description: "Capturing participant insights to refine programs"
    }
];

const Timeline = ({ props, data }: any) => {
    const container = useRef(null);
    // const timelineData = data || [];
    useGSAP(() => {
        // 1. Animate the progress line height
        gsap.to(".timeline__progress-line", {
            height: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: ".timeline",
                start: "top 70%",
                end: "bottom 55%",
                scrub: true,
            }
        });

        // 2. Trigger active states for dots and content
        const steps = gsap.utils.toArray<HTMLElement>(".timeline__step");
        steps.forEach((step) => {
            ScrollTrigger.create({
                trigger: step,
                start: "top 70%",
                end: "bottom 50%",
                onEnter: () => step.classList.add("timeline__step--is-active"),
                onLeaveBack: () => step.classList.remove("timeline__step--is-active"),
            });
        });
    }, { scope: container });

    return (
        <div className="timeline-container" ref={container}>
            <div className="timeline">
                <div className="timeline__track" />
                <div className="timeline__progress-line" />

                {timelineData.map((item, index) => (
                    <div className="timeline__step" key={index}>
                        <div className="timeline__marker" />
                        <div className="timeline__content">
                            <h2 className="timeline__title">{item.title}</h2>
                            <p className="timeline__description">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;
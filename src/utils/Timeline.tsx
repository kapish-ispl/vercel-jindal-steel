import React, { useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface SlideProps {
    children: any;
}

const Timeline = ({ props, data }: any) => {
    const timelineData = useMemo(() => {
        if (!data) return [];

        return React.Children.toArray(data)
            .filter(
                (child): child is React.ReactElement<SlideProps> =>
                    React.isValidElement(child) &&
                    typeof (child.props) !== "undefined"
            )
            .map((child, index) => {
                const allChildren = React.Children.toArray(child.props.children);

                const icon = (allChildren.find(
                    (c) => React.isValidElement(c) && (c.type as any) === "icon"
                ) as React.ReactElement<any> | undefined) ?? null;

                const children = allChildren.filter(
                    (c) => !(React.isValidElement(c) && (c.type as any) === "icon")
                );

                return {
                    id: index + 1,
                    icon,
                    children,
                };
            });
    }, [data]);
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
        <div className={`timeline-container ${props.className ? props.className : ''}`} ref={container}>
            <div className="timeline">
                <div className="timeline__track" />
                <div className="timeline__progress-line" />

                {timelineData.map((item, index) => (
                    <div className="timeline__step" key={index}>
                        <div className="timeline__marker">{item.icon?.props?.children}</div>
                        <div className="timeline__content">
                            {item.children}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;
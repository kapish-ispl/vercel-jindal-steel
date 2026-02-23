"use client";

import React, { FC, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface CustomZoomScrollEffectProps {
    videourl: string;
    content?: string;
}
const CustomZoomScrollEffectV2: FC<CustomZoomScrollEffectProps> = ({ videourl, content }) => {

    const sectionRef = useRef<HTMLDivElement | null>(null);
    const imageWrapperRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLVideoElement | null>(null);
    const overlayTextRef = useRef<HTMLDivElement | null>(null);
    const [showNextSection, setShowNextSection] = useState(false);

    useGSAP(() => {
        const mm = gsap.matchMedia();
        let ctx: gsap.Context | null = null;

        const createTimeline = (endValue: string) => {
            // Set initial state: start with opacity 0
            gsap.set(imageWrapperRef.current, {
                opacity: 0,
                scale: 0.5,     // starting zoom level
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    // start: "top bottom-=90%",
                    // end: endValue,
                    start: "top bottom-=50px",
                    end: "bottom top+=80%",
                    scrub: true,
                    onUpdate: (self) => {
                        // When scroll progress reaches end
                        if (self.progress >= 0.4) {
                            setShowNextSection(true);
                        } else {
                            setShowNextSection(false);
                        }
                    },
                },
            });

            tl.to(imageWrapperRef.current, {
                scale: 1,
                opacity: 1,
                ease: "none",
            });

            // Fade in the overlay text after video animation
            tl.to(overlayTextRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
            });
        };

        const createMobileTabletTimeline = (endValue: string) => {
            // Set initial state: start with opacity 0 and fullwidth
            gsap.set(imageWrapperRef.current, {
                scale: 0.7,
                opacity: 0,
            });
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom-=100px",
                    end: endValue,
                    scrub: true,
                    // markers: true,
                    onUpdate: (self) => {
                        if (self.progress >= 0.4) {
                            setShowNextSection(true);
                        } else {
                            setShowNextSection(false);
                        }
                    },
                },
            });

            // Shrink image on scroll and fade in
            tl.to(imageWrapperRef.current, {
                scale: 1,
                opacity: 1,
                ease: "none",   // IMPORTANT for scrub animations
            });

            // Fade in the overlay text after video animation
            tl.to(overlayTextRef.current, {
                opacity: 1,
                y: 0,
                ease: "power2.out",
            });
        };

        // Set initial state for overlay text
        gsap.set(overlayTextRef.current, { opacity: 0 });

        ctx = gsap.context(() => {
            mm.add("(min-width: 1200px)", () => createTimeline("+=80%"));
            mm.add("(min-width: 992px) and (max-width: 1199px)", () => createTimeline("+=80%"));
            mm.add("(max-width: 991px)", () => createMobileTabletTimeline("+=80%"));
        }, sectionRef);

        if (imgRef.current) {
            // For video elements, check readyState and listen for 'loadeddata'
            if (imgRef.current.readyState < 4) {
                const onLoaded = () => {
                    ScrollTrigger.refresh();
                };
                imgRef.current.addEventListener("loadeddata", onLoaded, { once: true });
            } else {
                ScrollTrigger.refresh();
            }
        }

        return () => {
            if (ctx) ctx.revert();
            mm.revert();
        };
    }, []);


    return (
        // <div className="container">
        //     <div className="row">
        //     </div>
        // </div>
        <div className="col-12">
            <div
                ref={sectionRef}
                className="zoomSection"
                aria-label="image zoom pin"
            >
                <div className="zoomInner">
                    {/* Video Only - Centered zoom */}
                    <div ref={imageWrapperRef} className="zoomImageWrapperV2">
                        <video className="zoomImage" ref={imgRef} autoPlay muted loop playsInline>
                            <source src={videourl} type="video/mp4" />
                        </video>
                        {/* Overlay text - fades in after animation */}
                        <div ref={overlayTextRef} className="zoomOverlayTextV2">
                            <div className="c-heading-60 ft_light clr-white">{content}</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default CustomZoomScrollEffectV2;

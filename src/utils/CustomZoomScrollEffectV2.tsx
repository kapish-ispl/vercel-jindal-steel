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
    const [isMuted, setIsMuted] = useState(true);

    // 🔊 Toggle Sound
    const toggleSound = () => {
        if (imgRef.current) {
            const newMuted = !imgRef.current.muted;
            imgRef.current.muted = newMuted;
            imgRef.current.play(); // ensure playback continues
            setIsMuted(newMuted);
        }
    };

    useGSAP(() => {
        const mm = gsap.matchMedia();
        let ctx: gsap.Context | null = null;

        const createTimeline = (endValue: string) => {
            gsap.set(imageWrapperRef.current, {
                opacity: 0,
                scale: 0.5,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom-=50px",
                    end: "bottom top+=80%",
                    scrub: true,
                    onUpdate: (self) => {
                        setShowNextSection(self.progress >= 0.4);
                    },
                },
            });

            tl.to(imageWrapperRef.current, {
                scale: 1,
                opacity: 1,
                ease: "none",
            });

            tl.to(overlayTextRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
            });
        };

        const createMobileTabletTimeline = (endValue: string) => {
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
                    onUpdate: (self) => {
                        setShowNextSection(self.progress >= 0.4);
                    },
                },
            });

            tl.to(imageWrapperRef.current, {
                scale: 1,
                opacity: 1,
                ease: "none",
            });

            tl.to(overlayTextRef.current, {
                opacity: 1,
                y: 0,
                ease: "power2.out",
            });
        };

        gsap.set(overlayTextRef.current, { opacity: 0 });

        ctx = gsap.context(() => {
            mm.add("(min-width: 1200px)", () => createTimeline("+=80%"));
            mm.add("(min-width: 992px) and (max-width: 1199px)", () => createTimeline("+=80%"));
            mm.add("(max-width: 991px)", () => createMobileTabletTimeline("+=80%"));
        }, sectionRef);

        if (imgRef.current) {
            if (imgRef.current.readyState < 4) {
                const onLoaded = () => ScrollTrigger.refresh();
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
        <div className="col-12">
            <div ref={sectionRef} className="zoomSection" aria-label="image zoom pin">
                <div className="zoomInner">

                    <div ref={imageWrapperRef} className="zoomImageWrapperV2">
                        <video
                            className="zoomImage"
                            ref={imgRef}
                            autoPlay
                            muted={isMuted}
                            loop
                            playsInline
                        >
                            <source src={videourl} type="video/mp4" />
                        </video>

                        {/* 🔊 Sound Toggle Button */}
                        <button className="soundToggleBtn" onClick={toggleSound}>
                            {isMuted ? "🔊 Play" : "🔇 Mute"}
                        </button>

                        <div ref={overlayTextRef} className="zoomOverlayTextV2">
                            <div className="c-heading-60 ft_light clr-white">{content}</div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomZoomScrollEffectV2;
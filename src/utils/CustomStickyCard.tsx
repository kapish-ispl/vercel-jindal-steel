
"use client";

import React, { useMemo, useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CardData {
    index: number;
    title: string;
    image: string;
    description: string;
}

interface StickyCardsProps {
    stickyCardsData: CardData[];
}

const CustomStickyCards = ({ data }:any) => {
    const container = useRef<HTMLDivElement | null>(null);

    // ✅ Keep your filtering logic intact
    const panelsData: any = useMemo(() => {
        if (!data) return [];
        return data
            .filter((item: any) => item.props)
            .map((item: any, index: number) => ({
                id: index + 1,
                heading: item.props.heading,
                img: item.props.imgsrc,
                mobImg: item.props.mobimgsrc,
                children: item.props.children,
            }));
    }, [data]);

    useGSAP(
        () => {
            const stickyCards = document.querySelectorAll(".sticky-card");

            stickyCards.forEach((card, index) => {
                // ✅ First IF: pin each card until the last one
                if (index < stickyCards.length - 1) {
                    ScrollTrigger.create({
                        trigger: card,
                        start: "top top",
                        endTrigger: stickyCards[stickyCards.length - 1],
                        end: "top top",
                        pin: true,
                        pinSpacing: false,
                    });
                }

                // ✅ Second IF: add scale/rotation/fade effect while next card enters
                if (index < stickyCards.length - 1) {
                    ScrollTrigger.create({
                        trigger: stickyCards[index + 1],
                        start: "top bottom",
                        end: "top top",
                        onUpdate: (self) => {
                            const progress = self.progress;
                            const scale = 1 - progress * 0.25;
                            const rotation = (index % 2 === 0 ? 5 : -5) * progress;
                            const afterOpacity = progress;

                            gsap.set(card, {
                                scale,
                                rotation,
                                "--after-opacity": afterOpacity,
                            });
                        },
                    });
                }
            });
        },
        { scope: container }
    );

    return (
        <div ref={container} className="sticky-cards">
            {panelsData.map((cardData:any, index:number) => {
                return (
                    <div className="sticky-card" key={index} style={{ backgroundImage: `url(${cardData.img})` }}>
                        <div className="sticky-card-content">
                            <div className="container cus-container h-100">
                                <div className="row h-100">
                                    <div className="col-12 h-100">
                                        <div className="sticky-card-content-wrapper h-100">
                                            <h1 className="sticky-card-header c-heading-65">{cardData.heading}</h1>
                                            {cardData.children}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default CustomStickyCards;

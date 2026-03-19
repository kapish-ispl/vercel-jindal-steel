import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const BentoSyncReveal = ({ data }: { data: any }) => {
    const SLIDE_DATA = [
        {
            id: 1,
            mainImg: "https://picsum.photos/1920/1080?random=0",
            title: "Structured Safety Monitoring",
            desc: "Defined reporting and review systems across sites.",
            stat: "11 Million",
            statDesc: "Safe Man-hours Achieved",
            gallery: ["https://picsum.photos/1920/1080?random=1", "https://picsum.photos/1920/1080?random=2", "https://picsum.photos/1920/1080?random=3"]
        },
        {
            id: 2,
            mainImg: "https://picsum.photos/1920/1080?random=4",
            title: "Structured Safety Monitoring",
            desc: "Defined reporting and review systems across sites.",
            stat: "11 Million",
            statDesc: "Safe Man-hours Achieved",
            gallery: ["https://picsum.photos/1920/1080?random=5", "https://picsum.photos/1920/1080?random=6", "https://picsum.photos/1920/1080?random=7"]
        },
        {
            id: 3,
            mainImg: "https://picsum.photos/1920/1080?random=8",
            title: "Structured Safety Monitoring",
            desc: "Defined reporting and review systems across sites.",
            stat: "11 Million",
            statDesc: "Safe Man-hours Achieved",
            gallery: ["https://picsum.photos/1920/1080?random=9", "https://picsum.photos/1920/1080?random=10", "https://picsum.photos/1920/1080?random=11"]
        },
        {
            id: 4,
            mainImg: "https://picsum.photos/1920/1080?random=12",
            title: "Structured Safety Monitoring",
            desc: "Defined reporting and review systems across sites.",
            stat: "11 Million",
            statDesc: "Safe Man-hours Achieved",
            gallery: ["https://picsum.photos/1920/1080?random=13", "https://picsum.photos/1920/1080?random=14", "https://picsum.photos/1920/1080?random=15"]
        },
        {
            id: 5,
            mainImg: "https://picsum.photos/1920/1080?random=16",
            title: "Structured Safety Monitoring",
            desc: "Defined reporting and review systems across sites.",
            stat: "11 Million",
            statDesc: "Safe Man-hours Achieved",
            gallery: ["https://picsum.photos/1920/1080?random=17", "https://picsum.photos/1920/1080?random=18", "https://picsum.photos/1920/1080?random=19"]
        },
    ];
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: "top top",
                end: `+=${SLIDE_DATA.length * 100}%`, // Scroll length
                scrub: true,
                pin: true,
            }
        });

        const slides = gsap.utils.toArray<HTMLElement>(".slide-wrapper");

        slides.forEach((slide, index) => {
            // We only peel the slides that are on top of others
            if (index < slides.length - 1) {
                const items = slide.querySelectorAll(".grid-item");
                const currentTexts = slide.querySelectorAll(".reveal-text");

                // Sync 1: All grid items peel together
                tl.to(items, {
                    clipPath: 'inset(0% 100% 0% 0%)',
                    duration: 1,
                    stagger: 0, // Set to 0 to ensure they move in perfect sync
                    ease: 'none'
                }, index); // Using the index as a position parameter to sequence slides

                // Sync 2: Text fades/slides out at the same time
                tl.to(currentTexts, {
                    x: -50,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'none'
                }, index);
            }
        });

    }, { scope: container });

    return (
        <>
            <div className="bento-comparator" ref={container}>
                {SLIDE_DATA.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`slide-wrapper slide-${index}`}
                        style={{ zIndex: SLIDE_DATA.length - index }}
                    >
                        <div className="bento-grid">
                            {/* LARGE FEATURE */}
                            <div className="grid-item feature" style={{ backgroundImage: `url(${slide.mainImg})` }}>
                                <div className="overlay">
                                    <h3 className="reveal-text">{slide.title}</h3>
                                    <p className="reveal-text">{slide.desc}</p>
                                </div>
                            </div>

                            {/* STAT BOX */}
                            <div className="grid-item stat-box">
                                <div className="stat-content">
                                    <h4 className="reveal-text">{slide.stat}</h4>
                                    <p className="reveal-text">{slide.statDesc}</p>
                                </div>
                            </div>

                            {/* GALLERY ITEMS */}
                            {slide.gallery.map((img, i) => (
                                <div
                                    key={i}
                                    className={`grid-item thumb thumb-${i}`}
                                    style={{ backgroundImage: `url(${img})` }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </>
    );
};

export default BentoSyncReveal;
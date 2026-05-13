import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useDeviceType } from '@/hooks/useDeviceType';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const BentoSyncReveal = ({ data, props }: { data: any, props: any }) => {
    const SLIDE_DATA = [
        {
            id: 1,
            mainImg: "https://docs.jindalsteel.in/document/124/1774037370_25f62f5b64ae854414658c24b29c63f04a783410.png",
            title: "Responsible Governance",
            desc: "Oversight and accountability embedded across operations.",
            stat: "Focus",
            statDesc: "Board oversight, enterprise risk integration, regulatory compliance, and policy governance.",
            gallery: ["https://docs.jindalsteel.in/document/124/1774037370_01e1f9c1f7b0fa3c12c31340d07844a003a4abd5.png", "https://docs.jindalsteel.in/document/124/1774037370_cfbeedf25f9d7338384a57424c529f3814dffa93.png", "https://docs.jindalsteel.in/document/124/1774037370_772796c4f1c4bb6e7a2fdd302c2f5811cd65ccd7.png"]
        },
        {
            id: 2,
            mainImg: "https://docs.jindalsteel.in/document/124/1774327500_7a5705833885b84ed8dc3a979835ebc98bc97aaa.png",
            title: "Inclusive Growth",
            desc: "Defined reporting and review systems across sites.",
            stat: "Focus",
            statDesc: "Oversight and accountability embedded across operations.",
            gallery: ["https://docs.jindalsteel.in/document/124/1774327500_7a5705833885b84ed8dc3a979835ebc98bc97aaa.png", "https://docs.jindalsteel.in/document/124/1774037370_cfbeedf25f9d7338384a57424c529f3814dffa93.png", "https://docs.jindalsteel.in/document/124/1774037370_772796c4f1c4bb6e7a2fdd302c2f5811cd65ccd7.png"]
        },
        {
            id: 3,
            mainImg: "https://docs.jindalsteel.in/document/124/1774328191_3c6b374bd4d2b8e4fb03a7d94d694f247a84b52e.png",
            title: "Sustainable Environment",
            desc: "Oversight and accountability embedded across operations.",
            stat: "Focus",
            statDesc: "Emission reduction, renewable energy transition, water stewardship, and circular resource efficiency.",
            gallery: ["https://picsum.photos/1920/1080?random=9", "https://picsum.photos/1920/1080?random=10", "https://picsum.photos/1920/1080?random=11"]
        },
        {
            id: 4,
            mainImg: "https://docs.jindalsteel.in/document/124/1774328191_aaa2faf02eb6b2ca7682b337b09a86fc69b71a2c.png",
            title: "Ethical Patnership",
            desc: "Oversight and accountability embedded across operations.",
            stat: "Focus",
            statDesc: "Responsible supply chain standards, anti-corruption systems, human rights alignment and transparent conduct.",
            gallery: ["https://picsum.photos/1920/1080?random=13", "https://picsum.photos/1920/1080?random=14", "https://picsum.photos/1920/1080?random=15"]
        },
        // {
        //     id: 5,
        //     mainImg: "https://picsum.photos/1920/1080?random=16",
        //     title: "Ethical Patnership",
        //     desc: "Defined reporting and review systems across sites.",
        //     stat: "Focus",
        //     statDesc: "Responsible supply chain standards, anti-corruption systems, human rights alignment and transparent conduct.",
        //     gallery: ["https://picsum.photos/1920/1080?random=17", "https://picsum.photos/1920/1080?random=18", "https://picsum.photos/1920/1080?random=19"]
        // },
    ];
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        ScrollTrigger.normalizeScroll(true);
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: "top top",
                end: `+=${SLIDE_DATA.length * 100}%`, // Scroll length
                scrub: true,
                pin: true,
                invalidateOnRefresh: true,
                refreshPriority: 0,

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

    const device = useDeviceType();

    return (
        <>
            <div className="commonSection-md v2 d-none d-lg-block" ref={container}>
                <div className="container cus-container">
                    <div className="row">
                        <div className="col-12 col-lg-9">
                            <div className="hw mb-40">
                                <div className="c-heading-60 ft_regular clr-gray lh_1-1 mb-40">{props.sectitle}</div>
                                <p className="c-content-24 ft_light lh_1-6 clr-gray">{props.secdesc}</p>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="bento-comparator" >
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

                                            {
                                                device === "desktop" && (
                                                    <>
                                                        {/* GALLERY ITEMS */}
                                                        {slide.gallery.map((img, i) => (
                                                            <div
                                                                key={i}
                                                                className={`grid-item thumb thumb-${i}`}
                                                                style={{ backgroundImage: `url(${img})` }}
                                                            />
                                                        ))}
                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BentoSyncReveal;
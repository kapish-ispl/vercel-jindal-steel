import React, { useMemo, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Navigation } from "swiper/modules";

import 'swiper/css/effect-creative';

interface SlideProps {
    children: React.ReactNode;
}
const RotatingSlider = ({ data }: { data: any }) => {
    // const [activeIndex, setActiveIndex] = useState(1);
    // const handleSlideChange = (swiper: any) => {
    //     setActiveIndex(swiper.realIndex + 1);
    // };
    const slides = useMemo(() => {
        if (!data) return [];

        return React.Children.toArray(data)
            .filter(
                (child): child is React.ReactElement<SlideProps> =>
                    React.isValidElement(child) &&
                    typeof (child.props) !== "undefined"
            )
            .map((child, index) => ({
                id: index + 1,
                children: child.props.children,
            }));
    }, [data]);

    return (
        <>
            <Swiper
                modules={[EffectCreative, Navigation]}
                effect={'creative'}
                slidesPerView={1.2}
                speed={600}
                watchSlidesProgress={true}
                grabCursor={true}
                centeredSlides={false}
                navigation={{
                    nextEl: '.right-btn',
                    prevEl: '.left-btn',
                }}
                loop={true}
                creativeEffect={{
                    limitProgress: 3,
                    perspective: true,
                    prev: {
                        translate: ['-5%', 0, -500],
                        opacity: 0,
                        scale: 0.9,
                    },
                    next: {
                        translate: ['100%', 0, 0],
                    },
                }}
                breakpoints={{
                    768: { slidesPerView: 2.2 },
                    1024: { slidesPerView: 2.5 },
                    1600: { slidesPerView: 2.1 },
                }}
                style={{ overflow: 'visible' }}
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id} style={{ transitionTimingFunction: "ease-out" }}>
                        {slide.children}
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}

export default RotatingSlider
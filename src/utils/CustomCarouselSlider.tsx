"use client";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import EffectCarousel from '@/modules/CarouselSliderEffect'
import {
    Autoplay,
} from "swiper/modules";

interface CustomCarouselSliderProps {
    data: React.ReactNode[];
}
interface SlideProps {
    mediasrc: string;
    title?: string;
    des?: string;
}

const CustomCarouselSlider: React.FC<CustomCarouselSliderProps> = ({ data }) => {

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
                img: child.props.mediasrc,
                title: child.props.title,
                des: child.props.des,
            }));
    }, [data]);

    return (
        <Swiper
            modules={[Autoplay, EffectCarousel]}
            effect="carousel"
            carouselEffect={{
                opacityStep: 0.33,
                scaleStep: 0.1,
                sideSlides: 2,
            }}
            centeredSlides
            slidesPerView="auto"
            spaceBetween={24}
            grabCursor
            loop
            loopAdditionalSlides={1}
            autoplay={{
                delay: 12000,
                disableOnInteraction: false,
            }}
            navigation
            pagination={{ clickable: true }}
            className="swiper-carousel"
        >
            {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                    <div>
                        <div className="slide-img-wrap swiper-carousel-animate-opacity"><img  src={slide.img} alt={slide.title} /></div>
                        <div className="slide-content">
                            <h2>{slide.title}</h2>
                            <p className="c-content-20 w-100 text-center lh_1-4 ft_light clr-gray">{slide.des}</p> 
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default CustomCarouselSlider;

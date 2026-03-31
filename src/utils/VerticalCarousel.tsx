'use client'
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

import { useDeviceType } from '@/hooks/useDeviceType';

export default function VerticalCarousel({ data }: { data: any }) {
    const filteredData = data.filter((item: any) => item.props !== undefined);
    const totalSlides = filteredData.length;

    const [activeIndex, setActiveIndex] = useState(1);

    const handleSlideChange = (swiper: any) => {
        setActiveIndex(swiper.realIndex + 1);
    };

    const thumbHeight = totalSlides > 0 ? (1 / totalSlides) * 100 : 0;
    const thumbTop = totalSlides > 0 ? ((activeIndex - 1) / totalSlides) * 100 : 0;
    const deviceType = useDeviceType();

    return (
        <div className="carousel-wrapper">
            <Swiper
                direction={deviceType === 'desktop' ? 'vertical' : 'horizontal'}
                slidesPerView={1}
                spaceBetween={0}
                loop={totalSlides > 1}
                allowTouchMove={true}
                onSlideChange={handleSlideChange}
                navigation={{
                    nextEl: '.down-btn',
                    prevEl: '.up-btn',
                }}
                modules={[Pagination, Navigation]}
                className="mySwiper c-swiperSlider"
            >
                {filteredData.length > 0 && filteredData.map((item: any, index: number) => (
                    <SwiperSlide key={index}>
                        <div className="row align-items-center">
                            {item.props.children}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Pagination Container - Moved back to React for smooth transition */}
            {totalSlides > 1 && (
                <div className="custom-pagination">
                    <div className="fraction">{activeIndex} / {totalSlides}</div>
                    <div className="progress-container">
                        <div className="progress-bar" style={deviceType === 'desktop' ? { height: `${thumbHeight}%`, top: `${thumbTop}%` } : { width: `${thumbHeight}%`, left: `${thumbTop}%`, height: "100%" }}></div>
                    </div>
                </div>
            )}

            {/* Navigation Arrows */}
            {totalSlides > 1 && (
                <div className="nav-buttons">
                    <button className="up-btn"><span><svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.52366 16.2646L13.2713 11.517L18.019 16.2646L19.5827 14.7009L13.2713 8.38951L6.95991 14.7009L8.52366 16.2646Z" fill="#636466" />
                    </svg>
                    </span></button>
                    <button className="down-btn"><span><svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.52366 16.2646L13.2713 11.517L18.019 16.2646L19.5827 14.7009L13.2713 8.38951L6.95991 14.7009L8.52366 16.2646Z" fill="#636466" />
                    </svg>
                    </span></button>
                </div>
            )}
        </div>
    );
}
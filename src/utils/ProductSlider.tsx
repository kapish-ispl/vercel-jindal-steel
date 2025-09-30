"use client";
import React, { useRef, useState } from "react";
import Slider, { Settings } from "react-slick";

interface PostItem {
    title: string;
    category: string;
    content: string;
    media: { cdnPath: string }[];
}

interface ProductSliderProps {
    postData: PostItem[];
}

interface ArrowProps {
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const NextArrow: React.FC<ArrowProps> = ({ onClick }) => (
    <div className="custom-arrow next cursor-pointer" onClick={onClick}>
        <svg
            width="45"
            height="28"
            viewBox="0 0 45 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M15.7916 27.4435C15.0277 28.1857 13.789 28.1853 13.0249 27.4435L0.573056 15.3442C-0.191016 14.6017 -0.191016 13.3983 0.573057 12.6558L13.0249 0.556541C13.789 -0.185334 15.0277 -0.18571 15.7916 0.556541C16.5554 1.29879 16.5551 2.50238 15.7916 3.24486L6.67957 12.0989L45 12.0989L45 15.9011L6.67957 15.9011L15.7916 24.7551C16.5551 25.4976 16.5554 26.7012 15.7916 27.4435Z"
                fill="#446183"
            />
        </svg>
    </div>
);

const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
    <div className="custom-arrow prev cursor-pointer" onClick={onClick}>
        <svg
            width="45"
            height="28"
            viewBox="0 0 45 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M15.7916 27.4435C15.0277 28.1857 13.789 28.1853 13.0249 27.4435L0.573056 15.3442C-0.191016 14.6017 -0.191016 13.3983 0.573057 12.6558L13.0249 0.556541C13.789 -0.185334 15.0277 -0.18571 15.7916 0.556541C16.5554 1.29879 16.5551 2.50238 15.7916 3.24486L6.67957 12.0989L45 12.0989L45 15.9011L6.67957 15.9011L15.7916 24.7551C16.5551 25.4976 16.5554 26.7012 15.7916 27.4435Z"
                fill="#446183"
            />
        </svg>
    </div>
);

const ProductSlider: React.FC<ProductSliderProps> = ({ postData }) => {
    const sliderRef = useRef<Slider>(null);
    const categoryRef = useRef<Slider>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const productSettings: Settings = {
        centerMode: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 3,
        centerPadding: "0",
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        afterChange: (index: number) => {
            setActiveIndex(index);
            categoryRef.current?.slickGoTo(index); // keep category centered
        },
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    slidesToShow: 1,
                    centerPadding: "0",
                },
            },
        ],
    };

    const categorySettings: Settings = {
        centerMode: true,
        infinite: true,
        slidesToShow: 5,
        arrows: false,
        centerPadding: "0",
        beforeChange: (current, next) => {
            console.log("category breakpoint fired", window.innerWidth);
            sliderRef.current?.slickGoTo(next);
            setActiveIndex(next);
        },
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };


    return (
        <div className="slider-wrapper">
            {/* Category Slider */}
            <Slider
                ref={categoryRef}
                {...categorySettings}
                className="category-slider mb-4"
            >
                {postData.map((item, index) => (
                    <div key={index} className="px-2">
                        <div
                            className={`cursor-pointer ${activeIndex === index
                                ? "c-heading-40 clr-blue font-bold"
                                : ""
                                }`}
                            onClick={() => {
                                sliderRef.current?.slickGoTo(index);
                                categoryRef.current?.slickGoTo(index);
                                setActiveIndex(index);
                            }}
                        >
                            {item.title}
                        </div>
                    </div>
                ))}
            </Slider>

            {/* Product Slider */}
            <Slider
                ref={sliderRef}
                {...productSettings}
                className="centermode-slider"
            >
                {postData.map((item, index) => (
                    <div key={index} className="slide-item">
                        <div className="slide-category text-center font-semibold mb-2">
                            {item.category}
                        </div>
                        <div className="slider_wrapper">
                            <div className="ratio ratio-4x3">
                                <img
                                    alt={item.title}
                                    className="img-fluid u-img"
                                    src={item.media[0]?.cdnPath ?? ""}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>

            {postData[activeIndex] && (
                <div className="text-center mt-5">
                    <p className="w-75 m-auto">{postData[activeIndex].content}</p>
                </div>
            )}
        </div>
    );
};

export default ProductSlider;

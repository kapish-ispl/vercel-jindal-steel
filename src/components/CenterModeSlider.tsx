"use client";
import React from "react";
import Slider from "react-slick";

interface ArrowProps {
    onClick?: () => void;
}

// Custom Arrow Components
const NextArrow = (props: ArrowProps) => {
    const { onClick } = props;
    return (
        <div className="custom-arrow next cursor-pointer" onClick={onClick}>
            <svg width="45" height="28" viewBox="0 0 45 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.7916 27.4435C15.0277 28.1857 13.789 28.1853 13.0249 27.4435L0.573056 15.3442C-0.191016 14.6017 -0.191016 13.3983 0.573057 12.6558L13.0249 0.556541C13.789 -0.185334 15.0277 -0.18571 15.7916 0.556541C16.5554 1.29879 16.5551 2.50238 15.7916 3.24486L6.67957 12.0989L45 12.0989L45 15.9011L6.67957 15.9011L15.7916 24.7551C16.5551 25.4976 16.5554 26.7012 15.7916 27.4435Z" fill="#446183" />
            </svg>

        </div>
    );
};

const PrevArrow = (props: ArrowProps) => {
    const { onClick } = props;
    return (
        <div className="custom-arrow prev cursor-pointer" onClick={onClick}>
            <svg width="45" height="28" viewBox="0 0 45 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.7916 27.4435C15.0277 28.1857 13.789 28.1853 13.0249 27.4435L0.573056 15.3442C-0.191016 14.6017 -0.191016 13.3983 0.573057 12.6558L13.0249 0.556541C13.789 -0.185334 15.0277 -0.18571 15.7916 0.556541C16.5554 1.29879 16.5551 2.50238 15.7916 3.24486L6.67957 12.0989L45 12.0989L45 15.9011L6.67957 15.9011L15.7916 24.7551C16.5551 25.4976 16.5554 26.7012 15.7916 27.4435Z" fill="#446183" />
            </svg>

        </div>
    );
};

const CenterModeSlider = (props: any) => {
    const { data, itemstoshow, } = props;
    const filteredSlides = data?.filter((items: any) => items.props !== undefined);;

    const settings = {
        centerMode: true,
        infinite: true,
        slidesToShow: Number(itemstoshow) || 3,
        centerPadding: "0",
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
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

    return (

        <>
            {
                filteredSlides.length > 1 ?
                    <>
                        <Slider {...settings} className="centermode-slider">
                            {filteredSlides?.map((item: any, index: number) => (
                                <div key={index} className={`slide-item ${item?.props?.className}}`}>
                                    {item.props.children}
                                </div>
                            ))}
                        </Slider>
                    </> :
                    <>
                        <div className="row">
                            {filteredSlides?.map((info: any) => (
                                <div className="col-12" key={info.key}>
                                    <div className={info.props.className} style={{ height: "100%" }}>
                                        {info.props.children}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
            }
        </>
    );
};

export default CenterModeSlider;

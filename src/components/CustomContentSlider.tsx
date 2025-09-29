"use client";
import React from "react";
import Slider from "react-slick";

interface ArrowProps {
    onClick?: () => void;
}

const NextArrow = (props: ArrowProps) => {
    const { onClick } = props;
    return (
        <div className="custom-arrow next cursor-pointer" onClick={onClick}>
            <svg width="44" height="27" viewBox="0 0 44 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_96_665)">
                    <path d="M4.31047 11.3799L42.2305 11.3799C43.2005 11.3799 43.9805 12.1599 43.9805 13.1299C43.9805 14.0999 43.2005 14.8799 42.2305 14.8799L4.31047 14.8799C3.34047 14.8799 2.56047 14.0999 2.56047 13.1299C2.56047 12.1599 3.34047 11.3799 4.31047 11.3799Z" fill="#626466" />
                    <path d="M13.8496 -0.000244294C14.2996 -0.000244254 14.7496 0.169756 15.0896 0.509756C15.7696 1.18976 15.7696 2.29976 15.0896 2.97976L4.94961 13.1198L15.0896 23.2698C15.7696 23.9498 15.7696 25.0598 15.0896 25.7398C14.4096 26.4198 13.2996 26.4198 12.6196 25.7398L-0.000389859 13.1198L12.6196 0.499756C12.9596 0.159755 13.4096 -0.0102446 13.8596 -0.0102445L13.8496 -0.000244294Z" fill="#626466" />
                </g>
                <defs>
                    <clipPath id="clip0_96_665">
                        <rect width="43.98" height="26.26" fill="white" transform="translate(43.9805 26.2598) rotate(-180)" />
                    </clipPath>
                </defs>
            </svg>
        </div>
    );
};

const PrevArrow = (props: ArrowProps) => {
    const { onClick } = props;
    return (
        <div className="custom-arrow prev cursor-pointer" onClick={onClick}>
            <svg width="44" height="27" viewBox="0 0 44 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_96_665)">
                    <path d="M4.31047 11.3799L42.2305 11.3799C43.2005 11.3799 43.9805 12.1599 43.9805 13.1299C43.9805 14.0999 43.2005 14.8799 42.2305 14.8799L4.31047 14.8799C3.34047 14.8799 2.56047 14.0999 2.56047 13.1299C2.56047 12.1599 3.34047 11.3799 4.31047 11.3799Z" fill="#626466" />
                    <path d="M13.8496 -0.000244294C14.2996 -0.000244254 14.7496 0.169756 15.0896 0.509756C15.7696 1.18976 15.7696 2.29976 15.0896 2.97976L4.94961 13.1198L15.0896 23.2698C15.7696 23.9498 15.7696 25.0598 15.0896 25.7398C14.4096 26.4198 13.2996 26.4198 12.6196 25.7398L-0.000389859 13.1198L12.6196 0.499756C12.9596 0.159755 13.4096 -0.0102446 13.8596 -0.0102445L13.8496 -0.000244294Z" fill="#626466" />
                </g>
                <defs>
                    <clipPath id="clip0_96_665">
                        <rect width="43.98" height="26.26" fill="white" transform="translate(43.9805 26.2598) rotate(-180)" />
                    </clipPath>
                </defs>
            </svg>

        </div>
    );
};

const CustomContentSlider = (props: any,) => {
    const { itemstoshow, data, showdots, centermode, showarrow } = props;
    const finalData = data.filter((items: any) => items.props !== undefined);
    const itemCount = finalData.length;
    const slidesToShow = Number(itemstoshow) || 4;
    const centerMode = centermode === 'yes' ? true : false;


    const settings = {
        arrows: showarrow === "yes" && itemCount > slidesToShow,
        dots: showdots === "yes" && itemCount > slidesToShow,
        autoplay: itemCount > slidesToShow,
        autoplaySpeed: 2000,
        infinite: itemCount > slidesToShow,
        slidesToShow: slidesToShow,
        slidesToScroll: 1,
        centerMode: centerMode,
        centerPadding: "0",
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: slidesToShow < 2 ? slidesToShow : 3,
                    slidesToScroll: slidesToShow < 2 ? slidesToShow : 3,
                    arrows: true,
                },
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: slidesToShow <= 1 ? slidesToShow : 2,
                    slidesToScroll: slidesToShow <= 1 ? slidesToShow : 2,
                    arrows: true,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows: true,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: true,
                },
            },
        ],
    };

    return (
        <>
            {itemCount > 1 ? (
                <div>
                    <Slider {...settings}>
                        {finalData.map((info: any) => (
                            <div className={info.props.className} key={info.key}>
                                {info.props.children}
                            </div>
                        ))}
                    </Slider>
                </div>
            ) : (
                <div className="row">
                    {finalData.map((info: any) => (
                        <div className="col-12" key={info.key}>
                            <div className={info.props.className} style={{ height: "100%" }}>
                                {info.props.children}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default CustomContentSlider;
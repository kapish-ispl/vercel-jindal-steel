"use client";

import Image from "next/image";
import { FC } from "react";
import Link from "next/link";
import Slider from "react-slick";

const HomeBanner: FC<{ bannerMedia: any }> = ({ bannerMedia }) => {

    // eslint-disable-next-line no-var
    var settings = {
        dots: false,
        arrows: true,
        infinite: true,
        fade: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 4000,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <>
            {bannerMedia && bannerMedia.length > 0 &&
                <div className="c-banner__wrapper">
                    <div className="c-banner__wrapper__item_desktop slider__arrow">
                        <Slider {...settings} >
                            {bannerMedia.map((data: any, index: any) => {
                                return (
                                    data.type === "video" ? (
                                        <video key={data.cdnPath} loop={true} muted={true} autoPlay={true} playsInline={true} className={`c-banner__item_desktop`}>
                                            <source src={data.cdnPath} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <>
                                            <Image
                                                key={data.cdnPath}
                                                src={data.cdnPath}
                                                alt="industry"
                                                width={1920}
                                                height={1080}
                                                className={`c-banner__item_desktop img-fluid`}
                                                style={{
                                                    objectFit: "cover",
                                                    objectPosition: "center",
                                                }}
                                            />
                                            <div className="banner_overlappingText" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="300" data-aos-easing="ease-out">
                                                <div className="container custom_container">
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <div className="banner__box">
                                                                <div className="banner__title" dangerouslySetInnerHTML={{ __html: data.title }}></div>
                                                                <div className="banner__content" dangerouslySetInnerHTML={{ __html: data.description }}></div>
                                                                {/* <div dangerouslySetInnerHTML={{ __html: data.caption }} /> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                )
                            }

                            )}
                        </Slider>
                    </div>
                </div>
            }
        </>
    )
}

export default HomeBanner;
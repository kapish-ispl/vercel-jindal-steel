"use client";

import Image from "next/image";
import { FC } from "react";
import Slider from "react-slick";

interface BannerMedia {
    type: string;
    cdnPath: string;
}

interface Props {
    bannerMedia: BannerMedia[];
    tagline: string;
    pageTitle: string;
}
const HomeBanner: FC<Props> = ({ bannerMedia, tagline, pageTitle }) => {
    const settings = {
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
                            {bannerMedia.map((data: BannerMedia, index: number) => {
                                return (
                                    data.type === "video" ? (
                                        <video key={data.cdnPath} loop={true} muted={true} autoPlay={true} playsInline={true} className={`c-banner__item_desktop`}>
                                            <source src={data.cdnPath} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <>
                                            <Image
                                                key={index}
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

                                        </>
                                    )
                                )
                            }

                            )}
                        </Slider>
                    </div>
                    <div className="container cus-container">
                        <div className="row">
                            <div className="col-12">
                                <h1 className="banner__title">
                                    {tagline != undefined ?
                                        <div
                                            dangerouslySetInnerHTML={{ __html: tagline }}
                                        />
                                        :
                                        pageTitle
                                    }
                                </h1>
                            </div>
                        </div>
                    </div>

                </div>
            }
        </>
    )
}

export default HomeBanner;
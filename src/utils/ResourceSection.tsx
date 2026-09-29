
import { MONTH_NAMES } from "@/config/config";
import Link from "next/link";
import CustomSilder from "./CustomSilder";
import React from "react";
import parse from 'html-react-parser'

const ResourceSection = ({ postData, compSlug }: any) => {
    return (
        <>
            <div className="col-12 position-relative c-cardView v7 fixSpace  c-verticalSlider cus-embla-arrow">
                <CustomSilder arrows="true" cls="mb-0" customcls="buttons_absolute" items="[3,3,2,1]">
                    {postData && postData.length > 0 && postData.map((post: any, index: any) => {

                        let dataLink = "#";
                        if (post.featuredMedia.length == 0) {
                            dataLink = "#";
                        } else {
                            if (post.featuredMedia.type === "attachment") {
                                dataLink = post.featuredMedia.cdnPath;
                            }
                        }

                        const finalDate = post.postingDate;
                        let newDate = "";
                        let date, year, month, day;
                        if (finalDate != undefined && finalDate != "") {
                            const getDate = finalDate.split("-");
                            if (getDate[0].length == 4) {
                                date = new Date(getDate[0], (getDate[1] - 1), getDate[2]);
                            } else {
                                date = new Date(getDate[2], (getDate[1] - 1), getDate[0]);
                            }

                            year = date.getFullYear();
                            month = MONTH_NAMES[date.getMonth()];
                            day = date.getDate();
                            newDate = `${day} ${month} ${year}`;
                        }

                        return (
                            <React.Fragment key={index}>
                                {compSlug === 'policies-reports' &&
                                    <div className="c-cardView__box sliderbox">
                                        <Link prefetch={false} className="c-cardView__box-item d-block text-decoration-none" href={dataLink} target={post.featuredMedia.type === "attachment" ? '_blank' : '_self'}>

                                            <div className="card__media mb-4"><img alt="icon" className="img-fluid u-img" height={80} width={80} src="https://docs.jindalsteel.in/document/124/1763976839___2.png" />
                                                <div className="label c-content-18 clr-gray ft_semiBold">{newDate !== "" ? newDate : ""}</div>
                                            </div>

                                            <div className="card__content mb-3">
                                                <div className="card__content__title">
                                                    <div className="c-content-24 ft_semiBold mb-3 clr-blue">{post.metaInfo && post.metaInfo.type ? post.metaInfo.type : post.metaInfo && post.metaInfo.category !== "" ? post.metaInfo.category : 'Press Release'} </div>
                                                </div>

                                                <div className="card__content-box ">
                                                    <div className="desc c-content-19 ft_light clr-gray line-clamp-2">{post.title}</div>
                                                </div>


                                            </div>
                                            <div className="action-btn c-cardView__box-item--action"><span className="leftarrow"><span className="icon-move-right icon"></span></span></div>
                                            <p className="d-none">{parse(post?.content)}</p>
                                        </Link>
                                    </div>
                                }
                                {
                                    compSlug === 'jspl-media-coverage' &&

                                    <div className="c-cardView__wrapper aos-init aos-animate" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000">
                                        <a className="c-cardView__wrapper-media ratio ratio-16x9 cursor-pointer" href="#">
                                            <img alt="card title" className="img-fluid u-img" src={post.media[0].cdnPath} />
                                        </a>
                                        <span className="c-cardView__wrapper-content v3">
                                            <span className="c-content-24 ft_semiBold mb-3 clr-blue">{newDate !== "" ? newDate : ""}</span>
                                            <span className="desc c-content-19 ft_light clr-gray line-clamp-4">{post.title}</span>
                                        </span>
                                    </div>
                                }
                            </React.Fragment>
                        )
                    })}
                </CustomSilder>
            </div>
        </>
    )
}

export default ResourceSection;
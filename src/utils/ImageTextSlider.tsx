import React from 'react'
import CustomSilder from './CustomSilder';
import { MONTH_NAMES } from "@/config/config";
import Link from 'next/link';

const ImageTextSlider = ({ postData }: any) => {
    return (
        <div className='position-relative c-cardView v7 c-verticalSlider cus-embla-arrow'>
            <CustomSilder arrows="true" cls="mb-5" customcls="buttons_absolute" items="[2,2,1]">
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
                            <div className="c-cardView__wrapper mr-30">
                                <Link className="c-cardView__wrapper-media ratio ratio-16x9 cursor-pointer" href="#">
                                    <img alt="card title" className="img-fluid u-img" src={post.media[0].cdnPath} />
                                </Link>
                                <span className="c-cardView__wrapper-content v2">
                                    <span className="title clr-blue c-content-25 ft_bold lh_1-3">{post.title}</span>
                                    <span className="desc c-content-19 clr-gray">{post.content}</span>
                                </span>
                            </div>
                        </React.Fragment>
                    )
                })}
            </CustomSilder>
        </div>
    )
}

export default ImageTextSlider

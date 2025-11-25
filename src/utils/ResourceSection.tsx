
import { monthNames } from "@/config/config";
import Link from "next/link";
import CustomSilder from "./CustomSilder";

const ResourceSection = ({ postData, compSlug }: any) => {
    console.log(postData);
    return (
        <>
            <div className="col-12 position-relative c-cardView v7 cus-embla-arrow">
                {compSlug == "policies-reports" &&
                    <CustomSilder arrows="true" cls="mb-5" customcls="buttons_absolute" items="[3,2,2]">
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
                                let getDate = finalDate.split("-");
                                if (getDate[0].length == 4) {
                                    date = new Date(getDate[0], (getDate[1] - 1), getDate[2]);
                                } else {
                                    date = new Date(getDate[2], (getDate[1] - 1), getDate[0]);
                                }

                                year = date.getFullYear();
                                month = monthNames[date.getMonth()];
                                day = date.getDate();
                                newDate = `${day} ${month} ${year}`;
                            }

                            return (
                                <div className="c-cardView__box">
                                    <div className="c-cardView__box-item">
                                        <div className="card__media mb-40"><img alt="icon" className="img-fluid u-img" src="https://docs.jindalsteel.in/document/124/1763976839___2.png" /></div>

                                        <div className="card__content">
                                            <div className="card__content__title">
                                                <div className="c-heading-40 mb-40 clr-blue">{post.metaInfo && post.metaInfo.type ? post.metaInfo.type : post.metaInfo && post.metaInfo.category !== "" ? post.metaInfo.category : 'Press Release'} </div>
                                            </div>

                                            <div className="card__content-box">
                                                <div className="label">{newDate !== "" ? newDate : ""}</div>

                                                <div className="desc">{post.title}</div>
                                            </div>

                                            <div className="action-btn mt-30"><Link className="u-btn" href={dataLink} target={post.featuredMedia.type === "attachment" ? '_blank' : '_self'}><span className="icon-move-right icon"></span></Link></div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </CustomSilder>
                }

            </div>
        </>
    )
}

export default ResourceSection;
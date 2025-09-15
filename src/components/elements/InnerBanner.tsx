import Image from "next/image";
import Breadcrumbs from "./Breadcrumbs";

const InnerBanner = ({ label, slug, currentPage, innerBanner }: any) => {
    return (
        <>
            <div className={`c-inner-banner ${innerBanner.length > 0 ? "" : "without-banner"}`}>
                {innerBanner.length > 0 &&
                    <div className="c-inner-banner__media">
                        {innerBanner[0].type == 'video' ?
                            <video
                                loop={true}
                                muted={true}
                                autoPlay={true}
                                playsInline={true}
                                className="c-inner-banner__video">
                                <source src={innerBanner[0].cdnPath} type="video/mp4" />
                            </video>
                            :
                            <Image
                                src={innerBanner[0].cdnPath}
                                alt={innerBanner[0].caption == null ? 'SISCOL' : innerBanner[0].caption}
                                fill
                                className={`c-inner-banner__image`}
                            />
                        }
                    </div>
                }

                <div className="c-inner-banner__content">
                    <div className="container custom_container">
                        <div className="row">
                            <div className="col-12">
                                <div className="c-inner-banner__content_box">
                                    <h1 className="banner_heading">{label}</h1>
                                    {/* <div className="breadcumbs">
                                        <nav aria-label="breadcrumb">
                                            <Breadcrumbs currentPage={currentPage} slug={slug} />
                                        </nav>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InnerBanner;
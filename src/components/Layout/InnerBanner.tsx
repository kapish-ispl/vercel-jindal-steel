import Breadcrumbs from "./Breadcrumbs";

interface InnerBannerItem {
    type: "video" | "image";
    cdnPath: string;
    caption?: string | null;
}

interface Props {
    label?: string;
    slug: string;
    tagline?: string;
    currentPage: string[];
    innerBanner?: InnerBannerItem[];
}

const InnerBanner = ({ label, tagline, slug, currentPage, innerBanner }: Props) => {
    return (
        <div
            className={`c-inner-banner ${(innerBanner?.length ?? 0) > 0 ? "" : "without-banner"
                }`}
        >
            {(innerBanner?.length ?? 0) > 0 && (
                <div className="c-inner-banner__media">
                    {innerBanner?.[0]?.type === "video" ? (
                        <video
                            loop
                            muted
                            autoPlay
                            playsInline
                            className="c-inner-banner__video"
                        >
                            <source src={innerBanner?.[0]?.cdnPath} type="video/mp4" />
                        </video>
                    ) : (
                        <img
                            src={innerBanner?.[0]?.cdnPath}
                            alt={
                                innerBanner?.[0]?.caption === null
                                    ? "JSP Banner"
                                    : innerBanner?.[0]?.caption || "JSP Banner"
                            }
                            className="c-inner-banner__image"
                        />
                    )}
                </div>
            )}

            <div className="c-inner-banner__content">
                <div className="container cus-container">
                    <div className="row">
                        <div className="col-12">
                            <div className="c-inner-banner__content_box">
                                <h1 className="banner__title">
                                    {tagline != undefined ?
                                        <div
                                            dangerouslySetInnerHTML={{ __html: tagline }}
                                        />
                                        :
                                        label
                                    }
                                </h1>
                                <div className="breadcumbs">
                                    <nav aria-label="breadcrumb">
                                        <Breadcrumbs currentPage={currentPage} slug={slug} />
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InnerBanner;
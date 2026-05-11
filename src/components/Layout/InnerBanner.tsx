// import Breadcrumbs from "./Breadcrumbs";

// interface InnerBannerItem {
//     type: "video" | "image";
//     cdnPath: string;
//     caption?: string | null;
// }

// interface Props {
//     label?: string;
//     slug: string;
//     tagline?: string;
//     currentPage: string[];
//     innerBanner?: InnerBannerItem[];
// }

// const InnerBanner = ({ label, tagline, slug, currentPage, innerBanner }: Props) => {
//     return (
//         <div
//             className={`c-inner-banner ${(innerBanner?.length ?? 0) > 0 ? "" : "without-banner"
//                 }`}
//         >
//             {(innerBanner?.length ?? 0) > 0 && (
//                 <div className="c-inner-banner__media">
//                     {innerBanner?.[0]?.type === "video" ? (
//                         <video
//                             loop
//                             muted
//                             autoPlay
//                             playsInline
//                             className="c-inner-banner__video"
//                         >
//                             <source src={innerBanner?.[0]?.cdnPath} type="video/mp4" />
//                         </video>
//                     ) : (
//                         <img
//                             src={innerBanner?.[0]?.cdnPath}
//                             alt={
//                                 innerBanner?.[0]?.caption === null
//                                     ? "JSP Banner"
//                                     : innerBanner?.[0]?.caption || "JSP Banner"
//                             }
//                             className="c-inner-banner__image"
//                         />
//                     )}
//                 </div>
//             )}

//             <div className="c-inner-banner__content">
//                 <div className="container cus-container">
//                     <div className="row">
//                         <div className="col-12">
//                             <div className="c-inner-banner__content_box">
//                                 <h1 className="banner__title">
//                                     {tagline != undefined ?
//                                         <div
//                                             dangerouslySetInnerHTML={{ __html: tagline }}
//                                         />
//                                         :
//                                         label
//                                     }
//                                 </h1>
//                                 <div className="breadcumbs">
//                                     <nav aria-label="breadcrumb">
//                                         <Breadcrumbs currentPage={currentPage} slug={slug} />
//                                     </nav>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default InnerBanner;

import Breadcrumbs from "./Breadcrumbs";

interface InnerBannerItem {
    type: "video" | "image";
    cdnPath: string;
    caption?: string | null;
    deviceType?: string | null;
}

interface Props {
    label: any;
    slug: string;
    tagline: any;
    currentPage: string[];
    innerBanner: InnerBannerItem[];
}

const renderMedia = (item: InnerBannerItem | undefined) => {
    if (!item) return null;

    if (item.type === "video") {
        return (
            <video loop muted autoPlay playsInline className="c-inner-banner__video">
                <source src={item.cdnPath} type="video/mp4" />
            </video>
        );
    }

    return (
        <img
            src={item.cdnPath}
            alt={item.caption || "JSP Banner"}
            className="c-inner-banner__image"
        />
    );
};

const InnerBanner = ({ label, tagline, slug, currentPage, innerBanner = [] }: Props) => {

    const desktopMedia =
        innerBanner.find((m) => m.deviceType === "desktop") || innerBanner[0];


    const mobileMedia =
        innerBanner.find((m) => m.deviceType === "mobile") ||
        desktopMedia;

    const tabletMedia =
        innerBanner.find((m) => m.deviceType === "tablet") ||
        mobileMedia;
    return (
        <div className={`c-inner-banner ${innerBanner.length > 0 ? "" : "without-banner"}`}>
            {innerBanner.length > 0 && (
                <div className="c-inner-banner__media">

                    {/* Desktop */}
                    <div className="d-none d-lg-block w-100 h-100 p-relative">
                        {renderMedia(desktopMedia)}
                    </div>

                    {/* Tablet */}
                    <div className="d-lg-none d-md-block d-none w-100 h-100 p-relative">
                        {renderMedia(tabletMedia)}
                    </div>
                    {/* Mobile */}
                    <div className="d-lg-none d-md-none w-100 h-100 p-relative">
                        {renderMedia(mobileMedia)}
                    </div>

                </div>
            )}

            <div className="c-inner-banner__content">
                <div className="container cus-container">
                    <div className="row">
                        <div className="col-12">
                            <div className="c-inner-banner__content_box">

                                <h1 className="banner__title">
                                    {tagline !== undefined ? (
                                        <div
                                            dangerouslySetInnerHTML={{ __html: tagline }}
                                        />
                                    ) : (
                                       label !== undefined ? (
                                        <div
                                            dangerouslySetInnerHTML={{ __html: label }}
                                        />
                                    ) : (
                                        <div>Default Title</div>  
                                    ))}
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
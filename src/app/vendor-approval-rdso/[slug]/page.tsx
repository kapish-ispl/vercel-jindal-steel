import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";

import { CONSTANTS } from "@/config/constant";
import { getPostData } from "@/lib/getPostData";
import { getPageMetadata } from "@/lib/metadata";
import InnerBanner from "@/components/Layout/InnerBanner";
import PageTemplate from "@/components/Layout/PageTemplate";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const rawSlug = typeof slug === "string" ? slug : "";
    const fetchedInfo = await getPostData(rawSlug);
    return getPageMetadata(fetchedInfo?.data);
}

export default async function Page({
    params,
}: {
    params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { slug } = await params;

    if (slug === "home") {
        redirect("/");
    }

    const rawSlug = typeof slug === "string" ? slug : "";
    const fetchedInfo = await getPostData(rawSlug);

    // Safer check
    if (fetchedInfo?.code === CONSTANTS.STATUS_NOT_FOUND || !fetchedInfo?.data) return notFound();

    const pageData: any = fetchedInfo.data;

    // Pick only image/video media and use the first matching item as the banner
    const bannerMedia = (pageData?.media ?? []).filter(
        (item: { type?: string }) => item?.type === "image" || item?.type === "video"
    );
    const innerBannerMedia = bannerMedia.length > 0 ? [bannerMedia[0]] : [];

    return (
        <>
            <div className="container-fluid generic_bottom_spacer">
                <div className="row">
                    <div className="col-12 p-0">
                        <InnerBanner
                            label={pageData?.metaInfo?.title || pageData.title}
                            tagline={pageData?.customField?.tagline}
                            slug={pageData.slug}
                            currentPage={{
                                ...pageData,
                                slug: `/vendor-approval-rdso/${pageData.slug}`,
                                parentPageDetails: {
                                    id: pageData?.taxonomy_id,
                                    title: "Vendor Approval RDSO",
                                    slug: "vendor-approval-rdso",
                                },
                            }}
                            innerBanner={innerBannerMedia}
                        />
                    </div>

                    {/* ✅ Content */}
                    <PageTemplate data={pageData} />
                </div>
            </div>
        </>
    );
}

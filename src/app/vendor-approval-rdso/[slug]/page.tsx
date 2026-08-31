import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";

import { GET_SPECIFIC_POST_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import { serverRequest } from "@/services/getServerSideRender";
import InnerBanner from "@/components/Layout/InnerBanner";
import PageTemplate from "@/components/Layout/PageTemplate";
import { getPageMetadata } from "@/lib/metadata";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
    const { slug } = await params;
    return getPageMetadata({
        slug: typeof slug === "string" ? slug : "",
        endpoint: GET_SPECIFIC_POST_ENDPOINT,
    });
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

    const fetchedInfo = await serverRequest(
        {},
        `${GET_SPECIFIC_POST_ENDPOINT}?slug=${slug}&excludeUrl=1`,
        CONSTANTS.REQUEST_GET,
        "server"
    );

    // Safer check
    if (fetchedInfo.code === CONSTANTS.STATUS_NOT_FOUND || !fetchedInfo?.data) return notFound();

    const pageData = fetchedInfo.data;

    console.log(pageData)

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
                            innerBanner={pageData.media}
                        />
                    </div>

                    {/* ✅ Content */}
                    <PageTemplate data={pageData} />
                </div>
            </div>
        </>
    );
}

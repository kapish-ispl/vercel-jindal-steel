
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";

import { CONSTANTS } from "@/config/constant";
import { getPostData } from "@/lib/getPostData";
import { getPageMetadata } from "@/lib/metadata";
import InnerBanner from "@/components/Layout/InnerBanner";
import PageTemplate from "./_partials/PageTemplate";

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
  const rawSlug = typeof slug === "string" ? slug : "";

  const fetchedInfo = await getPostData(rawSlug);

  // Safer check
  if (fetchedInfo?.code === CONSTANTS.STATUS_NOT_FOUND || !fetchedInfo?.data) return notFound();

  const pageData: any = fetchedInfo.data;



  const defaultImage = "https://docs.jindalsteel.in/document/124/1776418947_CGP3jpg1.jpeg";
  const imageList = pageData?.media.filter((item: any) => item.type === "image");
  const imageSrc =
    imageList.length > 0 ? imageList[0].cdnPath : defaultImage;

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
                slug: `/our-portfolio/${pageData.slug}`,
                parentPageDetails: {
                  id: pageData.taxonomy_id || 33333,
                  title: "Our Portfolio",
                  slug: "our-portfolio"
                }
              }}
              innerBanner={pageData.media}
            />
          </div>



          {/* ✅ Content */}
          <PageTemplate pageData={pageData} />
        </div>


      </div>
    </>
  );
}
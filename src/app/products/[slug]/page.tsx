
import { notFound, redirect } from "next/navigation";

import { GET_SPECIFIC_POST_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import { serverRequest } from "@/services/getServerSideRender";
import InnerBanner from "@/components/Layout/InnerBanner";
import PageTemplate from "./_partials/PageTemplate";





export default async function Page({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;

  const fetchedInfo = await serverRequest(
    {},
    `${GET_SPECIFIC_POST_ENDPOINT}?slug=${slug}`,
    CONSTANTS.REQUEST_GET
  );

  // Safer check
  if (!fetchedInfo?.data) {
    return notFound();
  }

  const pageData = fetchedInfo.data;



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
              currentPage={{ ...pageData, slug: `/products/${pageData.slug}` }}
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
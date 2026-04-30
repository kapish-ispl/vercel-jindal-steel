import { notFound, redirect } from "next/navigation";

import { GET_SPECIFIC_POST_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import { serverRequest } from "@/services/getServerSideRender";
import InnerBanner from "@/components/Layout/InnerBanner";


export default async function Page({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;

  // Fix: wrong backtick
  if (slug === "home-v2") {
    redirect("/");
  }

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
  console.log(slug);
  return (
    <>


      <div className="container-fluid generic_bottom_spacer">
        <div className="row">
          <div className="col-12 p-0">

            <InnerBanner
              label={pageData.title}
              tagline={pageData?.customField?.tagline}
              slug={pageData.slug}
              currentPage={{ ...pageData, slug: `/products/${pageData.slug}` }}
              innerBanner={pageData.media}
            />
          </div>



          {/* ✅ Content */}
          <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
        </div>


      </div>
    </>
  );
}
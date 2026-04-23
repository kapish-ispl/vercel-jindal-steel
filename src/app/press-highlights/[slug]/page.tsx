import { notFound, redirect } from "next/navigation";

import { GET_SPECIFIC_POST_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import { serverRequest } from "@/services/getServerSideRender";
import PageTemplate from "@/components/Layout/PageTemplate";
import InnerBanner from "@/components/Layout/InnerBanner";

export default async function Page({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;


  if (slug === 'home-v2`') {
    redirect('/');
  }

  const fetchedInfo = await serverRequest(
    {},
    `${GET_SPECIFIC_POST_ENDPOINT}?slug=${slug}`,
    CONSTANTS.REQUEST_GET
  );

  console.log(fetchedInfo);

  if (!fetchedInfo?.data || fetchedInfo.data.length === 0) {
    return notFound();
  }

  const pageData = fetchedInfo.data;
  return (
    <>
      <div className="container-fluid generic_bottom_spacer press_highlight_banner">
        <div className="row">
          <div className="col-12 p-0">
            <InnerBanner
              label={pageData.title}
              tagline={pageData?.customField?.tagline}
              slug={pageData.slug}
              currentPage={pageData}
            />
          </div>
          <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
        </div>
        {pageData.featuredMedia?.cdnPath && (
          <div className="commonSection-md pt-0">
            <div className="container cus-container">
              <div className="row">
                <div className="col-12">
                  <div className="c-viewBox__btn"><a className="c-viewBox__btn-link clr-white" href={pageData.featuredMedia.cdnPath} target="_blank"><span>Download</span><span className="icon"><svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"> <path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z" fill="white"></path> </svg> </span></a></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

import { notFound, redirect } from "next/navigation";

import { GET_SPECIFIC_POST_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import { serverRequest } from "@/services/getServerSideRender";
import InnerBanner from "@/components/Layout/InnerBanner";
import { MONTH_NAMES } from "@/config/config";

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

  // ✅ Date formatting
  let formattedDate = "";

  if (pageData?.postingDate) {
    const finalDate = pageData.postingDate;
    const getDate = finalDate.split("-");

    let date: Date;

    if (getDate[0].length === 4) {
      date = new Date(Number(getDate[0]), Number(getDate[1]) - 1, Number(getDate[2]));
    } else {
      date = new Date(Number(getDate[2]), Number(getDate[1]) - 1, Number(getDate[0]));
    }

    const day = date.getDate();
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();

    formattedDate = `${day} ${month} ${year}`;
  }
  const defaultImage = "https://docs.jindalsteel.in/document/124/1776418947_CGP3jpg1.jpeg";
  const imageList = pageData?.media.filter((item: any) => item.type === "image");
  const imageSrc =
    imageList.length > 0 ? imageList[0].cdnPath : defaultImage;
  return (
    <>
      <div className="top-header"></div>

      <div className="container generic_bottom_spacer press_highlight_banner">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">

            {/* ✅ Date above banner */}
            <div className="container cus-container">
              <div className="row">
                <div className="col-12 col-lg-10">
                  {formattedDate && (
                    <div className="press-date pt-3 pt-lg-5 pb-0">
                      <span>{formattedDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>



            <InnerBanner
              label={pageData.title}
              tagline={pageData?.customField?.tagline}
              slug={pageData.slug}
              currentPage={pageData}
            />
          </div>
          <div className="col-12 col-lg-10">
            <div className="divider"></div>

          </div>
          <div className="col-12 col-lg-10">
            <div className="c-content-24 ft_light lh_1-4">
              {pageData?.metaInfo?.description}
            </div>
          </div>
          <div className="col-12 col-lg-10">
            <div className="featured__media mt-3 mt-lg-4">
              <img src={imageSrc} alt="featured media" className="img-fluid u-img" />

            </div>
          </div>


          {/* ✅ Content */}
          <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
        </div>

        {/* ✅ Download section */}
        {pageData.featuredMedia?.cdnPath && (
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <div className="c-viewBox__btn my-3 my-lg-5">
                <a
                  className="c-viewBox__btn-link clr-white"
                  href={pageData.featuredMedia.cdnPath}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Download</span>
                  <span className="icon">
                    <svg
                      fill="none"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
import { notFound, redirect } from "next/navigation";

import { GET_SPECIFIC_PAGE_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import { serverRequest } from "@/services/getServerSideRender";
import InnerBanner from "@/components/elements/InnerBanner";
import PageTemplate from "@/components/template/PageTemplate";


export async function generateMetadata({ params }: any) {
  const { slug } = params;

  if (slug === 'home') {
    return {
      title: 'JSP',
      description: '',
    };
  }

  const fetchedInfo = await serverRequest(
    {},
    `${GET_SPECIFIC_PAGE_ENDPOINT}?slug=${slug}`,
    CONSTANTS.REQUEST_GET
  );

  const pageData = fetchedInfo?.data;

  if (!pageData || pageData.length === 0) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  return {
    title: pageData.meta_title || pageData.title || 'SISCOL - Steel Infra Solutions Company Ltd.',
    description: pageData.meta_description || 'SISCOL - Steel Infra Solutions Company Ltd.',
  };
}

export default async function Page({ params }: any) {
  const { slug } = params;

  if (slug === 'home-v2') {
    redirect('/');
  }

  const fetchedInfo = await serverRequest(
    {},
    `${GET_SPECIFIC_PAGE_ENDPOINT}?slug=${slug}`,
    CONSTANTS.REQUEST_GET
  );

  if (!fetchedInfo?.data || fetchedInfo.data.length === 0) {
    return notFound();
  }

  const pageData = fetchedInfo.data;

  return (
    <>
      <div className="container-fluid generic_bottom_spacer">
        <div className="row">
          <div className="col-12 p-0">
            <InnerBanner
              label={pageData.title}
              slug={pageData.slug}
              currentPage={pageData}
              innerBanner={pageData.media}
            />
          </div>
        </div>
      </div>
      <PageTemplate data={pageData} />
    </>
  );
}

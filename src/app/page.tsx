export const dynamic = "force-dynamic"
import HomePage from "@/components/Layout/HomePageTemplate";
import { GET_SPECIFIC_PAGE_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import { serverRequest } from "@/services/getServerSideRender";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageMetadata } from "@/lib/metadata";


export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata({
    slug: "home",
    endpoint: GET_SPECIFIC_PAGE_ENDPOINT,
  });
}


export default async function Home() {
  const fetchedInfo = await serverRequest(
    {},
    `${GET_SPECIFIC_PAGE_ENDPOINT}?slug=${CONSTANTS.LANDING_SLUG}&excludeUrl=1`,
    CONSTANTS.REQUEST_GET,
    'server'
  );

  const pageData = fetchedInfo?.data;
  if (pageData.code === CONSTANTS.STATUS_NOT_FOUND || !pageData) return notFound();

  return <HomePage data={pageData} />;
}


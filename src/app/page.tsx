import HomePage from "@/components/template/HomePageTemplate";
import { GET_SPECIFIC_PAGE_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import { serverRequest } from "@/services/getServerSideRender";
import { notFound } from "next/navigation";

export default async function Home() {
  const fetchedInfo = await serverRequest(
    {},
    `${GET_SPECIFIC_PAGE_ENDPOINT}?slug=home-v2`,
    CONSTANTS.REQUEST_GET
  );

  const pageData = fetchedInfo?.data;

  if (!pageData) return notFound();

  return <HomePage data={pageData} />;
}

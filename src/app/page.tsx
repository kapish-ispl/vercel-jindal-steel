export const dynamic = "force-dynamic"
import HomePage from "@/components/Layout/HomePageTemplate";
import { GET_SPECIFIC_PAGE_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import { serverRequest } from "@/services/getServerSideRender";
import { Metadata } from "next";
import { notFound } from "next/navigation";


export async function generateMetadata(): Promise<Metadata> {
  const fetchedInfo = await serverRequest(
    {},
    `${GET_SPECIFIC_PAGE_ENDPOINT}?slug=home`,
    CONSTANTS.REQUEST_GET
  );

  const pageData = fetchedInfo?.data;

  if (!pageData) return {};

  const metaTitle = pageData.meta_title != "" ? `${pageData.meta_title} | Jindal Steel` : `${pageData.title} | Jindal Steel`;
  const metaDescription =
    pageData.meta_description || pageData.description ||
    "Jindal Steel and Power Limited (JSPL) is a leading Indian steel and energy company, known for its innovative solutions and commitment to sustainability.";
  const metaKeywords =
    pageData.meta_keyword ||
    "Jindal Steel, JSPL, Steel Manufacturing, Energy Solutions, Sustainable Steel, Indian Steel Industry, Steel Products, Power Generation, Infrastructure Development";

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
  };
}

export default async function Home() {
  const fetchedInfo = await serverRequest(
    {},
    `${GET_SPECIFIC_PAGE_ENDPOINT}?slug=home`,
    CONSTANTS.REQUEST_GET
  );

  const pageData = fetchedInfo?.data;
  if (!pageData) return notFound();

  return <HomePage data={pageData} />;
}


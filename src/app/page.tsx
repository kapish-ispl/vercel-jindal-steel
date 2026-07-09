export const dynamic = "force-dynamic"
import HomePage from "@/components/Layout/HomePageTemplate";
import { GET_SPECIFIC_PAGE_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import { serverRequest } from "@/services/getServerSideRender";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { decodeHtmlEntities } from "@/lib/htmlUtils";


export async function generateMetadata(): Promise<Metadata> {
  const fetchedInfo = await serverRequest(
    {},
    `${GET_SPECIFIC_PAGE_ENDPOINT}?slug=home`,
    CONSTANTS.REQUEST_GET
  );

  const pageData = fetchedInfo?.data;

  if (!pageData) return {};

  const metaTitle = decodeHtmlEntities(pageData?.meta?.title || "Jindal Steel");
  const metaDescription = decodeHtmlEntities(
    pageData?.meta?.description ||
      "Jindal Steel is a leading Indian steel company, known for its innovative solutions and commitment to quality."
  );
  const metaKeywords = decodeHtmlEntities(
    pageData?.meta?.keywords ||
      "Jindal Steel Steel Manufacturing, Energy Solutions, Indian Steel Industry, Steel Products, Infrastructure Development"
  );

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


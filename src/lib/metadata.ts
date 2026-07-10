import { serverRequest } from "@/services/getServerSideRender";
import { CONSTANTS } from "@/config/constant";
import { decodeHtmlEntities } from "@/lib/htmlUtils";
import { Metadata } from "next";

interface GenerateMetadataOptions {
  slug: string;
  endpoint: string;
  fallbackTitle?: string;
}

export async function getPageMetadata({
  slug,
  endpoint,
  fallbackTitle = "Jindal Steel",
}: GenerateMetadataOptions): Promise<Metadata> {
  const fetchedInfo = await serverRequest(
    {},
    `${endpoint}?slug=${slug}`,
    CONSTANTS.REQUEST_GET
  );

  const pageData = fetchedInfo?.data;

  if (!pageData || (Array.isArray(pageData) && pageData.length === 0)) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  const metaTitle = decodeHtmlEntities(pageData?.meta?.title || fallbackTitle);
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

    openGraph: {
      title: metaTitle,
      description: metaDescription,
      siteName: "Jindal Steel",
      type: "website",
    },
    twitter: {
      title: metaTitle,
      description: metaDescription,
    }
  };
}

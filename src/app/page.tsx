export const dynamic = "force-dynamic"
import HomePage from "@/components/Layout/HomePageTemplate";
import { GET_SPECIFIC_PAGE_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import { serverRequest } from "@/services/getServerSideRender";
import CardSwipeSlider from "@/utils/CardSwipeSlider";
import { Metadata } from "next";
import { notFound } from "next/navigation";



interface PageData {
  title?: string;
  description?: string;
  meta?: {
    [key: string]: any;
  };
  [key: string]: any;
}

// 1️⃣ Generate dynamic metadata for the page
export async function generateMetadata(): Promise<Metadata> {
  const fetchedInfo = await serverRequest(
    {},
    `${GET_SPECIFIC_PAGE_ENDPOINT}?slug=home-v2`,
    CONSTANTS.REQUEST_GET
  );

  const pageData: PageData = fetchedInfo?.data;

  if (!pageData) return {};

  const metaTitle = pageData.meta_title != "" ? `${pageData.meta_title} | Jindal Steel` : `${pageData.title} | Jindal Steel`;
  const metaDescription =
    pageData.meta_description || pageData.description ||
    "Jindal Steel and Power Limited (JSPL) is a leading Indian steel and energy company, known for its innovative solutions and commitment to sustainability.";
  const metaKeywords =
    pageData.meta_keyword ||
    "Jindal Steel, JSPL, Steel Manufacturing, Energy Solutions, Sustainable Steel, Indian Steel Industry, Steel Products, Power Generation, Infrastructure Development";
  const metaImage = "https://www.jindalsteel.com/images/logo/meta.jpg";
  const siteUrl = "https://www.jindalsteel.com/";

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: siteUrl,
      type: "website",
      images: [
        {
          url: metaImage,
          width: 800,
          height: 600,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@InsphereSoln",
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
  };
}

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


export const dynamic = "force-dynamic";

import HomePage from "@/components/Layout/HomePageTemplate";
import { CONSTANTS } from "@/config/constant";
import { getPageData } from "@/lib/getPageData";
import { getPageMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const fetchedInfo = await getPageData(CONSTANTS.LANDING_SLUG);
  return getPageMetadata(fetchedInfo?.data);
}

export default async function Home() {
  const fetchedInfo = await getPageData(CONSTANTS.LANDING_SLUG);

  const pageData = fetchedInfo?.data;
  if (pageData?.code === CONSTANTS.STATUS_NOT_FOUND || !pageData) return notFound();

  return <HomePage data={pageData} />;
}

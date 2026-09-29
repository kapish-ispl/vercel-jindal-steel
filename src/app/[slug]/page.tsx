import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";

import { CONSTANTS } from "@/config/constant";
import { getPageData } from "@/lib/getPageData";
import { getPageMetadata } from "@/lib/metadata";
import PageTemplate from "@/components/Layout/PageTemplate";
import InnerBanner from "@/components/Layout/InnerBanner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const rawSlug = typeof slug === "string" ? slug : "";
  const cleanSlug = rawSlug.endsWith(".html") ? rawSlug.slice(0, -5) : rawSlug;

  const fetchedInfo = await getPageData(cleanSlug);
  return getPageMetadata(fetchedInfo?.data);
}

export default async function Page({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;

  if (typeof slug === "string" && slug.endsWith(".html")) {
    const cleanSlug = slug.slice(0, -5);
    redirect(`/${cleanSlug}`);
  }

  if (slug === "home") {
    redirect("/");
  }

  const cleanSlug = typeof slug === "string" ? slug : "";

  const fetchedInfo = await getPageData(cleanSlug);

  if (fetchedInfo?.code === CONSTANTS.STATUS_NOT_FOUND || !fetchedInfo?.data) return notFound();

  const pageData = fetchedInfo.data;

  return (
    <>
      <div className="container-fluid generic_bottom_spacer">
        <div className="row">
          <div className="col-12 p-0">
            <InnerBanner
              label={pageData.title}
              tagline={pageData?.customField?.tagline}
              slug={pageData.slug || cleanSlug}
              currentPage={pageData as any}
              innerBanner={pageData.media}
            />
          </div>
        </div>
      </div>
      <PageTemplate data={pageData} />
    </>
  );
}

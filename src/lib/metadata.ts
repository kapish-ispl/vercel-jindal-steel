import { decodeHtmlEntities } from "@/lib/htmlUtils";
import { PageResponse } from "@/types/pageResponse";
import { Metadata } from "next";

export function getPageMetadata(
  pageData?: PageResponse | null,
  fallbackTitle: string = "Jindal Steel"
): Metadata {
  const resolvedData =
    pageData && "data" in pageData && pageData.data && typeof pageData.data === "object" && !("meta" in pageData)
      ? (pageData.data as PageResponse)
      : pageData;

  if (!resolvedData || Array.isArray(resolvedData)) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }

  const metaTitle = decodeHtmlEntities(
    resolvedData?.meta?.title ||
      resolvedData?.metaInfo?.title ||
      resolvedData?.title ||
      fallbackTitle
  );
  const metaDescription = decodeHtmlEntities(
    resolvedData?.meta?.description ||
      resolvedData?.metaInfo?.description ||
      resolvedData?.metaInfo?.short_description ||
      "Jindal Steel is a leading Indian steel company, known for its innovative solutions and commitment to quality."
  );
  const metaKeywords = decodeHtmlEntities(
    resolvedData?.meta?.keywords ||
      resolvedData?.metaInfo?.keywords ||
      "Jindal Steel Steel Manufacturing, Energy Solutions, Indian Steel Industry, Steel Products, Infrastructure Development"
  );

  const ogImages = resolvedData?.meta?.ogImage
    ? [resolvedData.meta.ogImage]
    : resolvedData?.meta?.image
    ? [resolvedData.meta.image]
    : resolvedData?.featuredMedia?.cdnPath
    ? [resolvedData.featuredMedia.cdnPath]
    : undefined;

  const canonical = resolvedData?.meta?.canonicalUrl || resolvedData?.meta?.canonical;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    ...(canonical ? { alternates: { canonical } } : {}),

    openGraph: {
      title: metaTitle,
      description: metaDescription,
      siteName: "Jindal Steel",
      type: "website",
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      title: metaTitle,
      description: metaDescription,
      ...(ogImages ? { images: ogImages } : {}),
    },
  };
}

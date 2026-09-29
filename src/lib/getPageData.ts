import { unstable_cache, revalidateTag } from "next/cache";
import { GET_SPECIFIC_PAGE_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import { serverRequest } from "@/services/getServerSideRender";
import { PageResponse } from "@/types/pageResponse";

export interface ApiResponse<T> {
  success?: boolean;
  data: T | null;
  code?: string | number;
  message?: string;
  error?: boolean;
}

export function getPageData(slug: string) {
  return unstable_cache(
    async () => {
      const res = (await serverRequest(
        {},
        `${GET_SPECIFIC_PAGE_ENDPOINT}?slug=${slug}&excludeUrl=1`,
        CONSTANTS.REQUEST_GET,
        "server"
      )) as ApiResponse<PageResponse>;

      return res;
    },
    ["page-data", slug],
    { revalidate: 1800, tags: [`page-${slug}`] }
  )();
}

export function invalidatePageCache(slug: string) {
  revalidateTag(`page-${slug}`);
}

export { getPostData, invalidatePostCache } from "@/lib/getPostData";

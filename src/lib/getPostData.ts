import { unstable_cache, revalidateTag } from "next/cache";
import { GET_SPECIFIC_POST_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import { serverRequest } from "@/services/getServerSideRender";
import { PageResponse } from "@/types/pageResponse";
import { ApiResponse } from "@/lib/getPageData";

export function getPostData(slug: string) {
  return unstable_cache(
    async () => {
      const res = (await serverRequest(
        {},
        `${GET_SPECIFIC_POST_ENDPOINT}?slug=${slug}&excludeUrl=1`,
        CONSTANTS.REQUEST_GET,
        "server"
      )) as ApiResponse<PageResponse>;

      return res;
    },
    ["post-data", slug],
    { revalidate: 1800, tags: [`post-${slug}`] }
  )();
}

export function invalidatePostCache(slug: string) {
  revalidateTag(`post-${slug}`);
}

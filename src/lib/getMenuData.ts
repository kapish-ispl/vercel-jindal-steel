import { unstable_cache } from 'next/cache';
import { serverRequest } from '@/services/getServerSideRender';
import { GET_MENU_ENDPOINT, GET_POST_ENDPOINT } from '@/config/apiConfig';
import { CONSTANTS } from '@/config/constant';

async function fetchMenuData() {
  console.log('[getMenuData] 🌐 [CACHE MISS] Fetching fresh header, footer, and product menu data from backend...');
  const endpoints = [
    { key: 'headerMenu', url: `${GET_MENU_ENDPOINT}?slug=header-menu-v2` },
    { key: 'footerMenu', url: `${GET_MENU_ENDPOINT}?slug=footer-menu-v2` },
    { key: 'productData', url: `${GET_POST_ENDPOINT}?slug=product&excludeUrl=1` },
  ] as const;

  const results = await Promise.allSettled(
    endpoints.map(({ url }) => serverRequest({}, url, CONSTANTS.REQUEST_GET, 'server'))
  );

  const data: Record<string, any> = {
    headerMenu: [],
    footerMenu: [],
    productData: [],
  };

  results.forEach((result, i) => {
    const { key } = endpoints[i];
    if (result.status === 'fulfilled' && result.value?.code === CONSTANTS.STATUS_SUCCESS) {
      data[key] = result.value.data;
    } else if (result.status === 'rejected') {
      console.warn(`[getMenuData] ${key} request rejected:`, result.reason);
    } else if (result.status === 'fulfilled' && result.value?.error) {
      console.warn(`[getMenuData] ${key} request failed:`, result.value?.message);
    }
  });

  return data as {
    headerMenu: any[];
    footerMenu: any[];
    productData: any;
  };
}

export const getMenuData = unstable_cache(
  fetchMenuData,
  ['root-layout-menu-data'],
  {
    revalidate: 1800, // 30 minutes in seconds
    tags: ['menu-data'],
  }
);

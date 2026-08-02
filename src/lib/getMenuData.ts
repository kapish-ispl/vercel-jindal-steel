import { serverRequest } from '@/services/getServerSideRender';
import { GET_MENU_ENDPOINT, GET_POST_ENDPOINT } from '@/config/apiConfig';
import { CONSTANTS } from '@/config/constant';

export async function getMenuData() {
  const endpoints = [
    { key: 'headerMenu', url: `${GET_MENU_ENDPOINT}?slug=header-menu-v2` },
    { key: 'footerMenu', url: `${GET_MENU_ENDPOINT}?slug=footer-menu-v2` },
    { key: 'productData', url: `${GET_POST_ENDPOINT}?slug=product&excludeUrl=1` },
  ] as const;

  const results = await Promise.allSettled(endpoints.map(({ url }) => serverRequest({}, url, CONSTANTS.REQUEST_GET, 'server')));

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

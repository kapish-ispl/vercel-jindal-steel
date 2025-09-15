export const API_URL = 'http://localhost:3002';

export const GET_MENU_ENDPOINT = process.env.NODE_ENV != 'production' ? `${API_URL}/external-api/v1/menu/get` : `https://uatapi.jindalsteelpower.com/v1/menu/get`;
export const GET_SPECIFIC_PAGE_ENDPOINT = process.env.NODE_ENV != 'production' ? `${API_URL}/external-api/v1/page/get` : `https://uatapi.jindalsteelpower.com/v1/page/get`;
export const GET_CONTENT_BLOCK_ENDPOINT =
  process.env.NODE_ENV != 'production' ? `${API_URL}/external-api/v1/content-block/get` : `https://uatapi.jindalsteelpower.com/v1/content-block/get`; //?keyword=footerv2
export const GET_POST_ENDPOINT = process.env.NODE_ENV != 'production' ? `${API_URL}/external-api/v1/post/get-all` : `https://uatapi.jindalsteelpower.com/v1/post/get-all`;
export const GET_SPECIFIC_POST_ENDPOINT = process.env.NODE_ENV != 'production' ? `${API_URL}/external-api/v1/post/get` : `https://uatapi.jindalsteelpower.com/v1/post/get`;

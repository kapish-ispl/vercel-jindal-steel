const API_URL = process.env.NEXT_PUBLIC_URL;

export const GET_MENU_ENDPOINT = `${API_URL}/v1/menu/get`;
export const GET_SPECIFIC_PAGE_ENDPOINT = `${API_URL}/v1/page/get`;
export const GET_CONTENT_BLOCK_ENDPOINT = `${API_URL}/v1/content-block/get`; //?keyword=footerv2
export const GET_POST_ENDPOINT = `${API_URL}/v1/post/get-all`;
export const HEADER_MENU_ENDPOINT = `header-main-menu`;
export const FOOTER_MENU_ENDPOINT = `footer-bottom-menu`;
export const FOOTER_CONTENT_BLOCK_ENDPOINT = `footerv2`;
export const POST_FORM_ENDPOINT = `${API_URL}/v1/form/save`;

import { serverRequest } from "@/services/getServerSideRender";
import { GET_MENU_ENDPOINT, GET_POST_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";

export async function getMenuData() {
    const [headerRes, footerRes, productRes] = await Promise.all([
        serverRequest({}, `${GET_MENU_ENDPOINT}?slug=header-menu-v2`, CONSTANTS.REQUEST_GET),
        serverRequest({}, `${GET_MENU_ENDPOINT}?slug=footer-menu-v2`, CONSTANTS.REQUEST_GET),
        serverRequest({}, `${GET_POST_ENDPOINT}?slug=product`, CONSTANTS.REQUEST_GET),
    ]);

    return {
        headerMenu: headerRes?.code === CONSTANTS.STATUS_SUCCESS ? headerRes.data : [],
        footerMenu: footerRes?.code === CONSTANTS.STATUS_SUCCESS ? footerRes.data : [],
        productData: productRes ?? [],
    };
}

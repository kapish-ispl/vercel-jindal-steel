"use client";
import { useEffect, useState, useContext } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import { serverRequest } from "@/services/getServerSideRender";
import { CONSTANTS } from "@/config/constant";
import { GET_POST_ENDPOINT } from "@/config/apiConfig";
import dynamic from "next/dynamic";


const componentMap: any = {
    FinancialCard: dynamic(() => import("./FinancialCard")),
    AwardsCard: dynamic(() => import("./AwardsCard")),
    OurOfficesCard: dynamic(() => import("./OurOfficesCard")),
    ProductCard: dynamic(() => import("./ProductCard")),
    CenterModeSlider: dynamic(() => import("./CenterModeSlider")),
    ProductSlider: dynamic(() => import("./ProductSlider")),
    ResourceSection: dynamic(() => import("./ResourceSection")),
    ImageTextSlider: dynamic(() => import("./ImageTextSlider")),
    FilterCards: dynamic(() => import("./FilterCards")),
    PerformanceCard: dynamic(() => import("./PerformanceCard")),
}

export default function PostList(props: any) {
    const contextInfo = useContext(AppContext);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const page = searchParams.get("page");
    const [postData, setPostData] = useState<any>([]);
    const [totalPost, setTotalPost] = useState<any>(0);
    const [loading, setLoading] = useState(false);
    const type = searchParams.get('type');
    const [filteredTag, setFilteredTag] = useState<string | null>(null);

    console.log(type)
    useEffect(() => {
        let slugInfo = props.slug;
        let limit = props.limit !== undefined ? props.limit : 9;

        if (pathname === '/') {
            slugInfo += `&metaInfo[type_1599485711]=${props.type}`;
            limit = 3;
        }
        // if (props.slug === 'policies-reports') {
        //     slugInfo += `&metaInfo[type_1599634707]=${props.type}`;
        // }

        if (props.slug === 'policies-reports') {
            if (type) {
                slugInfo += `&metaInfo[type_1599634707]=${type}`;
            }
        }

        console.log(props.slug)
        const getPostData = async () => {
            setLoading(true);

            try {
                if (props.slug !== "") {
                    if (props.slug === "product" && contextInfo.productData?.length > 0) {
                        setPostData(contextInfo.productData);
                    } else {
                        const offset = page !== null ? (Number(page) - 1) * limit : 0;

                        const taxonomyInfo = await serverRequest(
                            {},
                            `${GET_POST_ENDPOINT}?slug=${slugInfo}&limit=${limit}&offset=${offset}`,
                            CONSTANTS.REQUEST_GET
                        );

                        if (taxonomyInfo.code === CONSTANTS.STATUS_SUCCESS) {
                            setPostData(taxonomyInfo.data);
                            setTotalPost(taxonomyInfo.total);
                        } else {
                            setPostData([]);
                            setTotalPost(0);
                        }
                    }
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setPostData([]);
                setTotalPost(0);
            } finally {
                setLoading(false);
            }
        };
        if (page !== filteredTag) {
            setPostData([]);
            setFilteredTag(page);
        }

        getPostData();

    }, [props.slug, page, filteredTag, pathname, type]);
    const PostComponentRender = componentMap[props.components];

    return PostComponentRender ? (
        <PostComponentRender postData={postData} compSlug={props.slug ? props.slug : ""} totalPost={totalPost} itemsPerPage={props.limit} itemstoshow={props.itemstoshow} isproduct={props.isproduct} loading={loading} />
    ) : <div>Loading...</div>;
}
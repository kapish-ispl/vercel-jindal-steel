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
}

export default function PostList(props: any) {
    const contextInfo = useContext(AppContext);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const page = searchParams.get("page");
    const [postData, setPostData] = useState<any>([]);
    const [totalPost, setTotalPost] = useState<any>(0);
    const [filteredTag, setFilteredTag] = useState<string | null>(null);

    useEffect(() => {
        let slugInfo = props.slug;
        let limit = props.limit !== undefined ? props.limit : 9;

        if (pathname === '/') {
            slugInfo += `&metaInfo[type_1599485711]=${props.type}`;
            limit = 3;
        }

        const getPostData = async () => {
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
        };

        // Only fetch data if the page or slug changes.
        // We'll reset postData and filteredTag to handle new queries cleanly.
        if (page !== filteredTag) {
            setPostData([]);
            setFilteredTag(page);
        }

        getPostData();

    }, [props.slug, page, filteredTag, pathname]); // Corrected dependency array

    // const PostComponentRender: any = useMemo(
    //     () => dynamic(() => import(`./${props.components}`)),
    //     [props.components]
    // );

    const PostComponentRender = componentMap[props.components];

    return PostComponentRender ? (
        <PostComponentRender postData={postData} totalPost={totalPost} itemsPerPage={props.limit} />
    ) : <div>Loading...</div>;
}
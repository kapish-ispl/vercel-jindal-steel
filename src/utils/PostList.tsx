"use client";

import { useEffect, useState, useContext, useMemo } from "react";
import { useSearchParams, usePathname } from "next/navigation"; // ✅ Next.js 15 hook
import { AppContext } from "@/context/AppContext"; // adjust import to your context path
import { serverRequest } from "@/services/getServerSideRender"; // adjust import
import { CONSTANTS } from "@/config/constant"; // adjust import
import { GET_POST_ENDPOINT } from "@/config/apiConfig"; // adjust import
import dynamic from "next/dynamic";

interface Post {
    id: string | number;
    [key: string]: any;
}

interface Props {
    slug: string;
    limit?: number;
}

export default function PostList(props: any) {
    const contextInfo = useContext(AppContext);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const page = searchParams.get("page");
    const [postData, setPostData] = useState<Post[]>([]);
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
                    const offset = page !== null ? (Number(page) - 1) * 9 : 0;
                    const taxonomyInfo = await serverRequest(
                        {},
                        `${GET_POST_ENDPOINT}?slug=${slugInfo}&limit=${limit}&offset=${offset}`,
                        CONSTANTS.REQUEST_GET
                    );
                    
                    if (taxonomyInfo.code === CONSTANTS.STATUS_SUCCESS) {
                        setPostData(taxonomyInfo.data);
                    } else {
                        setPostData([]);
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

    const PostComponentRender: any = useMemo(
        () => dynamic(() => import(`./${props.components}`)),
        [props.components]
    );

    return (
        <>
            <div>reached here</div>
            <PostComponentRender data={postData} />
        </>
    );
}
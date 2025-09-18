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

const DynamicPostComponent = (name: string) => dynamic(() => import(`./${name}`));

export default function PostList(props: any) {
    console.log('ye post hai', props);
    const contextInfo = useContext(AppContext);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const page = searchParams.get("page"); // ✅ replaces router.query.page
    //const slug = params.slug as string;

    const [postData, setPostData] = useState<Post[]>([]);
    const [filteredTag, setFilteredTag] = useState<string | null>(null);
    useEffect(() => {
        let slugInfo = props.slug;
        let limit = props.limit !== undefined ? props.limit : 9
        if (pathname == '/') {
            slugInfo += `&metaInfo[type_1599485711]=${props.type}`;
            limit = 3;
        }

        const getPostData = async () => {
            if (props.slug !== "") {
                if (props.slug == "product" && contextInfo.productData !== undefined && contextInfo.productData.length > 0) {
                    setPostData(contextInfo.productData);
                } else {
                    const taxonomyInfo = await serverRequest(
                        {},
                        `${GET_POST_ENDPOINT}?slug=${slugInfo}&limit=${limit}${page !== null ? `&offset=${(Number(page) - 1) * 9}` : ""}`,
                        CONSTANTS.REQUEST_GET
                    );
                    if (taxonomyInfo.code == CONSTANTS.STATUS_SUCCESS) {
                        let currentData: any = [];
                        if (page !== null && page !== filteredTag) {
                            setFilteredTag(page);
                            const pageNum = Number(page);
                            const filteredNum = filteredTag !== null ? Number(filteredTag) : NaN;

                            if (!isNaN(pageNum) && !isNaN(filteredNum)) {
                                currentData =
                                    pageNum > filteredNum
                                        ? [...postData, ...taxonomyInfo.data]
                                        : [...taxonomyInfo.data, ...postData];
                            }
                        }
                        else {
                            currentData = [...taxonomyInfo.data];
                        }

                        const sortedData = currentData.map(({ id }: any) => id);
                        const filtered = currentData.filter(({ id }: any, index: number) => !sortedData.includes(id, index + 1));
                        setPostData(filtered);
                    } else {
                        setPostData([]);
                    }
                }
            }
        }
        getPostData();

    }, [props.slug]);

    const PostComponentRender:any = useMemo(
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

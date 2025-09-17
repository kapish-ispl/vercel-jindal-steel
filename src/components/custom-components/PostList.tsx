"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { GET_POST_ENDPOINT } from "@/config/apiConfig";
import { serverRequest } from "@/services/getServerSideRender";
import { CONSTANTS } from "@/config/constant";
import { PostData } from "@/types/post";

interface Props {
    slug: string;
    category: string;
    type: string;
    limit: string;
    component: keyof typeof componentMap;
    datatabs: string;
}

interface ServerResponse {
    code: string;
    data: PostData[];
    total: number;
}

const componentMap = {
    FinancialCard: dynamic(() => import("./FinancialCard")),
};

const PostList = (props: Props) => {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const category = searchParams.get("category");
    const [postData, setPostData] = useState<PostData[]>([]);
    const [postTotal, setPostTotal] = useState<number>(0);

    const Limit = Number(props.limit) || 50;

    useEffect(() => {
        let slugInfo = props.slug;

        if (props.slug === "/") {
            slugInfo += `&metaInfo[type_1599485711]=${props.type || ""}`;
        }

        const getPostData = async () => {
            if (!props.slug) return;

            const taxonomyInfo = (await serverRequest(
                {},
                `${GET_POST_ENDPOINT}?slug=${slugInfo}&limit=${Limit}${page ? `&offset=${(page - 1) * Number(props.limit || 9)}` : ""
                }`,
                CONSTANTS.REQUEST_GET
            )) as ServerResponse;

            if (taxonomyInfo.code === CONSTANTS.STATUS_SUCCESS) {
                const currentData = [...taxonomyInfo?.data];
                const sortedData = currentData.map(({ id }) => id);
                const filtered = currentData.filter(({ id }, index) => !sortedData.includes(id, index + 1));
                setPostData(filtered);
                setPostTotal(taxonomyInfo?.total);
            } else {
                setPostData([]);
                setPostTotal(0);
            }
        };

        getPostData();
    }, [props.category, category, page, props.slug, props.limit]);


    const PostComponentRender = componentMap[props.component];

    return PostComponentRender ? (
        <PostComponentRender
            postData={postData}
            postTotal={postTotal}
            type={props.type}
        />
    ) : null;
};

export default PostList;

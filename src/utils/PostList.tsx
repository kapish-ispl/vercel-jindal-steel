"use client";
import { useEffect, useState, useContext } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import { serverRequest } from "@/services/getServerSideRender";
import { CONSTANTS } from "@/config/constant";
import { GET_POST_ENDPOINT } from "@/config/apiConfig";
import dynamic from "next/dynamic";
import { yearOptions } from "@/constants/GenericFilter";


const componentMap: any = {
    FinancialCard: dynamic(() => import("./FinancialCard")),
    AwardsCard: dynamic(() => import("./AwardsCard")),
    AwardsCardV2: dynamic(() => import("./AwardsCardV2")),
    OurOfficesCard: dynamic(() => import("./OurOfficesCard")),
    ProductCard: dynamic(() => import("./ProductCard")),
    NewProductCard: dynamic(() => import("./NewProductCard")),
    CenterModeSlider: dynamic(() => import("./CenterModeSlider")),
    ProductSlider: dynamic(() => import("./ProductSlider")),
    ResourceSection: dynamic(() => import("./ResourceSection")),
    ImageTextSlider: dynamic(() => import("./ImageTextSlider")),
    FilterCards: dynamic(() => import("./FilterCards")),
    PressReleaseCard: dynamic(() => import("./PressReleaseCard")),
    BlogCard: dynamic(() => import("./BlogCard")),
    PerformanceCard: dynamic(() => import("./PerformanceCard")),
    LeadershipCard: dynamic(() => import("./LeadershipCard")),
    LeadershipCardV2: dynamic(() => import("./LeadershipCardV2")),
    PodcastSlider: dynamic(() => import("./PodcastSlider")),
    JobListing: dynamic(() => import("./JobListing")),
    TalentForm: dynamic(() => import("./TalentForm")),
    MsmeForm: dynamic(() => import("./MsmeForm"))
}

export default function PostList(props: any) {
    const contextInfo = useContext(AppContext);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const page = searchParams.get("page");
    const [postData, setPostData] = useState<any>([]);
    const [finalLimit, setFinalLimit] = useState<any>(props.limit || 9);
    const [totalPost, setTotalPost] = useState<any>(0);
    const [loading, setLoading] = useState(false);
    const type = searchParams.get('type');
    const desc = searchParams.get('desc');
    const productCategory = searchParams.get('product-category');
    const [filteredTag, setFilteredTag] = useState<string | null>(null);
    //console.log(props);
    const metaKeys: any = {
        "investor-documents": {
            year: { key: "year_1599486125" },
            type: { key: "type_1599485711" }
        },

        "environmental-compliance": {
            type: { key: "type_1699180101" }
        },
        "awards": {
            type: { key: "award_year_1699533468" }
        },

        "product": {
            type: { key: "category_1777488790" },

        },
        "podcast": {
            type: { key: "label_1778157653" },

        },

        "conference-call": {
            year: {
                key: "conference_year_1734948827",
                default: yearOptions[0].value
            }
        },

        "policies-reports": {
            type: { key: "type_1599634707" }
        },

        "career": {
            department: { key: "department" },
            location: { key: "location" }
        }
        // "career": {
        //     department: { key: "department" },
        //     location: { key: "location" }
        // }
    };


    useEffect(() => {
        let slugInfo = props.slug;
        const yearParam = searchParams.get(`${props.slug}-year`);
        const typeParam = searchParams.get(`${props.slug}-type`);
        const deptParam = searchParams.get("department");
        const locParam = searchParams.get("location");
        const pageParam = searchParams.get(`${props.slug}-page`);

        const activePage = pageParam ?? page ?? 1;
        //const category = props.cat ? decodeURIComponent(props.category) : null;
        const category = decodeURIComponent(props.category);

        var limit = props.limit !== undefined ? props.limit : 9;

        if (pathname === '/') {
            slugInfo += `&metaInfo[type_1599485711]=${props.type}`;
            limit = 3;
        }

        if (props.slug === 'environmental-compliance') {
            limit = 50;
            setFinalLimit(50);
            if (category) {
                slugInfo += `&metaInfo[type_1699180101]=${category}`;
            }
        }

        if (props.slug === 'career' || props.slug === 'career') {
            limit = 1000;
        }

        if (props.slug === 'policies-reports') {
            if (type) {
                slugInfo += `&metaInfo[type_1599634707]=${type}`;
            }
        }
        if (props.slug === 'awards') {
            if (type) {
                slugInfo += `&metaInfo[award_year_1699533468]=${type}`;
            }
        }
        if (props.slug === 'podcast') {
            console.log("type", props.seasontype);
            if (props.seasontype) {
                slugInfo += `&metaInfo[label_1778157653]=${props.seasontype}`;
            }
        }
        if (props.slug === 'product') {
            if (productCategory) {
                slugInfo += `&metaInfo[category_1777488790]=${productCategory}`;
            }
        }




        if (metaKeys[props.slug]) {
            const map = metaKeys[props.slug];

            // Handle Year
            if (map.year) {
                const selectedYear = yearParam || map.year.default;
                if (selectedYear) {
                    slugInfo += `&metaInfo[${map.year.key}]=${selectedYear}`;
                }
            }

            // Handle Type
            if (map.type) {
                const selectedType = typeParam || map.type.default;
                if (selectedType) {
                    slugInfo += `&metaInfo[${map.type.key}]=${selectedType}`;
                }
            }

            // Handle Department
            if (map.department) {
                const selectedDept = deptParam || map.department.default;
                if (selectedDept) {
                    slugInfo += `&metaInfo[${map.department.key}]=${selectedDept}`;
                }
            }

            // Handle Location
            if (map.location) {
                const selectedLoc = locParam || map.location.default;
                if (selectedLoc) {
                    slugInfo += `&metaInfo[${map.location.key}]=${selectedLoc}`;
                }
            }
            if (map.category) {
                const selectedCategory = category || map.category.default;
                if (selectedCategory) {
                    slugInfo += `&metaInfo[${map.category.key}]=${selectedCategory}`;
                }
            }
        }


        const getPostData = async () => {
            setLoading(true);

            try {
                if (props.slug !== "") {
                    if (props.slug === "product" && contextInfo.productData?.length > 0) {
                        setPostData(contextInfo.productData);
                    } else {
                        // const offset = pageParam !== null ? (Number(pageParam) - 1) * limit : 0;
                        const offset = (Number(activePage) - 1) * limit;

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
        // if (page !== filteredTag) {
        //     setPostData([]);
        //     setFilteredTag(page);
        // }

        getPostData();

    }, [props.slug, page, pathname, type, productCategory, searchParams]);
    const PostComponentRender = componentMap[props.components];

    return PostComponentRender ? (
        <PostComponentRender postData={postData} title={props.title != "" ? props.title : ''} compSlug={props.slug ? props.slug : ""} totalPost={totalPost} itemsPerPage={finalLimit} itemstoshow={props.itemstoshow} isproduct={props.isproduct} loading={loading} seasontype={props.seasontype} />
    ) : <div>Loading...</div>;
}
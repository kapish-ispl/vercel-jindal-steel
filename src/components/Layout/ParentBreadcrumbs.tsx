"use client";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import { serverRequest } from "@/services/getServerSideRender";
import { GET_SPECIFIC_POST_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import Link from "next/link";

export interface ParentPageDetails {
    id: number;
    title: string;
    slug: string;
}

export interface TaxonomyDetails {
    id: number;
    alias: string;
}

export interface CurrentPage {
    id: number;
    title: string;
    slug: string;
    taxonomy_id?: string | number;
    taxonomy?: TaxonomyDetails;
    parentPageDetails?: ParentPageDetails;
}

export interface MenuItem {
    id: number;
    link: string;
    name: string;
    children: MenuItem[];
}

export interface BreadcrumbItem {
    id: number;
    label: string;
    url: string;
}

interface BreadcrumbsProps<T extends BreadcrumbItem = BreadcrumbItem> {
    slug?: string;
    currentPage?: CurrentPage;
}


const initialState: BreadcrumbItem[] = [
    { id: 1, label: "Home", url: "/" }
];

const ParentBreadcrumbs = <T extends BreadcrumbItem = BreadcrumbItem>({
    slug: propSlug,
    currentPage: propCurrentPage
}: BreadcrumbsProps<T>) => {
    const { headerMenu } = useContext(AppContext);
    const searchParams = useSearchParams();
    const [breadcrumbMenu, setBreadcrumbMenu] = useState<BreadcrumbItem[]>(initialState);
    const [fetchedPage, setFetchedPage] = useState<CurrentPage | null>(null);
    const [fetchedSlug, setFetchedSlug] = useState<string | null>(null);

    // Get query param 'parent' (with fallback to 'slug')
    const parentParam = searchParams?.get("parent") || searchParams?.get("slug");

    useEffect(() => {
        const fetchPostData = async () => {
            if (!parentParam) return;
            try {
                const response = await serverRequest(
                    {},
                    `${GET_SPECIFIC_POST_ENDPOINT}?slug=${parentParam}&excludeUrl=1`,
                    CONSTANTS.REQUEST_GET
                );

                if (response && response.data) {
                    const postData = response.data;
                    const pageInfo: CurrentPage = {
                        id: postData.id,
                        title: postData.title,
                        slug: postData.slug,
                        taxonomy_id: postData.taxonomy_id,
                        taxonomy: postData.taxonomy,
                        parentPageDetails: postData.parentPageDetails || postData.parent_page_details,
                    };
                    setFetchedPage(pageInfo);
                    setFetchedSlug(postData.slug);
                }
            } catch (error) {
                console.error("Failed to fetch post for breadcrumbs:", error);
            }
        };

        if (parentParam) {
            fetchPostData();
        } else {
            setFetchedPage(null);
            setFetchedSlug(null);
        }
    }, [parentParam]);

    useEffect(() => {
        if (!propCurrentPage && !fetchedPage) {
            return;
        }

        const findMenuTrail = (menuItem: MenuItem, slugToMatch: string, currentTrail: BreadcrumbItem[]): BreadcrumbItem[] | null => {
            const cleanLink = menuItem.link.replace(/^\//, '').replace(/\.html$/, '');
            const cleanSlug = slugToMatch.replace(/^\//, '').replace(/\.html$/, '');
            const newTrail: BreadcrumbItem[] = [...currentTrail, { id: menuItem.id, label: menuItem.name, url: menuItem.link }];

            if (cleanLink === cleanSlug || menuItem.link === `/${cleanSlug}`) {
                return newTrail;
            }

            if (menuItem.children && menuItem.children.length > 0) {
                for (const child of menuItem.children) {
                    const res = findMenuTrail(child, slugToMatch, newTrail);
                    if (res) return res;
                }
            }

            return null;
        };

        // When parentParam is present and fetchedPage is loaded along with propCurrentPage
        if (parentParam && fetchedPage && propCurrentPage) {
            let baseTrail: BreadcrumbItem[] | null = null;

            // 1. Try to find complete parent-to-parent menu trail from headerMenu for parent details
            const parentSlugToTry = propCurrentPage.parentPageDetails?.slug || fetchedPage.parentPageDetails?.slug;

            if (parentSlugToTry && headerMenu && headerMenu.length > 0) {
                const cleanSlug = parentSlugToTry.replace(/^\//, '').replace(/\.html$/, '');
                for (const menuItem of headerMenu) {
                    const res = findMenuTrail(menuItem, cleanSlug, initialState);
                    if (res) {
                        baseTrail = res;
                        break;
                    }
                }
            }

            // Fallback base trail if not found in headerMenu
            if (!baseTrail) {
                baseTrail = [{ id: 1, label: "Home", url: "/" }];
                const parentDetails = propCurrentPage.parentPageDetails || fetchedPage.parentPageDetails;
                const taxonomyDetails = propCurrentPage.taxonomy || fetchedPage.taxonomy;

                if (parentDetails) {
                    baseTrail.push({
                        id: parentDetails.id,
                        label: parentDetails.title,
                        url: parentDetails.slug.startsWith('/') ? parentDetails.slug : `/${parentDetails.slug}`,
                    });
                } else if (taxonomyDetails) {
                    const taxonomySlug = `/${taxonomyDetails.alias.replace(/\s+/g, "-").toLowerCase()}`.replace(".html", "");
                    baseTrail.push({
                        id: taxonomyDetails.id,
                        label: taxonomyDetails.alias,
                        url: taxonomySlug,
                    });
                }
            }

            const trail = [...baseTrail];

            // 2. Add fetched post details (from query param) with parentPageDetails slug as prefix
            let fetchedSlugFormatted = fetchedPage.slug
                ? (fetchedPage.slug.startsWith('/') ? fetchedPage.slug : `/${fetchedPage.slug}`)
                : "";

            const parentPrefixSlug = propCurrentPage?.parentPageDetails?.slug || fetchedPage?.parentPageDetails?.slug;

            if (parentPrefixSlug) {
                const prefix = parentPrefixSlug.startsWith('/')
                    ? parentPrefixSlug
                    : `/${parentPrefixSlug}`;
                const cleanFetchedSlug = fetchedPage.slug ? fetchedPage.slug.replace(/^\//, '') : '';
                fetchedSlugFormatted = `${prefix.replace(/\/$/, '')}/${cleanFetchedSlug}`;
            }

            if (!trail.some(t => t.label === fetchedPage.title || (fetchedSlugFormatted && t.url === fetchedSlugFormatted))) {
                trail.push({
                    id: fetchedPage.id,
                    label: fetchedPage.title,
                    url: fetchedSlugFormatted,
                });
            }



            // 3. Add current page details
            const currentSlugFormatted = propCurrentPage.slug
                ? (propCurrentPage.slug.startsWith('/') ? propCurrentPage.slug : `/${propCurrentPage.slug}`)
                : "";

            if (!trail.some(t => t.label === propCurrentPage.title || (currentSlugFormatted && t.url === currentSlugFormatted))) {
                trail.push({
                    id: propCurrentPage.id,
                    label: propCurrentPage.title,
                    url: currentSlugFormatted,
                });
            }

            setBreadcrumbMenu(trail);
            return;
        }


        // Fallback standard breadcrumbs when no parentParam
        const targetPage = fetchedPage || propCurrentPage;
        const targetSlug = parentParam ? (fetchedSlug || parentParam) : (propSlug || "");

        if (!targetPage) return;

        const buildBreadcrumbs = (menuItem: MenuItem, slugVal: string, currentTrail: BreadcrumbItem[]): BreadcrumbItem[] | null => {
            const newTrail: BreadcrumbItem[] = [...currentTrail, { id: menuItem.id, label: menuItem.name, url: menuItem.link }];

            if (menuItem.link === `/${slugVal}`) {
                return newTrail;
            }
            if (targetPage.parentPageDetails) {
                if (menuItem.link === `/${targetPage.parentPageDetails.slug}`) {
                    return [
                        ...currentTrail,
                        {
                            id: targetPage.parentPageDetails.id,
                            label: targetPage.parentPageDetails.title,
                            url: `/${targetPage.parentPageDetails.slug}`,
                        },
                        {
                            id: targetPage.id,
                            label: targetPage.title,
                            url: targetPage.slug.startsWith('/') ? targetPage.slug : `/${targetPage.slug}`,
                        },
                    ];
                }
            }

            if (targetPage.taxonomy_id && targetPage.taxonomy) {
                const taxonomySlug = `/${targetPage.taxonomy.alias.replace(/\s+/g, "-").toLowerCase()}`;
                if (menuItem.link === taxonomySlug) {
                    return [
                        ...currentTrail,
                        {
                            id: targetPage.taxonomy.id,
                            label: targetPage.taxonomy.alias,
                            url: taxonomySlug.replace(".html", ""),
                        },
                        {
                            id: targetPage.id,
                            label: targetPage.title,
                            url: targetPage.slug.startsWith('/') ? targetPage.slug : `/${targetPage.slug}`,
                        },
                    ];
                }
            }

            if (menuItem.children && menuItem.children.length > 0) {
                for (const child of menuItem.children) {
                    const result = buildBreadcrumbs(child, slugVal, newTrail);
                    if (result) return result;
                }
            }

            return null;
        };

        let finalBreadcrumbs: BreadcrumbItem[] | null = null;

        if (headerMenu && headerMenu.length > 0) {
            headerMenu.forEach((menuItem: MenuItem) => {
                const result = buildBreadcrumbs(menuItem, targetSlug, initialState);
                if (result && !finalBreadcrumbs) {
                    finalBreadcrumbs = result;
                }
            });
        }

        if (!finalBreadcrumbs && targetPage) {
            finalBreadcrumbs = [...initialState];
            if (targetPage.parentPageDetails) {
                finalBreadcrumbs.push({
                    id: targetPage.parentPageDetails.id,
                    label: targetPage.parentPageDetails.title,
                    url: targetPage.parentPageDetails.slug.startsWith('/') ? targetPage.parentPageDetails.slug : `/${targetPage.parentPageDetails.slug}`,
                });
            }
            finalBreadcrumbs.push({
                id: targetPage.id,
                label: targetPage.title,
                url: targetPage.slug ? (targetPage.slug.startsWith('/') ? targetPage.slug : `/${targetPage.slug}`) : "",
            });
        }

        if (finalBreadcrumbs) {
            setBreadcrumbMenu(finalBreadcrumbs);
        }
    }, [propSlug, headerMenu, propCurrentPage, parentParam, fetchedPage, fetchedSlug]);



    return (
        <ul className="breadcrumb">
            {breadcrumbMenu.map((item, index) => {
                const isLast = index === breadcrumbMenu.length - 1;
                return (
                    <li key={item.id} className={`breadcrumb-item ${isLast ? "active" : ""}`}>
                        {!isLast && item.url ? (
                            <Link href={item.url}>{item.label}</Link>
                        ) : (
                            item.label
                        )}
                    </li>
                );
            })}
        </ul>
    );

};

export default ParentBreadcrumbs;


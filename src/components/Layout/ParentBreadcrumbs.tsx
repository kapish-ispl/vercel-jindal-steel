"use client";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import { serverRequest } from "@/services/getServerSideRender";
import { GET_SPECIFIC_POST_ENDPOINT, GET_SPECIFIC_PAGE_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import Link from "next/link";

export interface ParentPageDetails {
    id?: number;
    title: string;
    slug: string;
}

export interface TaxonomyDetails {
    id?: number;
    alias: string;
}

export interface CurrentPage {
    id?: number;
    title: string;
    slug: string;
    taxonomy_id?: string | number;
    taxonomy?: TaxonomyDetails;
    parentPageDetails?: ParentPageDetails;
    parent_page_details?: ParentPageDetails;
}

export interface MenuItem {
    id: number;
    link: string;
    name: string;
    children?: MenuItem[];
}

export interface BreadcrumbItem {
    id: number | string;
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

const cleanPath = (url: string = "") => {
    return url.replace(/^\//, "").replace(/\.html$/, "").trim();
};

const findMenuTrail = (
    menuItem: MenuItem,
    targetSlug: string,
    currentTrail: BreadcrumbItem[]
): BreadcrumbItem[] | null => {
    const cleanLink = cleanPath(menuItem.link);
    const cleanTarget = cleanPath(targetSlug);

    const itemUrl = menuItem.link?.startsWith("http") || menuItem.link?.startsWith("#")
        ? menuItem.link
        : `/${cleanLink}`;

    const newTrail: BreadcrumbItem[] = [
        ...currentTrail,
        { id: menuItem.id, label: menuItem.name, url: itemUrl }
    ];

    if (cleanLink && cleanTarget && cleanLink === cleanTarget) {
        return newTrail;
    }

    if (menuItem.children && menuItem.children.length > 0) {
        for (const child of menuItem.children) {
            const res = findMenuTrail(child, targetSlug, newTrail);
            if (res) return res;
        }
    }

    return null;
};

const findTrailInMenu = (menu: MenuItem[], targetSlug: string): BreadcrumbItem[] | null => {
    if (!menu || menu.length === 0 || !targetSlug) return null;
    for (const item of menu) {
        const res = findMenuTrail(item, targetSlug, initialState);
        if (res) return res;
    }
    return null;
};

const fetchParentDetails = async (slug: string): Promise<CurrentPage | null> => {
    if (!slug) return null;
    const cleanSlug = cleanPath(slug);
    try {
        // Try page endpoint first
        const pageRes = await serverRequest(
            {},
            `${GET_SPECIFIC_PAGE_ENDPOINT}?slug=${cleanSlug}&excludeUrl=1`,
            CONSTANTS.REQUEST_GET
        );
        if (pageRes?.data && pageRes.code === CONSTANTS.STATUS_SUCCESS) {
            const d = pageRes.data;
            return {
                id: d.id,
                title: d.title,
                slug: d.slug,
                taxonomy_id: d.taxonomy_id,
                taxonomy: d.taxonomy,
                parentPageDetails: d.parentPageDetails || d.parent_page_details,
            };
        }

        // Try post endpoint fallback
        const postRes = await serverRequest(
            {},
            `${GET_SPECIFIC_POST_ENDPOINT}?slug=${cleanSlug}&excludeUrl=1`,
            CONSTANTS.REQUEST_GET
        );
        if (postRes?.data && postRes.code === CONSTANTS.STATUS_SUCCESS) {
            const d = postRes.data;
            return {
                id: d.id,
                title: d.title,
                slug: d.slug,
                taxonomy_id: d.taxonomy_id,
                taxonomy: d.taxonomy,
                parentPageDetails: d.parentPageDetails || d.parent_page_details,
            };
        }
    } catch (err) {
        console.error("Failed to fetch parent page info for breadcrumbs:", err);
    }
    return null;
};

const ParentBreadcrumbs = <T extends BreadcrumbItem = BreadcrumbItem>({
    slug: propSlug,
    currentPage: propCurrentPage
}: BreadcrumbsProps<T>) => {
    const { headerMenu } = useContext(AppContext);
    const searchParams = useSearchParams();
    const [breadcrumbMenu, setBreadcrumbMenu] = useState<BreadcrumbItem[]>(initialState);

    const parentParam = searchParams?.get("parent") || searchParams?.get("slug");

    useEffect(() => {
        let isMounted = true;

        const buildCompleteBreadcrumbs = async () => {
            if (!propCurrentPage && !propSlug && !parentParam) {
                return;
            }

            // Case 1: Query param 'parent' or 'slug' is provided
            if (parentParam) {
                // Custom dynamic breadcrumb for vendor-approval-rdso hierarchy
                if (parentParam.startsWith('vendor-approval-rdso')) {
                    // Attempt to build the trail from the header menu
                    let dynamicTrail = findTrailInMenu(headerMenu, 'vendor-approval-rdso');
                    // Fallback to static definition if menu lookup fails
                    if (!dynamicTrail) {
                        dynamicTrail = [
                            { id: 1, label: 'Home', url: '/' },
                            { id: 'mine-to-metal', label: 'Mine to Metal', url: '/mine-to-metal' },
                            { id: 'our-portfolio', label: 'Our Portfolio', url: '/our-portfolio' },
                            { id: 'vendor-approval-rdso', label: 'Vendor Approval RDSO', url: '/vendor-approval-rdso' },
                        ];
                    }
                    // Ensure Home is first
                    if (dynamicTrail.length === 0 || dynamicTrail[0].url !== '/') {
                        dynamicTrail = [{ id: 1, label: 'Home', url: '/' }, ...dynamicTrail];
                    }
                    // Append current page if available
                    if (propCurrentPage?.title) {
                        const currentSlugFormatted = propCurrentPage.slug
                            ? (propCurrentPage.slug.startsWith('/') ? propCurrentPage.slug : `/${propCurrentPage.slug}`)
                            : '';
                        dynamicTrail.push({
                            id: propCurrentPage.id || 'current',
                            label: propCurrentPage.title,
                            url: currentSlugFormatted,
                        });
                    }
                    if (isMounted) setBreadcrumbMenu(dynamicTrail);
                    return;
                }

                const fetchedParent = await fetchParentDetails(parentParam);
                if (!isMounted) return;

                if (fetchedParent && propCurrentPage) {
                    let baseTrail: BreadcrumbItem[] | null = null;
                    const parentSlugToTry = propCurrentPage.parentPageDetails?.slug || fetchedParent.parentPageDetails?.slug;

                    if (parentSlugToTry) {
                        baseTrail = findTrailInMenu(headerMenu, parentSlugToTry);
                    }

                    if (!baseTrail) {
                        baseTrail = [...initialState];
                        const parentDetails = propCurrentPage.parentPageDetails || fetchedParent.parentPageDetails;
                        const taxonomyDetails = propCurrentPage.taxonomy || fetchedParent.taxonomy;

                        if (parentDetails) {
                            baseTrail.push({
                                id: parentDetails.id || "parent",
                                label: parentDetails.title,
                                url: parentDetails.slug.startsWith('/') ? parentDetails.slug : `/${parentDetails.slug}`,
                            });
                        } else if (taxonomyDetails) {
                            const taxonomySlug = `/${taxonomyDetails.alias.replace(/\s+/g, "-").toLowerCase()}`.replace(".html", "");
                            baseTrail.push({
                                id: taxonomyDetails.id || "taxonomy",
                                label: taxonomyDetails.alias,
                                url: taxonomySlug,
                            });
                        }
                    }

                    const trail = [...baseTrail];

                    const parentPrefixSlug = propCurrentPage?.parentPageDetails?.slug || fetchedParent?.parentPageDetails?.slug;
                    let fetchedSlugFormatted = fetchedParent.slug
                        ? (fetchedParent.slug.startsWith('/') ? fetchedParent.slug : `/${fetchedParent.slug}`)
                        : "";

                    if (parentPrefixSlug) {
                        const prefix = parentPrefixSlug.startsWith('/') ? parentPrefixSlug : `/${parentPrefixSlug}`;
                        const cleanFetchedSlug = fetchedParent.slug ? cleanPath(fetchedParent.slug) : '';
                        fetchedSlugFormatted = `${prefix.replace(/\/$/, '')}/${cleanFetchedSlug}`;
                    }

                    if (!trail.some(t => t.label === fetchedParent.title || (fetchedSlugFormatted && t.url === fetchedSlugFormatted))) {
                        trail.push({
                            id: fetchedParent.id || "fetched",
                            label: fetchedParent.title,
                            url: fetchedSlugFormatted,
                        });
                    }

                    const currentSlugFormatted = propCurrentPage.slug
                        ? (propCurrentPage.slug.startsWith('/') ? propCurrentPage.slug : `/${propCurrentPage.slug}`)
                        : "";

                    if (!trail.some(t => t.label === propCurrentPage.title || (currentSlugFormatted && t.url === currentSlugFormatted))) {
                        trail.push({
                            id: propCurrentPage.id || "current",
                            label: propCurrentPage.title,
                            url: currentSlugFormatted,
                        });
                    }

                    if (isMounted) setBreadcrumbMenu(trail);
                    return;
                }
            }

            // Case 2: Standard route-based breadcrumbs
            const targetPage = propCurrentPage;
            const targetSlug = propSlug || (targetPage?.slug ? cleanPath(targetPage.slug) : "");

            if (!targetPage && !targetSlug) return;

            const parentDetails = targetPage?.parentPageDetails || targetPage?.parent_page_details;

            if (parentDetails) {
                const parentSlug = parentDetails.slug;
                let parentTrail = findTrailInMenu(headerMenu, parentSlug);

                // If parent is not directly in headerMenu, fetch parent page data to resolve its ancestors
                if (!parentTrail && parentSlug) {
                    const fetchedParent = await fetchParentDetails(parentSlug);
                    if (!isMounted) return;

                    if (fetchedParent) {
                        const grandParentSlug = fetchedParent.parentPageDetails?.slug || (fetchedParent.taxonomy?.alias ? cleanPath(fetchedParent.taxonomy.alias) : "");
                        if (grandParentSlug) {
                            const grandParentTrail = findTrailInMenu(headerMenu, grandParentSlug);
                            if (grandParentTrail) {
                                parentTrail = [
                                    ...grandParentTrail,
                                    {
                                        id: fetchedParent.id || parentDetails.id || "parent",
                                        label: fetchedParent.title || parentDetails.title,
                                        url: parentDetails.slug.startsWith('/') ? parentDetails.slug : `/${parentDetails.slug}`,
                                    }
                                ];
                            }
                        }
                    }
                }

                if (!parentTrail) {
                    parentTrail = [
                        ...initialState,
                        {
                            id: parentDetails.id || "parent",
                            label: parentDetails.title,
                            url: parentDetails.slug.startsWith('/') ? parentDetails.slug : `/${parentDetails.slug}`,
                        }
                    ];
                }

                const trail = [...parentTrail];
                const currentSlugFormatted = targetPage?.slug
                    ? (targetPage.slug.startsWith('/') ? targetPage.slug : `/${targetPage.slug}`)
                    : "";

                if (targetPage && !trail.some(t => t.label === targetPage.title || (currentSlugFormatted && t.url === currentSlugFormatted))) {
                    trail.push({
                        id: targetPage.id || "current",
                        label: targetPage.title,
                        url: currentSlugFormatted,
                    });
                }

                if (isMounted) setBreadcrumbMenu(trail);
                return;
            }

            // Subcase 2B: taxonomy
            if (targetPage?.taxonomy_id && targetPage?.taxonomy) {
                const taxSlug = targetPage.taxonomy.alias.replace(/\s+/g, "-").toLowerCase();
                let taxTrail = findTrailInMenu(headerMenu, taxSlug);

                if (!taxTrail) {
                    taxTrail = [
                        ...initialState,
                        {
                            id: targetPage.taxonomy.id || "taxonomy",
                            label: targetPage.taxonomy.alias,
                            url: `/${taxSlug}`.replace(".html", ""),
                        }
                    ];
                }

                const trail = [...taxTrail];
                const currentSlugFormatted = targetPage.slug
                    ? (targetPage.slug.startsWith('/') ? targetPage.slug : `/${targetPage.slug}`)
                    : "";

                if (!trail.some(t => t.label === targetPage.title || (currentSlugFormatted && t.url === currentSlugFormatted))) {
                    trail.push({
                        id: targetPage.id || "current",
                        label: targetPage.title,
                        url: currentSlugFormatted,
                    });
                }

                if (isMounted) setBreadcrumbMenu(trail);
                return;
            }

            // Subcase 2C: Direct page in headerMenu
            let directTrail = findTrailInMenu(headerMenu, targetSlug);

            if (!directTrail) {
                const currentSlugFormatted = targetPage?.slug
                    ? (targetPage.slug.startsWith('/') ? targetPage.slug : `/${targetPage.slug}`)
                    : (targetSlug ? `/${cleanPath(targetSlug)}` : "");

                directTrail = [
                    ...initialState,
                    ...(targetPage ? [{
                        id: targetPage.id || "current",
                        label: targetPage.title,
                        url: currentSlugFormatted,
                    }] : [])
                ];
            }

            if (isMounted) setBreadcrumbMenu(directTrail);
        };

        buildCompleteBreadcrumbs();

        return () => {
            isMounted = false;
        };
    }, [propSlug, headerMenu, propCurrentPage, parentParam]);

    return (
        <ul className="breadcrumb">
            {breadcrumbMenu.map((item, index) => {
                const isLast = index === breadcrumbMenu.length - 1;
                return (
                    <li key={`${item.id}-${index}`} className={`breadcrumb-item ${isLast ? "active" : ""}`}>
                        {!isLast && item.url ? (
                            <Link prefetch={false} href={item.url}>{item.label}</Link>
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

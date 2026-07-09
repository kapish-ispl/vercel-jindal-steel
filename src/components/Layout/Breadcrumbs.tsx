"use client";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
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

interface BreadcrumbsProps<T extends BreadcrumbItem> {
    slug: string;
    currentPage: CurrentPage;
}


const initialState: BreadcrumbItem[] = [
    { id: 1, label: "Home", url: "/" }
];

const Breadcrumbs = <T extends BreadcrumbItem>({
    slug,
    currentPage
}: BreadcrumbsProps<T>) => {
    const { headerMenu } = useContext(AppContext);
    const [breadcrumbMenu, setBreadcrumbMenu] = useState<BreadcrumbItem[]>(initialState);

    useEffect(() => {
        const buildBreadcrumbs = (menuItem: MenuItem, slug: string, trail: BreadcrumbItem[]): BreadcrumbItem[] | null => {
            const newTrail: BreadcrumbItem[] = [...trail, { id: menuItem.id, label: menuItem.name, url: menuItem.link }];

            if (menuItem.link === `/${slug}`) {
                return newTrail;
            }
            if (!currentPage.taxonomy_id && currentPage.parentPageDetails) {
                if (menuItem.link === `/${currentPage.parentPageDetails.slug}`) {
                    return [
                        ...trail,
                        {
                            id: currentPage.parentPageDetails.id,
                            label: currentPage.parentPageDetails.title,
                            url: `/${currentPage.parentPageDetails.slug}`,
                        },
                        {
                            id: currentPage.id,
                            label: currentPage.title,
                            url: `${currentPage.slug}`,
                        },
                    ];
                }
            }

            // Match taxonomy parent
            if (currentPage.taxonomy_id && currentPage.taxonomy) {
                const taxonomySlug = `/${currentPage.taxonomy.alias.replace(/\s+/g, "-").toLowerCase()}`;
                if (menuItem.link === taxonomySlug) {
                    return [
                        ...trail,
                        {
                            id: currentPage.taxonomy.id,
                            label: currentPage.taxonomy.alias,
                            url: taxonomySlug.replace(".html", ""),
                        },
                        {
                            id: currentPage.id,
                            label: currentPage.title,
                            url: `${currentPage.slug}`,
                        },
                    ];
                }
            }

            // Search children
            for (const child of menuItem.children) {
                const result = buildBreadcrumbs(child, slug, newTrail);
                if (result) return result;
            }

            return null;
        };

        let finalBreadcrumbs: BreadcrumbItem[] | null = null;

        headerMenu.forEach((menuItem: MenuItem) => {
            const result = buildBreadcrumbs(menuItem, slug, initialState);
            if (result && !finalBreadcrumbs) {
                finalBreadcrumbs = result;
            }
        });

        if (!finalBreadcrumbs) {
            finalBreadcrumbs = [
                ...initialState,
                {
                    id: currentPage.id,
                    label: currentPage.title,
                    url: `${currentPage.slug}`,
                },
            ];
        }

        setBreadcrumbMenu(finalBreadcrumbs);
    }, [slug, headerMenu, currentPage]);

    return (
        <ul className="breadcrumb">
            {breadcrumbMenu.map((item) => (
                <li key={item.id} className="breadcrumb-item">
                    {item.url ? <Link href={item.url}>{item.label}</Link> : item.label}
                </li>
            ))}
        </ul>
    );
};

export default Breadcrumbs;

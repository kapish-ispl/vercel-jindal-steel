"use client";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import Link from "next/link";

const initialState = [
    {
        id: 1,
        label: "Home",
        url: "/",
    },
];
const Breadcrumbs = ({ slug, currentPage }: any) => {
    const { headerMenu } = useContext(AppContext);
    const [menuExist, setMenuExist] = useState(false);

    const [breadcumbMenu, setBreadcumbMenu] = useState(initialState);

    useEffect(() => {
        const buildBreadcrumbs = (
            menuItem: any,
            slug: string,
            currentBreadcrumbs: { id: number; label: string; url: string }[]
        ): { id: number; label: string; url: string }[] | null => {
            const breadcrumbs = [
                ...currentBreadcrumbs,
                { id: menuItem.id, label: menuItem.name, url: menuItem.link },
            ];

            if (menuItem.link === `/${slug}.html`) {
                return breadcrumbs;
            } else {
                if (currentPage.taxonomy_id == undefined) {
                    if (
                        menuItem.link !== slug &&
                        menuItem.link === `/${currentPage?.parentPageDetails?.slug}.html`
                    ) {
                        const breadcrumbsParent = [
                            ...currentBreadcrumbs,
                            {
                                id: currentPage.parentPageDetails.id,
                                label: currentPage.parentPageDetails.title,
                                url: `/${currentPage.parentPageDetails.slug}.html`,
                            },
                            { id: currentPage.id, label: currentPage.title, url: slug },
                        ];
                        return breadcrumbsParent;
                    }
                } else {
                    if (
                        menuItem.link !== slug &&
                        menuItem.link === `/${currentPage?.taxonomy?.alias.replace(" ", "-").toLowerCase()}.html`
                    ) {
                        const breadcrumbsParent = [
                            ...currentBreadcrumbs,
                            {
                                id: currentPage?.taxonomy?.id,
                                label: currentPage?.taxonomy?.alias,
                                url: `/${currentPage?.taxonomy?.alias.replace(" ", "-").toLowerCase()}`,
                            },
                            { id: currentPage.id, label: currentPage.title, url: slug },
                        ];
                        return breadcrumbsParent;
                    }
                }
            }

            if (menuItem.children && menuItem.children.length > 0) {
                for (const child of menuItem.children) {
                    const result = buildBreadcrumbs(child, slug, breadcrumbs);
                    if (result) {
                        return result;
                    }
                }
            }

            return null;
        };

        const newBreadcrumbs: { id: number; label: string; url: string }[] = [];
        headerMenu.forEach((menuItem: any) => {
            const result = buildBreadcrumbs(menuItem, slug, initialState);
            if (result) {
                newBreadcrumbs.push(...result);
            }
        });
        newBreadcrumbs.length > 0 ? setMenuExist(true) : setMenuExist(false);
        menuExist
            ? setBreadcumbMenu(newBreadcrumbs)
            : setBreadcumbMenu([
                ...initialState,
                ...(currentPage.slug && currentPage.slug.includes('/')
                    ? currentPage.slug.split('/').filter(Boolean).slice(0, -1).map((part: string) => ({
                        id: `path-${part}`,
                        label: part.charAt(0).toUpperCase() + part.slice(1),
                        url: `/${part}.html`,
                    }))
                    : []
                ),
                {
                    id: currentPage.id,
                    label: currentPage.title,
                    url: `${currentPage.slug}.html`,
                },
            ]);
    }, [slug, headerMenu, menuExist]);
    return (
        <>
            <ul className="breadcrumb">
                {breadcumbMenu.map((cumb: any) => (
                    <li key={cumb.id} className="breadcrumb-item">
                        {cumb.url === "" ? (
                            cumb.label
                        ) : (
                            <Link href={cumb.url}>{cumb.label}</Link>
                        )}
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Breadcrumbs
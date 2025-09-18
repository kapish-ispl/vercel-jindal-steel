"use client";
import { AppContext } from "@/context/AppContext";
import { useEffect, useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { IMAGE_PATH } from "@/config/constant";

const Header = () => {
    const contextInfo = useContext(AppContext);
    const HEADER_MAIN_MENU = contextInfo.headerMenu;

    const [stickyHeader, setStickyHeader] = useState(false);
    const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
        null
    );
    const [lastScrollY, setLastScrollY] = useState(0);

    // mobile state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openAccordion, setOpenAccordion] = useState<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setScrollDirection("down");
            } else {
                setScrollDirection("up");
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        window.addEventListener("scroll", () => {
            setStickyHeader(() => window.scrollY > 50);
        });
    }, []);

    const descriptionLoop = [
        { name: "About Us", desc: "Jindal Steel is one of India’s leading steel manufacturers..." },
        { name: "Businesses", desc: "Each of Jindal Steel & Power's (JSP) businesses..." },
        { name: "People", desc: "At Jindal Steel and Power (JSP), the people are the heart..." },
        { name: "Investor & Media", desc: "JSP upholds a steadfast commitment to delivering value..." },
        { name: "Sustainability", desc: "JSP’s sustainability initiatives are rooted in a deep commitment..." },
        { name: "Community", desc: "Our Commitment lies in giving back to society..." },
    ];

    const toggleAccordion = (id: number) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    return (
        <>
            {HEADER_MAIN_MENU !== undefined && HEADER_MAIN_MENU?.length > 0 && (
                <header
                    className={`c-header ${stickyHeader ? "header-sticky" : ""} ${scrollDirection === "down" ? "hide" : "show"
                        }`}
                >
                    <div className="container cus-container">
                        <div className="row">
                            <div className="col-12">
                                <div className="c-header__main">
                                    {/* Logo */}
                                    <div className="c-header__logo">
                                        <Link href="/">
                                            {stickyHeader ? (
                                                <Image
                                                    src={IMAGE_PATH.LOGO}
                                                    alt="Jindal Steel"
                                                    priority
                                                    width={170}
                                                    height={80}
                                                />
                                            ) : (
                                                <Image
                                                    src={IMAGE_PATH.LOGO_LIGHT}
                                                    alt="Jindal Steel"
                                                    width={170}
                                                    height={80}
                                                    priority
                                                />
                                            )}
                                        </Link>
                                    </div>

                                    {/* Hamburger toggle */}
                                    <button
                                        className="mobile-toggle"
                                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    >
                                        ☰
                                    </button>

                                    {/* Desktop Menu */}
                                    <div className="c-header__nav desktop-menu">
                                        <nav className="c-header__menu">
                                            <ul className="flex menu_wrap">
                                                {HEADER_MAIN_MENU.map((menuItem: any) => {
                                                    const aa = descriptionLoop.filter(
                                                        (i: any) => i.name == menuItem.name
                                                    );
                                                    const dataItem = menuItem.name
                                                        .split(" ")
                                                        .join("_");

                                                    return (
                                                        <li
                                                            key={menuItem.id}
                                                            className="c-header__menu-list"
                                                        >
                                                            <a
                                                                target={
                                                                    menuItem.is_new_tab == 1 ? "_blank" : "_self"
                                                                }
                                                                className="c-header__menu-item"
                                                                href={menuItem.link}
                                                                data-item={
                                                                    menuItem.children.length > 0 ? dataItem : ""
                                                                }
                                                            >
                                                                {menuItem.name}
                                                            </a>

                                                            {menuItem.children.length > 0 && (
                                                                <div className="mega-panel">
                                                                    <div className="row">
                                                                        <div className="col-4">
                                                                            {aa[0] && (
                                                                                <p className="c-content-16 clr-black mt-2">
                                                                                    {aa[0].desc}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-6">
                                                                            <ul className="mega-menu">
                                                                                {menuItem.children.map(
                                                                                    (subMenu: any) => (
                                                                                        <li
                                                                                            key={subMenu.id}
                                                                                            className="mega-menu__item"
                                                                                        >
                                                                                            <Link
                                                                                                href={subMenu.link}
                                                                                                target={
                                                                                                    subMenu.type === "external"
                                                                                                        ? "_blank"
                                                                                                        : "_self"
                                                                                                }
                                                                                                className="mega-menu__link"
                                                                                            >
                                                                                                {subMenu.name}
                                                                                            </Link>
                                                                                        </li>
                                                                                    )
                                                                                )}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </nav>
                                    </div>

                                    {/* Mobile Menu Accordion */}
                                    {mobileMenuOpen && (
                                        <>
                                            <div onClick={() => setMobileMenuOpen(false)} className="mobile-overlay"></div>
                                            <div className="mobile-menu">
                                                <ul className="accordion-menu">
                                                    {HEADER_MAIN_MENU.map((menuItem: any, idx: number) => (
                                                        <li key={menuItem.id} className="accordion-item">
                                                            <button
                                                                className="accordion-header"
                                                                onClick={() => toggleAccordion(idx)}
                                                            >
                                                                {menuItem.name}
                                                                {menuItem.children.length > 0 && (
                                                                    <span>
                                                                        {openAccordion === idx ? "−" : "+"}
                                                                    </span>
                                                                )}
                                                            </button>
                                                            {openAccordion === idx &&
                                                                menuItem.children.length > 0 && (
                                                                    <ul className="accordion-content">
                                                                        {menuItem.children.map((subMenu: any) => (
                                                                            <li key={subMenu.id}>
                                                                                <Link href={subMenu.link}>
                                                                                    {subMenu.name}
                                                                                </Link>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            )}
        </>
    );
};

export default Header;

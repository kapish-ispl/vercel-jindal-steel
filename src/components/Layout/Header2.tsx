"use client";
import { AppContext } from "@/context/AppContext";
import { useEffect, useState, useContext, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { IMAGE_PATH } from "@/config/constant";
import RecursiveMenu from "./RecursiveMenu";
import MobileMenu from "./MobileMenu";
import { buildMegaColumns } from "./buildMegaColumns";

export interface menuItemsProps {
    id: number,
    name: string,
    link: string,
    is_new_tab?: number,
    children: menuItemsProps[],
}
export interface RecursiveMenuProps {
    items: menuItemsProps[];
    isThirdMenu: boolean;
    setThirdLevelMenu?: (items: menuItemsProps[] | null) => void;
}
const Header = () => {
    const contextInfo = useContext(AppContext);
    const menuRef = useRef<HTMLDivElement>(null);
    const HEADER_MAIN_MENU = contextInfo.headerMenu;

    const [stickyHeader, setStickyHeader] = useState(false);
    const [isMegaActive, setIsMegaActive] = useState<boolean>(false);
    const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
        null
    );
    const [lastScrollY, setLastScrollY] = useState(0);

    // mobile state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [thirdLevelMenu, setThirdLevelMenu] = useState<menuItemsProps[] | null>(null);


    // desktop menu active item for hover/focus
    const [activeMenu, setActiveMenu] = useState<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            let direction: "up" | "down" | "" = "";
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                direction = "down";
            } else {
                direction = "up";
            }

            if (direction && direction !== scrollDirection) {
                setScrollDirection(direction);

                document.body.classList.remove("header_scroll_up", "header_scroll_down");
                document.body.classList.add(
                    direction === "down" ? "header_scroll_down" : "header_scroll_up"
                );
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY, scrollDirection]);

    useEffect(() => {
        const handleSticky = () => setStickyHeader(window.scrollY > 50);
        window.addEventListener("scroll", handleSticky);
        return () => window.removeEventListener("scroll", handleSticky);
    }, []);

    const menuTrigger = () => {
        setMobileMenuOpen(false);
        document.querySelector(".app-mainWrapper")?.classList.remove("overflow-hidden");
        document.querySelector(".app-container")?.classList.remove("overflow-hidden");
    };

    const descriptionLoop = [
        {
            name: "Our Story",
            desc: "Rooted in steel and evolving across sectors, the Naveen Jindal Group continues to shape sustainable and inclusive growth."
        },
        {
            name: "Businesses",
            desc: "The Naveen Jindal Group's businesses comprise a global portfolio of operating companies across geographies and sectors."
        },
        {
            name: "Sectors",
            desc: "The Naveen Jindal Group's sectors form the pillars of its progress, spanning steel, energy, resources, and infrastructure."
        },
        {
            name: "Investor & Media",
            desc: "Jindal Steel upholds a steadfast commitment to delivering sustainable value for all stakeholders. Its remarkable track record of financial discipline attests to its continuous pursuit of excellence as a world-class organisation."
        },
        {
            name: "Sustainability",
            desc: "Sustainability at the Naveen Jindal Group is rooted in purpose, integrating environmental responsibility, social impact, and robust governance."
        },
        {
            name: "Community",
            desc: "Our commitment lies in giving back to society through programs that empower the underprivileged and socially vulnerable segments of the community."
        },
        {
            name: "People",
            desc: "At the Naveen Jindal Group, people are at the heart of progress, bringing skill, purpose, and leadership across geographies."
        },
    ];
    return (
        <>
            {HEADER_MAIN_MENU && HEADER_MAIN_MENU.length > 0 && (
                <header ref={menuRef}
                    className={`c-header ${isMegaActive ? "mega-menu--active" : ""} ${stickyHeader ? "header-sticky" : ""
                        } ${scrollDirection === "down" ? "hide" : "show"}`}
                    onMouseEnter={() => setIsMegaActive(true)}
                    onMouseLeave={() => {
                        setActiveMenu(null);
                        setIsMegaActive(false);
                    }}
                >
                    <div className="container cus-container">
                        <div className="row">
                            <div className="col-12">
                                <div className="c-header__main">
                                    {/* Logo */}
                                    <div className="c-header__logo">
                                        <Link prefetch={false} href="/">
                                            {stickyHeader ? (
                                                <Image
                                                    src={IMAGE_PATH.LOGO}
                                                    alt="Jindal Steel"
                                                    className="img-fluid"
                                                    priority
                                                    width={170}
                                                    height={80}
                                                />
                                            ) : (
                                                isMegaActive ?
                                                    <Image
                                                        src={IMAGE_PATH.LOGO}
                                                        alt="Jindal Steel"
                                                        className="img-fluid"
                                                        priority
                                                        width={190}
                                                        height={86}
                                                    />
                                                    :
                                                    <Image
                                                        src={IMAGE_PATH.LOGO_LIGHT}
                                                        alt="Jindal Steel"
                                                        className="img-fluid"
                                                        width={190}
                                                        height={86}
                                                        priority
                                                    />
                                            )}
                                        </Link>
                                    </div>

                                    {/* Hamburger toggle */}
                                    <button
                                        className="mobile-toggle"
                                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                        aria-label="Toggle mobile menu"
                                    >
                                        <div className="icon-menu"></div>
                                    </button>

                                    {/* Desktop Menu */}
                                    <div className="c-header__nav desktop-menu">
                                        <nav className="c-header__menu" role="navigation" aria-label="Main menu">
                                            <ul className="flex menu_wrap" role="menubar">
                                                {HEADER_MAIN_MENU.map((menuItem: menuItemsProps) => {
                                                    const aa = descriptionLoop.filter((i) => i.name.toLowerCase() === menuItem.name.toLowerCase());
                                                    const dataItem = menuItem.name.split(" ").join("_");

                                                    const { fixedItems, sections } = buildMegaColumns(
                                                        menuItem.children ?? []
                                                    );

                                                    const isSingleSection = sections.length === 1;
                                                    return (
                                                        <li
                                                            key={menuItem.id}
                                                            className={`c-header__menu-list ${(activeMenu === menuItem.id && isMegaActive) ? "active" : ""
                                                                }`}
                                                            role="none"
                                                            onMouseEnter={() => {
                                                                setActiveMenu(menuItem.id);
                                                                setThirdLevelMenu(null);
                                                                setIsMegaActive(true)
                                                            }}
                                                        // onMouseLeave={() => {
                                                        //   setActiveMenu(null);
                                                        //   setIsMegaActive(false);
                                                        // }}
                                                        >
                                                            <Link
                                                                prefetch={false}
                                                                href={menuItem.link}
                                                                target={menuItem.is_new_tab === 1 ? "_blank" : "_self"}
                                                                className="c-header__menu-item"
                                                                data-item={menuItem.children.length > 0 ? dataItem : ""}
                                                                role="menuitem"
                                                                aria-haspopup={menuItem.children.length > 0 ? "true" : undefined}
                                                                aria-expanded={
                                                                    menuItem.children.length > 0 && activeMenu === menuItem.id
                                                                        ? "true"
                                                                        : "false"
                                                                }
                                                                aria-controls={
                                                                    menuItem.children.length > 0 ? `submenu-${menuItem.id}` : undefined
                                                                }
                                                                tabIndex={0}
                                                                onFocus={() => setActiveMenu(menuItem.id)}
                                                                onBlur={() => setActiveMenu(null)}
                                                                onClick={() => setIsMegaActive(false)}
                                                            >
                                                                {menuItem.name}
                                                            </Link>

                                                            {menuItem.children.length > 0 && (
                                                                <ul
                                                                    id={`submenu-${menuItem.id}`}
                                                                    role="menu"
                                                                    className="mega-panel"
                                                                    aria-hidden={activeMenu !== menuItem.id}
                                                                >
                                                                    <li role="none">
                                                                        <div className="container cus-container py-5">
                                                                            <div className="row">
                                                                                <div className="col-6">
                                                                                    <div className="row">
                                                                                        <div className="col-6">
                                                                                            <div className="mega-menu">
                                                                                                <h3 className="mega-menu-title">{menuItem.name}</h3>
                                                                                                {aa.length > 0 &&
                                                                                                    aa.map((item: any, index: number) => (
                                                                                                        <p
                                                                                                            className="mega-menu__description"
                                                                                                            key={index}
                                                                                                        >
                                                                                                            {item.desc}
                                                                                                        </p>
                                                                                                    ))}
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="col-6 ps-5">
                                                                                            {fixedItems.length > 0 &&
                                                                                                fixedItems[0].children && fixedItems[0].children.length > 0 ?
                                                                                                <div className="mega-menu">
                                                                                                    <h3 className="mega-menu-itemMenu">
                                                                                                        {fixedItems[0].name}
                                                                                                    </h3>
                                                                                                    <ul className="mega-menu__list">
                                                                                                        {fixedItems[0].children.map((item: any) => (
                                                                                                            <li key={item.id}>
                                                                                                                <span className="left_icon">
                                                                                                                    <svg
                                                                                                                        width="7"
                                                                                                                        height="9"
                                                                                                                        viewBox="0 0 7 9"
                                                                                                                        fill="none"
                                                                                                                    >
                                                                                                                        <path
                                                                                                                            d="M0.5 0.5L5.34 4.1C5.64 4.32 5.64 4.68 5.34 4.9L0.5 8.5"
                                                                                                                            stroke="#4FB848"
                                                                                                                            strokeLinecap="round"
                                                                                                                        />
                                                                                                                    </svg>
                                                                                                                </span>
                                                                                                                <Link prefetch={false} onClick={() => setIsMegaActive(false)} href={item.link}>{item.name}</Link>
                                                                                                            </li>
                                                                                                        ))}
                                                                                                    </ul>
                                                                                                </div>

                                                                                                :

                                                                                                fixedItems.length > 0 && (
                                                                                                    <div className="mega-menu ">
                                                                                                        <ul className="mega-menu__list">
                                                                                                            {fixedItems.map((item: any) => (
                                                                                                                <li key={item.id}>
                                                                                                                    <span className="left_icon">
                                                                                                                        <svg
                                                                                                                            width="7"
                                                                                                                            height="9"
                                                                                                                            viewBox="0 0 7 9"
                                                                                                                            fill="none"
                                                                                                                        >
                                                                                                                            <path
                                                                                                                                d="M0.5 0.5L5.34 4.1C5.64 4.32 5.64 4.68 5.34 4.9L0.5 8.5"
                                                                                                                                stroke="#4FB848"
                                                                                                                                strokeLinecap="round"
                                                                                                                            />
                                                                                                                        </svg>
                                                                                                                    </span>
                                                                                                                    <Link prefetch={false} onClick={() => setIsMegaActive(false)} href={item.link}>{item.name}</Link>
                                                                                                                </li>
                                                                                                            ))}
                                                                                                        </ul>
                                                                                                    </div>
                                                                                                )

                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-6">
                                                                                    <div className="row">
                                                                                        {sections.map((section: any, index: number) => (
                                                                                            <div
                                                                                                key={section.id}
                                                                                                className={`${isSingleSection ? "col-6" : "col-6"} ps-5`}
                                                                                            >
                                                                                                <div className="mega-menu">
                                                                                                    <h3 className="mega-menu-itemMenu">
                                                                                                        {section.name}
                                                                                                    </h3>

                                                                                                    <RecursiveMenu
                                                                                                        items={section.children ?? []}
                                                                                                        isThirdMenu={false}
                                                                                                        setIsMegaActive={setIsMegaActive}
                                                                                                        setThirdLevelMenu={setThirdLevelMenu}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>

                                                                                {/* DYNAMIC MENU COLUMNS */}
                                                                                {/* {buildMegaColumns(menuItem.children ?? []).map(
                                          ({ item, colSpan }: any) => (
                                            <div key={item.id} className={`col-${colSpan}`}>
                                              <div className="mega-menu">
                                                <h3 className="mega-menu-itemMenu">
                                                  {item.name}
                                                </h3>
                                                {item.children.length > 0 &&
                                                  <RecursiveMenu
                                                    items={item.children}
                                                    isThirdMenu={false}
                                                    setThirdLevelMenu={setThirdLevelMenu}
                                                  />
                                                }

                                              </div>
                                            </div>
                                          )
                                        )} */}
                                                                                {/* {buildMegaColumns(menuItem.children ?? []).map(
                                          (column: any, index: number) => (
                                            <div key={index} className={`col-${column.colSpan} ps-5`}>
                                              <div className="mega-menu">
                                                {column.type === "section" && column.item && (
                                                  <>
                                                    <h3 className="mega-menu-itemMenu">
                                                      {column.item.name}
                                                    </h3>

                                                    <RecursiveMenu
                                                      items={column.item.children ?? []}
                                                      isThirdMenu={false}
                                                      setThirdLevelMenu={setThirdLevelMenu}
                                                    />
                                                  </>
                                                )}

                                                {column.type === "simple" && (
                                                  <>
                                                    <ul className="mega-menu__list">
                                                      {column.items?.map((item: any) => (
                                                        <li key={item.id}>
                                                          <span className="left_icon">
                                                                <svg
                                                                    width="7"
                                                                    height="9"
                                                                    viewBox="0 0 7 9"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        d="M0.5 0.500031L5.34236 4.10009C5.6395 4.32099 5.6395 4.67907 5.34236 4.89998L0.500001 8.50003"
                                                                        stroke="#4FB848"
                                                                        strokeLinecap="round"
                                                                    />
                                                                </svg>
                                                            </span>
                                                          <a href={item.link}>{item.name}</a>
                                                        </li>
                                                      ))}
                                                    </ul>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          )
                                        )} */}
                                                                                {/* <div className="col-3">
                                          <div className="mega-menu">
                                            <h3 className="mega-menu-itemMenu">{menuItem.children[0].name}</h3>
                                            <RecursiveMenu items={menuItem.children[0].children} isThirdMenu={false} setThirdLevelMenu={setThirdLevelMenu} />
                                          </div>
                                        </div>
                                        <div className="col-6">
                                          <div className="mega-menu">
                                            <h3 className="mega-menu-itemMenu">{menuItem.children[1].name}</h3>
                                            <RecursiveMenu items={menuItem.children[1].children} isThirdMenu={false} setThirdLevelMenu={setThirdLevelMenu} />
                                          </div>
                                        </div> */}

                                                                                {/* <div className="col-6">
                                          <div className={`mega-menu ${menuItem.name.split(" ").join("_").toLowerCase()}`}>
                                            <h3 className="mega-menu-title">{menuItem.name}</h3>
                                            <RecursiveMenu items={menuItem.children} isThirdMenu={false} setThirdLevelMenu={setThirdLevelMenu} />
                                          </div>
                                        </div>
                                        <div className="col-6 p-0">
                                          <div className={`mega-menu__inner`}>

                                            {thirdLevelMenu != null &&
                                              <div className="mega-menu__inner_menu" data-lenis-ignore><RecursiveMenu items={thirdLevelMenu} isThirdMenu={true} /></div>
                                            }
                                          </div>

                                        </div> */}
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            )}
                                                        </li>
                                                    );
                                                })}
                                            </ul>

                                        </nav>
                                    </div>

                                    {/* Mobile Menu Accordion */}
                                    {/* {mobileMenuOpen && (
                    <>
                      <div
                        onClick={() => setMobileMenuOpen(false)}
                        className="mobile-overlay"
                      ></div>
                      <div className="mobile-menu">
                        <ul className="accordion-menu">
                          {HEADER_MAIN_MENU.map((menuItem: any, idx: number) => (
                            <li key={menuItem.id} className="accordion-item">
                              <Link
                                className="accordion-header"
                                href={menuItem.link}
                                prefetch={false}
                                target={menuItem.type === "external" ? "_blank" : "_self"}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {menuItem.name}
                              </Link>
                              {menuItem.children.length > 0 && (
                                <span onClick={() => toggleAccordion(idx)}>{openAccordion === idx ? "−" : "+"}</span>
                              )}
                              {openAccordion === idx &&
                                menuItem.children.length > 0 && (
                                  <ul className="accordion-content">
                                    {menuItem.children.map((subMenu: any) => (
                                      <li key={subMenu.id}>
                                        <Link
                                          prefetch={false}
                                          href={subMenu.link}
                                          onClick={() => setMobileMenuOpen(false)}>
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
                  )} */}
                                </div>
                                {mobileMenuOpen && (
                                    <MobileMenu menuState={mobileMenuOpen} menuTrigger={menuTrigger} />
                                )}
                            </div>
                        </div>
                    </div>
                </header>
            )}
        </>
    );
};

export default Header;

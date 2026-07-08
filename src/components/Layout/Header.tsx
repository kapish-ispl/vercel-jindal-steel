"use client";
import Image from "next/image";
import Link from "next/link";
import { AppContext } from "@/context/AppContext";
import { useEffect, useState, useContext, useRef } from "react";
import { IMAGE_PATH } from "@/config/constant";
import RecursiveMenu from "./RecursiveMenu";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const contextInfo = useContext(AppContext);
  const menuRef = useRef<HTMLDivElement>(null);
  const HEADER_MAIN_MENU = contextInfo.headerMenu;
  const [isMegaActive, setIsMegaActive] = useState<boolean>(false);
  const [stickyHeader, setStickyHeader] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null);
  const [thirdLevelMenu, setThirdLevelMenu] = useState<number | null>(null);
  // Stored in a ref so scroll tracking never triggers a re-render
  const lastScrollYRef = useRef(0);
  const scrollDirectionRef = useRef<"up" | "down" | null>(null);
  const stickyRef = useRef(false);

  // mobile state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // desktop menu active item for hover/focus
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const menuTrigger = () => {
    setMobileMenuOpen(false);
    document.querySelector(".app-mainWrapper")?.classList.remove("overflow-hidden");
    document.querySelector(".app-container")?.classList.remove("overflow-hidden");
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const prev = lastScrollYRef.current;

      // --- sticky ---
      const isNowSticky = currentScrollY > 50;
      if (isNowSticky !== stickyRef.current) {
        stickyRef.current = isNowSticky;
        setStickyHeader(isNowSticky);
      }

      // --- direction (only update state when direction actually changes) ---
      const newDirection: "up" | "down" = currentScrollY > prev && currentScrollY > 50 ? "down" : "up";
      if (newDirection !== scrollDirectionRef.current) {
        scrollDirectionRef.current = newDirection;
        setScrollDirection(newDirection);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // stable — no deps because all mutable tracking lives in refs

  const descriptionLoop = [
    {
      name: "Our Story",
      desc: "Jindal Steel is one of India’s leading steel manufacturers, with a significant presence in steel, power, mining and infrastructure.",
    },
    {
      name: "Mine to Metal",
      desc: "Jindal Steel's integrated business is committed to driving innovation and excellence to deliver sustainable solutions, while simultaneously focusing on nation-building and community empowerment.",
    },
    {
      name: "People",
      desc: "At Jindal Steel, our people drive our success and shape our mission. They are at the core of everything we do.",
    },
    {
      name: "Investor",
      desc: "Jindal Steel upholds a steadfast commitment to delivering sustainable value for all stakeholders. Its remarkable track record of financial discipline attests to its continuous pursuit of excellence as a world-class organisation.",
    },
    {
      name: "SustainAbility",
      desc: "At Jindal Steel, the company's sustainability initiatives are rooted in a deep commitment to forging a greener future through responsible practices and eco-conscious innovation.",
    },
    {
      name: "Newsroom",
      desc: "Access the latest press releases, corporate updates, and media resources from Jindal Steel."
    },
    {
      name: "Community",
      desc: "Our Commitment lies in giving back to society...",
    },
  ];

  return (
    <>
      {HEADER_MAIN_MENU && HEADER_MAIN_MENU.length > 0 && (
        <header ref={menuRef}
          className={`c-header ${isMegaActive ? "mega-menu--active" : ""} ${stickyHeader ? "header-sticky" : ""
            } ${scrollDirection === "down" ? "hide" : "show"}`}
        >
          <div className="container cus-container">
            <div className="row">
              <div className="col-12">
                <div className="c-header__main">
                  {/* Logo */}
                  <div className="c-header__logo">
                    <Link href="/">
                      <Image
                        src={IMAGE_PATH.LOGO}
                        alt="Jindal Steel"
                        className="img-fluid logo-dark"
                        priority
                        width={stickyHeader ? 170 : 190}
                        height={stickyHeader ? 80 : 86}
                      />
                      <Image
                        src={IMAGE_PATH.LOGO_LIGHT}
                        alt="Jindal Steel"
                        className="img-fluid logo-light"
                        priority
                        width={190}
                        height={86}
                      />
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

                  <div className="c-header__nav desktop-menu">
                    <nav className="c-header__menu" role="navigation" aria-label="Main menu">
                      <ul className="flex menu_wrap" role="menubar">
                        {HEADER_MAIN_MENU.map((menuItem: any) => {
                          const aa = descriptionLoop.filter((i) => i.name.toLowerCase() === menuItem.name.toLowerCase());
                          const dataItem = menuItem.name.split(" ").join("_");
                          return (
                            <li
                              key={menuItem.id}
                              className="c-header__menu-list"
                              role="none"
                              onMouseEnter={() => setThirdLevelMenu(null)}
                            >
                              <Link
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
                                        <div className="col-4">
                                          <div className="row">
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
                                        </div>
                                        <div className="col-4">
                                          <div className={`mega-menu ${menuItem.name.split(" ").join("_").toLowerCase()}`}>
                                            <RecursiveMenu items={menuItem.children} isThirdMenu={false} setIsMegaActive={setIsMegaActive} setThirdLevelMenu={setThirdLevelMenu} />
                                          </div>
                                        </div>
                                        <div className="col-4 p-0">
                                          <div className={`mega-menu__inner`}>
                                            {thirdLevelMenu != null && <RecursiveMenu items={thirdLevelMenu} setIsMegaActive={setIsMegaActive} isThirdMenu={true} />
                                            }
                                          </div>

                                        </div>
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
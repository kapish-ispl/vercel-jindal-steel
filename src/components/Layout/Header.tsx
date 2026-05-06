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
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );
  const [thirdLevelMenu, setThirdLevelMenu] = useState<number | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  // mobile state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

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
    const handleSticky = () => setStickyHeader(window.scrollY > 50);
    window.addEventListener("scroll", handleSticky);
    return () => window.removeEventListener("scroll", handleSticky);
  }, []);

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
      desc: "At Jindal Steel, the people are the heart and soul of the institution, leading its success and shaping its mission.",
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
      name: "Media",
      desc: "Jindal Steel upholds a steadfast commitment to delivering sustainable value for all stakeholders. Its remarkable track record of financial discipline attests to its continuous pursuit of excellence as a world-class organisation."
    },
    {
      name: "Community",
      desc: "Our Commitment lies in giving back to society...",
    },
  ];

  const toggleAccordion = (id: number) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

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
                    <Link href="/">
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
                  {/* <div className="c-header__nav desktop-menu">
                    <nav className="c-header__menu" role="navigation" aria-label="Main menu">
                      <ul className="flex menu_wrap" role="menubar">
                        {HEADER_MAIN_MENU.map((menuItem: any) => {
                          const aa = descriptionLoop.filter(
                            (i: any) => i.name === menuItem.name
                          );
                          const dataItem = menuItem.name.split(" ").join("_");

                          return (
                            <li
                              key={menuItem.id}
                              className={`c-header__menu-list ${activeMenu === menuItem.id ? "active" : ""
                                }`}
                              role="none"
                              onMouseEnter={() => setActiveMenu(menuItem.id)}
                              onMouseLeave={() => setActiveMenu(null)}
                            >
                              <a
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
                              >
                                {menuItem.name}
                              </a>

                              {menuItem.children.length > 0 && (
                                <ul
                                  id={`submenu-${menuItem.id}`}
                                  role="menu"
                                  className="mega-panel"
                                  aria-hidden={activeMenu !== menuItem.id}
                                >
                                  <li className="row">
                                    <li className="col-4">
                                      {aa.length > 0 && aa.map((item: any, index: number) => (
                                        <p className="c-content-16 clr-black mt-2 pe-5 me-3" key={index}>
                                          {item.desc}
                                        </p>
                                      ))}
                                    </li>
                                    <li className="col-6">
                                      <ul className="mega-menu">
                                        {menuItem.children.map((subMenu: any) => (
                                          <li key={subMenu.id} role="none">
                                            <Link
                                              href={subMenu.link}
                                              role="menuitem"
                                              target={subMenu.type === "external" ? "_blank" : "_self"}
                                              className="mega-menu__link"
                                            >
                                              {subMenu.name}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </li>
                                  </li>
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </nav>
                  </div> */}

                  <div className="c-header__nav desktop-menu">
                    <nav className="c-header__menu" role="navigation" aria-label="Main menu">
                      <ul className="flex menu_wrap" role="menubar">
                        {HEADER_MAIN_MENU.map((menuItem: any) => {
                          const aa = descriptionLoop.filter((i) => i.name.toLowerCase() === menuItem.name.toLowerCase());
                          const dataItem = menuItem.name.split(" ").join("_");
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
                              //   setIsMegaActive(false);
                              //   setActiveMenu(null);
                              // }}
                            >
                              {/* <a
                                href={menuItem.link}
                                target={menuItem.is_new_tab === 1 ? "_blank" : "_self"}
                                className="c-header__menu-item"
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
                                onFocus={() => {
                                  setActiveMenu(menuItem.id);
                                  setIsMegaActive(true);
                                }}
                                onBlur={() => {
                                  setActiveMenu(null);
                                  setIsMegaActive(false);
                                }}
                              >
                                {menuItem.name}
                              </a> */}

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
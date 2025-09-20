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

  // desktop menu active item for hover/focus
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

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
      name: "About Us",
      desc: "Jindal Steel is one of India’s leading steel manufacturers, with a significant presence in steel, power, mining and infrastructure.",
    },
    {
      name: "Businesses",
      desc: "Each of Jindal Steel & Power's (JSP) businesses...",
    },
    {
      name: "People",
      desc: "At Jindal Steel and Power (JSP), the people are the heart...",
    },
    {
      name: "Investor & Media",
      desc: "JSP upholds a steadfast commitment to delivering value...",
    },
    {
      name: "Sustainability",
      desc: "JSP’s sustainability initiatives are rooted in a deep commitment...",
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
        <header
          className={`c-header ${
            stickyHeader ? "header-sticky" : ""
          } ${scrollDirection === "down" ? "hide" : "show"}`}
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
                    aria-label="Toggle mobile menu"
                  >
                  <div className="icon-chart-no-axes-gantt"></div>
                  </button>

                  {/* Desktop Menu */}
                  <div className="c-header__nav desktop-menu">
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
                              className={`c-header__menu-list ${
                                activeMenu === menuItem.id ? "active" : ""
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

                              {menuItem.children.length > 0 && activeMenu === menuItem.id && (
                                <ul
                                  id={`submenu-${menuItem.id}`}
                                  role="menu"
                                  className="mega-panel"
                                  aria-hidden={activeMenu !== menuItem.id}
                                >
                                  <div className="row">
                                    <div className="col-4">
                                      {aa[0] && (
                                        <p className="c-content-16 clr-black mt-2 pe-5 me-3">
                                          {aa[0].desc}
                                        </p>
                                      )}
                                    </div>
                                    <div className="col-6">
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
                                    </div>
                                  </div>
                                </ul>
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
                      <div
                        onClick={() => setMobileMenuOpen(false)}
                        className="mobile-overlay"
                      ></div>
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
                                  <span>{openAccordion === idx ? "−" : "+"}</span>
                                )}
                              </button>
                              {openAccordion === idx &&
                                menuItem.children.length > 0 && (
                                  <ul className="accordion-content">
                                    {menuItem.children.map((subMenu: any) => (
                                      <li key={subMenu.id}>
                                        <Link href={subMenu.link}>{subMenu.name}</Link>
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

import Link from "next/link";

function RecursiveMenu({ items, isThirdMenu, setThirdLevelMenu }: any) {
    return (
        <ul role="menu">
            {items.map((item: any) => {
                return (
                    <li key={item.id} role="none">
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

                        <Link
                            href={item.link}
                            role="menuitem"
                            onMouseEnter={() => setThirdLevelMenu(item.children && item.children.length > 0 ? item.children : null)}
                            target={item.type === "external" ? "_blank" : "_self"}
                        >
                            {item.name}
                            {!isThirdMenu &&
                                item.children && item.children.length > 0 &&
                                <span className="right_icon">
                                    <svg width="14" height="24" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.5 0.500031L5.34236 4.10009C5.6395 4.32099 5.6395 4.67907 5.34236 4.89998L0.500001 8.50003" stroke="#A1A1A1" stroke-linecap="round" /></svg>
                                </span>
                            }
                        </Link>

                        {/* ✅ Recursively render nested menu if it has children */}
                        {/* {item.children && item.children.length > 0 && (
                        <RecursiveMenu items={item.children} />
                    )} */}
                    </li>
                )
            })}
        </ul>
    );
}

export default RecursiveMenu;
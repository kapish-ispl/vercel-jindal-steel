import { motion } from "framer-motion";
import Link from "next/link";
import { FC, useState, useEffect } from "react";

interface MenuItem {
    id: number | string;
    name?: string;
    link?: string;
    children?: MenuItem[];
}

interface Props {
    menuState?: boolean;
    menuTriggered: () => void;
    item: MenuItem;
    index: number;
    activeIndex: number | null;
    setActiveIndex: (index: number | null) => void;
}
const MobileMenuItems: FC<Props> = ({ item, menuState, menuTriggered, index, activeIndex, setActiveIndex }) => {
    const [childActiveIndex, setChildActiveIndex] = useState<number | null>(null);
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = activeIndex === index;

    const handleAccordionClick = (index: number) => {
        setActiveIndex(isOpen ? null : index);
    }

    useEffect(() => {
        if (!isOpen) {
            setChildActiveIndex(null);
        }
    }, [isOpen]);
    const isActive = activeIndex === index;
    return (
        <li className={`${hasChildren ? "submenu" : ""}`}>
            {hasChildren ? (
                <>
                    <button onClick={() => handleAccordionClick(index)} className="mobMenu">
                        <span className="mobMenu__text">{item.name}</span>
                        <span className="mobMenu__icon">
                            <motion.svg width="22" height="22" viewBox="0 0 20 20"
                                animate={{ rotate: isActive ? 180 : 0, }}
                                transition={{ duration: 0.3, ease: "easeInOut", }}>
                                <motion.line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <motion.line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                    animate={{ opacity: isActive ? 0 : 1, rotate: isActive ? 90 : 0, }}
                                    transition={{ duration: 0.3, ease: "easeInOut", }}
                                />
                            </motion.svg>
                        </span>
                        {/* <span>{activeIndex === index ? '-' : '+'}</span> */}
                    </button>
                    <ul className={isActive ? 'subdropmenu show' : 'dropdown-menu'}>
                        {item?.children?.map((child, childIndex) => (
                            <MobileMenuItems
                                key={child.id}
                                item={child}
                                menuState={menuState}
                                menuTriggered={menuTriggered}
                                index={childIndex}
                                activeIndex={childActiveIndex}
                                setActiveIndex={setChildActiveIndex}
                            />
                        ))}
                    </ul>
                </>
            ) : (
                <Link prefetch={false} href={item.link ? item.link.split(".html")[0] : "#!"} className="accordion-header" onClick={menuTriggered}>
                    {item.name}
                </Link>
            )}
        </li>
    )
};

export default MobileMenuItems;

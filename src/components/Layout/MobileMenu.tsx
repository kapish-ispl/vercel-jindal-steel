import { FC, useContext, useState } from 'react';
import { AppContext } from '@/context/AppContext';
import MobileMenuItems from './MobileMenuItems';

interface MenuItem {
    id: number | string;
    name?: string;
    link?: string;
    children?: MenuItem[];
}
interface Props {
    menuState?: boolean;
    menuTrigger: () => void;
    item?: MenuItem
}
const MobileMenu: FC<Props> = ({ menuState, menuTrigger }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const contextInfo = useContext(AppContext);
    const HEADER_MAIN_MENU = contextInfo.headerMenu;

    return (
        <>
            <nav className={`c-header__nav-main ${menuState ? 'active' : ''}`}>
                <div className="c-header__nav-mobile">
                    <div
                        className={`mobile-overlay`}
                        onClick={() => menuTrigger()}
                    ></div>
                    <div className={`mobile-menu`} data-lenis-ignore>
                        <button
                            type="button"
                            className="mobile-menu__close"
                            onClick={() => menuTrigger()}
                            aria-label="Close mobile menu"
                        >
                            <span className="icon-x" aria-hidden="true"></span>
                        </button>
                        <ul className="accordion-menu">
                            {HEADER_MAIN_MENU !== undefined &&
                                HEADER_MAIN_MENU.map((item: { id: number }, index: number) => (
                                    <MobileMenuItems
                                        key={item.id}
                                        item={item}
                                        menuState={menuState}
                                        menuTriggered={menuTrigger}
                                        index={index}
                                        activeIndex={activeIndex}
                                        setActiveIndex={setActiveIndex}
                                    />
                                ))}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default MobileMenu;

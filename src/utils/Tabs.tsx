/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { FC } from "react";

const Tabs: FC<{ data: any }> = ({ data }) => {
    const [openTab, setOpenTab] = useState(0);

    const clickHandler = (key: any) => {
        setOpenTab(key);
    };

    useEffect(() => {
        const filterData = data.filter((items: any) => items.props !== undefined);
        if (filterData.length > 0) {
            setOpenTab(filterData[0].key);
        }
    }, []);
    return (
        <>
            <div className="tabbing_wrap v1">
                <ul>
                    {data.length > 0 &&
                        data
                            .filter((items: any) => items.props !== undefined)
                            .map((tabItem: any) => {
                                return (
                                    <li key={tabItem.props.label} onClick={() => clickHandler(tabItem.key)}>
                                        <button className={`tabbing_wrap_item c-sector__item ${openTab == tabItem.key ? "active" : ""}`}>
                                            <span  className="c-sector__item_label">{tabItem.props.label}</span>
                                            <span className="c-sector__item_border"></span>
                                        </button>
                                    </li>
                                );
                            })}
                </ul>

                <div className="tabbing_wrap_content">
                    {data.length > 0 &&
                        data
                            .filter((items: any) => items.props !== undefined)
                            .map((tabItem: any) => {
                                return (
                                    <div key={tabItem.key} className={`tabbing_wrap_content_item ${openTab == tabItem.key ? "active" : "hidden"}`}>
                                        <div className="row">
                                            {tabItem.props.children}
                                        </div>
                                    </div>
                                );
                            })}
                </div>
            </div>
        </>
    );
};

export default Tabs;

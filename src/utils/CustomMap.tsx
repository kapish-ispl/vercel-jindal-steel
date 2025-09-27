"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import WorldMap from '@/components/maps/WorldMap';
import IndiaMap from '@/components/maps/IndiaMap';
import AfricaMap from '@/components/maps/AfricaMap';
import OmanMap from '@/components/maps/OmanMap';
import CzechiaMap from '@/components/maps/CzechiaMap';
import AustraliaMap from "@/components/maps/AustraliaMap";

const CustomMap = (props: any) => {
    const [openTab, setOpenTab] = useState(0);
    const [view, setView] = useState('world');
    const tabData = props.data;


    const INTERACTIVE_AREAS = [
        { code: 'IN', name: 'india' },
        { code: 'AFRICA', name: 'africa' },
        { code: 'OMAN', name: 'oman' },
        { code: 'CZECHIA', name: 'czechia' },
        { code: 'AU', name: 'australia' },
    ] as const;


    const HIGHLIGHT_DATA = {
        IN: {
            states: ['Jharkhand', 'Chhattisgarh', 'Odisha'],
        },
        AFRICA: {
            states: ['BW', 'MZ', 'ZA'],
        },
        OMAN: { states: ['OMAN'] },
        CZECHIA: { states: ['CZECHIA'] },
        AU: { states: ['AU'] },
    };
    const finalTabData = tabData.filter((items: any) => items.props !== undefined && items.props.label != 'world').map((tabItem: any) => tabItem.props);

    const handleMapAreaClick = (areaCode: string) => {
        const directMatch = INTERACTIVE_AREAS.find(area => area.code === areaCode);
        let selectedArea: any;
        if (areaCode === "IN") {
            selectedArea = "india";
        } else if (areaCode === "OMAN") {
            selectedArea = "oman";
        } else if (["BW", "MZ", "ZA"].includes(areaCode)) {
            selectedArea = "africa";
        } else if (areaCode === "AU") {
            selectedArea = "australia";
        } else {
            selectedArea = "czechia";
        }
        const filterTabsData = tabData.filter((items: any) => items.props !== undefined && items.props?.map == selectedArea);
        setOpenTab(filterTabsData[0].key)
        if (directMatch) {
            setView(directMatch.name);
            return;
        }

        const parentArea = INTERACTIVE_AREAS.find(area =>
            (HIGHLIGHT_DATA[area.code as keyof typeof HIGHLIGHT_DATA]?.states || []).includes(areaCode)
        );

        if (parentArea) {
            setView('africa');
        } else {
            setView('world');
        }
    };

    const clickHandler = (key: any, map: any) => {
        setView(map);
        setOpenTab(key);
    };

    useEffect(() => {
        const filterData = tabData.filter((items: any) => items.props !== undefined);
        if (filterData.length > 0) {
            setOpenTab(filterData[0].key);
        }
    }, []);

    const renderMapView = () => {
        const allInteractiveCountries = INTERACTIVE_AREAS.filter(area => area.code !== 'AFRICA').map(area => area.code);
        const affricanCountries = HIGHLIGHT_DATA.AFRICA.states.map(country => country)
        const finalInteractiveCountries = [...allInteractiveCountries, ...affricanCountries]

        switch (view) {
            case 'world':
                return <WorldMap key="world-map" onAreaClick={handleMapAreaClick} highlightedCountries={finalInteractiveCountries} finalTabData={finalTabData} />;
            case 'india':
                return <IndiaMap key="india-map" highlightedStates={HIGHLIGHT_DATA.IN.states} />;
            case 'africa':
                return <AfricaMap key="africa-map" />;
            case 'oman':
                return <OmanMap key="oman-map" />;
            case 'czechia':
                return <CzechiaMap key="czechia-map" />;
            case 'australia':
                return <AustraliaMap key="australia-map" />;
            default:
                return null;
        }
    };

    return (
        <>
            <h3 className="c-heading-65 clr-green lh-75 float-elem" onClick={() => {
                setView('world');
                const getWorldInfo = tabData.filter((item: any) => item.props !== undefined && item.props.label == 'world');
                setOpenTab(getWorldInfo[0].key);
            }}>{props.label}</h3>

            <div className='c-mapView'>
                <div className='c-mapView__sidebar'>
                    <ul className="c-mapView__tabs">
                        {tabData.length > 0 &&
                            tabData
                                .filter((items: any) => items.props !== undefined && items.props.label != 'world')
                                .map((tabItem: any) => {
                                    return (
                                        <li key={tabItem.props.label} className={`c-heading-45 ${tabItem.props.map == view ? 'is-active' : ''}`} onClick={() => clickHandler(tabItem.key, tabItem.props.map)}>
                                            {tabItem.props.label}
                                        </li>
                                    );
                                })}
                    </ul>
                    {view !== 'world' && (
                        <div>
                            <button onClick={() => {
                                setView('world');
                                const getWorldInfo = tabData.filter((item: any) => item.props !== undefined && item.props.label == 'world');
                                setOpenTab(getWorldInfo[0].key);
                            }} className="back-button">
                                <span className='content'>
                                    <span className='icon-move-left'></span> Back to Global Footprint
                                </span>
                            </button>
                            <h2>{INTERACTIVE_AREAS.find(a => a.code === view)?.name}</h2>
                        </div>
                    )}
                </div>
                <div className="c-mapView__container">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="map-animation-container"
                        >
                            {renderMapView()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
            <div className="tabbing_wrap_content">
                {tabData.length > 0 &&
                    tabData
                        .filter((items: any) => items.props !== undefined)
                        .map((tabItem: any) => {
                            return (
                                <div key={tabItem.key} className={`tabbing_wrap_content_item ${openTab == tabItem.key ? "active" : "hidden"}`}>
                                    {tabItem.props.children}
                                </div>
                            );
                        })}
            </div>
        </>
    )
}

export default CustomMap;
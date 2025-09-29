"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from 'framer-motion';

// Map component imports
import IndiaMap from '@/components/maps/IndiaMap';
import JharkhandMap from "@/components/maps/states/JharkhandMap";
import ChhattisgarhMap from "@/components/maps/states/ChhattisgarhMap";
import OdishaMap from "@/components/maps/states/OdishaMap";

const CustomMapIndia = (props: any) => {
    const [view, setView] = useState('india');
    const { data: tabData } = props;

    const interactiveStates = useMemo(() => {
        if (!tabData) return [];
        return tabData?.filter((item: any) => item.props?.label)?.map((item: any) => ({
            code: item.props.code,
            name: item.props.name,
            label: item.props.label
        }));
    }, [tabData]);

    const highlightedStates = useMemo(() => interactiveStates.map((state: any) => state.code), [interactiveStates]);

    const renderMapView = () => {
        switch (view) {
            case 'Jharkhand':
                return <JharkhandMap key="jharkhand-map" />;
            case 'Chhattisgarh':
                return <ChhattisgarhMap key="chhattisgarh-map" />;
            case 'Odisha':
                return <OdishaMap key="odisha-map" />;
            case 'india':
            default:
                return (
                    <IndiaMap
                        key="india-map"
                        onAreaClick={handleStateClick}
                        highlightedStates={highlightedStates}
                    />
                );
        }
    };

    const handleStateClick = (stateName: string) => {
        const selectedState = interactiveStates.find((s: any) => s.code === stateName);
        if (selectedState) {
            setView(selectedState.name);
        }
    };

    const clickHandler = (map: any) => {
        setView(map);
    };

    const resetToIndiaView = () => {
        setView('india');
    };

    return (
        <>
            <div className='c-mapView v2'>
                <div className='c-mapView__sidebar'>
                    <ul className="c-mapView__tabs">
                        {interactiveStates.length > 0 &&
                            interactiveStates.map((tabItem: any) => {
                                return (
                                    <li key={tabItem.label} className={`c-heading-45 ${tabItem.name == view ? 'is-active' : ''}`} onClick={() => clickHandler(tabItem.name)}>
                                        {tabItem.label}
                                    </li>
                                );
                            })}
                    </ul>
                    <div className="mt-lg-5 mt-4 ms-2">
                        <svg width="44" height="27" viewBox="0 0 44 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_92_1801)">
                                <path d="M39.67 14.8799H1.75C0.78 14.8799 0 14.0999 0 13.1299C0 12.1599 0.78 11.3799 1.75 11.3799H39.67C40.64 11.3799 41.42 12.1599 41.42 13.1299C41.42 14.0999 40.64 14.8799 39.67 14.8799Z" fill="#446183" />
                                <path d="M30.1299 26.26C29.6799 26.26 29.2299 26.09 28.8899 25.75C28.2099 25.07 28.2099 23.96 28.8899 23.28L39.0299 13.14L28.8899 2.99001C28.2099 2.31001 28.2099 1.20001 28.8899 0.52001C29.5699 -0.15999 30.6799 -0.15999 31.3599 0.52001L43.9799 13.14L31.3599 25.76C31.0199 26.1 30.5699 26.27 30.1199 26.27L30.1299 26.26Z" fill="#446183" />
                            </g>
                            <defs>
                                <clipPath id="clip0_92_1801">
                                    <rect width="43.98" height="26.26" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>

                    </div>
                    {view !== 'india' && (
                        <>
                            <button onClick={() => resetToIndiaView()} className="back-button">
                                <span className='content'>
                                    <span className='icon-move-left'></span> Back to India Footprint
                                </span>
                            </button>
                        </>
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
        </>
    );
};

export default CustomMapIndia;
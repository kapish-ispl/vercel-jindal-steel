"use client";
import { useState, useEffect, useMemo } from "react";
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
            <div className='c-mapView'>
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
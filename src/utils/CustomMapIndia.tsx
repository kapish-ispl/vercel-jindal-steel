"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from 'framer-motion';

// Map component imports
import IndiaMap from '@/components/maps/IndiaMap';
import JharkhandMap from "@/components/maps/states/JharkhandMap";
import ChhattisgarhMap from "@/components/maps/states/ChhattisgarhMap";
import OdishaMap from "@/components/maps/states/OdishaMap";

const CustomMapIndia = (props: any) => {
    // console.log()
    const [view, setView] = useState('india');
    const [openTab, setOpenTab] = useState(0);
    const { data: tabData, label } = props;

    const interactiveStates = useMemo(() => {
        if (!tabData) return [];
        return tabData
            // ?.filter((item: any) => item.props?.label && item.props.map !== 'india')
            ?.filter((item: any) => item.props?.label)
            ?.map((item: any) => ({
                code: item.props.label,
                name: item.props.label,
                label: item.props.label
            }));
    }, [tabData]);

    const highlightedStates = useMemo(() => interactiveStates.map((state: any) => state.code), [interactiveStates]);

    const handleStateClick = (stateName: string) => {
        console.log(stateName, 'staeanem')
        const selectedState = interactiveStates.find((s: any) => s.code === stateName);
        console.log(selectedState, 'selectedState')
        if (selectedState) {
            setView(selectedState.name);
        }
    };

    useEffect(() => {
        const filterData = tabData.filter((items: any) => items.props !== undefined);
        if (filterData.length > 0) {
            setOpenTab(filterData[0].key);
        }
    }, [tabData]);

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

    // Resets the view to the main India map.
    const resetToIndiaView = () => {
        setView('india');
        const getIndiaInfo = tabData.filter((item: any) => item.props?.map === 'india');
        if (getIndiaInfo.length > 0) {
            setOpenTab(getIndiaInfo[0].key);
        }
    };

    return (
        <>
            <h3 className="c-heading-65 clr-green lh-75 float-elem" onClick={resetToIndiaView}>
                {label}
            </h3>

            <div className='c-mapView'>
                {/* The entire sidebar div has been removed */}
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

            {/* <div className="tabbing_wrap_content">
                {tabData?.length > 0 &&
                    tabData
                        .filter((items: any) => items.props !== undefined)
                        .map((tabItem: any) => (
                            <div key={tabItem.key} className={`tabbing_wrap_content_item ${openTab == tabItem.key ? "active" : "hidden"}`}>
                                {tabItem.props.children}
                            </div>
                        ))}
            </div> */}
        </>
    );
};

export default CustomMapIndia;
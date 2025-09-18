'use client';
import { useState, useRef, useEffect, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorldMap from './maps/WorldMap';
import IndiaMap from './maps/IndiaMap';
import AfricaMap from './maps/AfricaMap';

const INTERACTIVE_AREAS = [
    { code: 'IN', name: 'India' },
    { code: 'AFRICA', name: 'Africa' },
] as const;

type AreaCode = typeof INTERACTIVE_AREAS[number]['code'];
type ViewState = 'world' | AreaCode;

const HIGHLIGHT_DATA = {
    IN: {
        states: ['Jharkhand', 'Chhattisgarh', 'Odisha'],
    },
    AFRICA: {
        states: ['BW', 'MZ', 'ZA'],
    },
};

const InteractiveMap: FC = () => {
    const [view, setView] = useState<ViewState>('world');
    const [selectedArea, setSelectedArea] = useState<AreaCode | null>('IN');
    const mapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;
        const container = mapRef.current;

        // Clear previous highlights
        container.querySelectorAll('.highlighted, .highlighted-state').forEach(el => {
            el.classList.remove('highlighted');
            el.classList.remove('highlighted-state');
        });

        if (view === 'world' && selectedArea) {
            if (selectedArea === 'AFRICA') {
                HIGHLIGHT_DATA.AFRICA.states?.forEach(countryCode => {
                    const areaEl = container.querySelector<SVGElement>(`#${countryCode}`);
                    if (areaEl) areaEl.classList.add('highlighted');
                });
            } else {
                const areaEl = container.querySelector<SVGElement>(`#${selectedArea}`);
                if (areaEl) areaEl.classList.add('highlighted');
            }
        } else if (view !== 'world') {
            const data = HIGHLIGHT_DATA[view];
            data?.states?.forEach(stateCode => {
                const stateEl = container.querySelector<SVGElement>(`#${stateCode}`);
                if (stateEl) stateEl.classList.add('highlighted-state');
            });
        }
    }, [selectedArea, view]);

    const handleTabClick = (areaCode: AreaCode) => {
        setSelectedArea(areaCode);
        setView('world');
    };

    // The updated click handler with the requested logic
    const handleMapAreaClick = (areaCode: string) => {
        const isHighlightedAfricaCountry = HIGHLIGHT_DATA.AFRICA.states?.includes(areaCode);

        // If an Africa country is clicked, go directly to the expanded view
        // if (isHighlightedAfricaCountry) {
        //     setSelectedArea('AFRICA');
        //     setView('AFRICA');
        // }
        if (isHighlightedAfricaCountry) {
            if (selectedArea === 'AFRICA') {
                setView('AFRICA');
            } else {
                setSelectedArea('AFRICA');
            }
        }
        // If India is clicked, expand immediately
        else if (areaCode === 'IN') {
            if (selectedArea === 'IN') {
                setView('IN');
            } else {
                setSelectedArea('IN');
            }
        }
        // For any other click, simply select the area but stay on world
        else {
            setSelectedArea(areaCode as AreaCode);
            setView('world');
        }
    };


    const handleBackButtonClick = () => {
        setView('world');
        setSelectedArea(selectedArea);
    };

    const renderMapView = () => {
        const africaHighlights = HIGHLIGHT_DATA.AFRICA?.states || [];
        const indiaHighlights = HIGHLIGHT_DATA.IN?.states || [];

        switch (view) {
            case 'world':
                return (
                    <WorldMap
                        key="world-map"
                        onAreaClick={handleMapAreaClick}
                        selectedArea={selectedArea}
                        highlightedCountries={africaHighlights}
                    />
                );
            case 'IN':
                return <IndiaMap key="india-map" highlightedStates={indiaHighlights} />;
            case 'AFRICA':
                return <AfricaMap key="africa-map" highlightedCountries={africaHighlights} />;
            default:
                return null;
        }
    };

    return (
        <div className='c-mapView'>
            <div className='c-mapView__sidebar'>
                <ul className="c-mapView__tabs">
                    {INTERACTIVE_AREAS.map((area) => (
                        <li
                            key={area.code}
                            onClick={() => handleTabClick(area.code)}
                            className={`c-heading-45 ${selectedArea === area.code ? 'is-active' : ''}`}
                        >
                            {area.name}
                        </li>
                    ))}
                </ul>
                {view !== 'world' && (
                    <div>
                        <button onClick={handleBackButtonClick} className="back-button"><span className='content'>
                            <span className='icon-move-left'></span> Back to World Map</span>
                        </button>
                        <h2>{INTERACTIVE_AREAS.find(a => a.code === view)?.name}</h2>
                    </div>
                )}
            </div>
            <div className='c-mapView__container' ref={mapRef}>
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
    );
};

export default InteractiveMap;
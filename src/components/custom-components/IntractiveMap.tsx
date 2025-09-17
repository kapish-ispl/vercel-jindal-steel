'use client';

import { useState, useRef, useEffect, FC } from 'react';
import WorldMap from './maps/WorldMap';
import IndiaMap from './maps/IndiaMap';
import AfricaMap from './maps/AfricaMap';

const INTERACTIVE_AREAS = [
    { code: 'IN', name: 'India' },
    { code: 'AFRICA', name: 'Africa' },
] as const;

type AreaCode = typeof INTERACTIVE_AREAS[number]['code'];
type ViewState = 'world' | AreaCode;

type HighlightData = {
    [key in AreaCode]?: {
        states?: string[];
    };
};

const HIGHLIGHT_DATA: HighlightData = {
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

        container.querySelectorAll('.highlighted, .highlighted-state').forEach(el => {
            el.classList.remove('highlighted');
            el.classList.remove('highlighted-state');
        });

        if (view === 'world' && selectedArea) {
            if (selectedArea === 'AFRICA') {
                const data = HIGHLIGHT_DATA['AFRICA'];
                data?.states?.forEach(stateCode => {
                    const stateEl = container.querySelector<SVGElement>(`#${stateCode}`);
                    if (stateEl) stateEl.classList.add('highlighted');
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
    }, [selectedArea, view, mapRef]);


    const handleTabClick = (areaCode: AreaCode) => {
        setSelectedArea(areaCode);
        setView('world');
    };

    const handleMapAreaClick = (areaCode: string) => {
        if (selectedArea === 'AFRICA' && HIGHLIGHT_DATA['AFRICA']?.states?.includes(areaCode)) {
            setView('AFRICA');
        } else if (areaCode && areaCode === selectedArea) {
            setView(areaCode as AreaCode);
        }
    };

    const renderMapView = () => {
        switch (view) {
            case 'world': return <WorldMap onAreaClick={handleMapAreaClick} />;
            case 'IN': return <IndiaMap />;
            case 'AFRICA': return <AfricaMap />;
            default: return <p>Map not available.</p>;
        }
    };

    return (
        <div className='c-mapView' style={{ display: 'flex' }}>
            <div className='c-mapView__sidebar'>
                {view !== 'world' ? (
                    <div>
                        <button
                            onClick={() => { setView('world'); }}
                            style={{ marginBottom: '1rem', cursor: 'pointer', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}
                        >
                            &larr; Back to World Map
                        </button>
                        <h2>{INTERACTIVE_AREAS.find(a => a.code === view)?.name}</h2>

                    </div>
                ) : (
                    <div>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {INTERACTIVE_AREAS.map((area) => (
                                <li className='c-heading-45'
                                    key={area.code}
                                    onClick={() => handleTabClick(area.code)}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '12px',
                                        margin: '4px 0',
                                        borderRadius: '4px',
                                        paddingBottom: '20px',
                                        color: selectedArea === area.code ? '#F47920' : '#636466',
                                    }}
                                >
                                    {area.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className='c-mapView__container' ref={mapRef}>
                <div>
                    {renderMapView()}
                </div>
            </div>
        </div>
    );
}

export default InteractiveMap;


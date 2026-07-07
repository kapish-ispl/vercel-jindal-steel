import React from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const AccessibilityDrawer: React.FC<Props> = ({ isOpen, onClose, children }) => {
    return (
        <>
            <div className={`accessibility-drawer ${isOpen ? 'open' : ''}`} data-lenis-ignore>
                <div className='accessibilityHead'>
                    <div className="panel-title mb-0 ">Accessibility Settings</div>
                    <button className="closeBtn" onClick={onClose}>✕</button>
                </div>
                {children}
            </div>
        </>
    );
};

export default AccessibilityDrawer;

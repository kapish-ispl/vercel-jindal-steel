import React, { FC, ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="custom_modal_overlay" onClick={onClose}>
            <div className="custom_modal_container" onClick={(e) => e.stopPropagation()} data-lenis-ignore>
                <div className="custom_modal_header">
                    <h2 className="custom_modal_title">{title}</h2>
                    <button onClick={onClose} className="custom_modal_close_btn">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="custom_modal_content">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;

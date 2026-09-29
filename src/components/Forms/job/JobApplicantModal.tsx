import React from "react";
import Modal from "@/components/Modal";

export interface JobApplicantModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
}

export const JobApplicantModal: React.FC<JobApplicantModalProps> = ({
    isOpen,
    title,
    message,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="p-3 text-center">
                <p className="c-content-16 mb-4">{message}</p>
                <div className="d-flex justify-content-center gap-3">
                    <button
                        type="button"
                        className="cus_btn2 no_zIndex orange"
                        onClick={onClose}
                    >
                        <span>OK</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
};

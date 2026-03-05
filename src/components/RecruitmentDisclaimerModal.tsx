import React, { FC } from "react";
import Modal from "./Modal";

interface RecruitmentDisclaimerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RecruitmentDisclaimerModal: FC<RecruitmentDisclaimerModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Recruitment Disclaimer"
        >
            <div className="c-modal-v2__body-content">
                <h4>Public Notice – Fake Job Offers</h4>
                <p>
                    We, Jindal Steel and its group companies, have observed fraudulent individuals issuing fake job offers in our name and asking applicants to pay processing fees or deposit money via email or phone calls.
                </p>
                <p>
                    We strongly advise the public <strong>not to respond or make any payment</strong> to such communications. While legal action is underway against these entities, Jindal Steel and its group companies will not be responsible for any loss arising from such fraudulent dealings.
                </p>
                <p>
                    Please note, our recruitment process is <strong>professional, merit-based and completely free. We do not charge any fee</strong> at any stage of hiring.
                </p>
                <p>
                    If you receive any interview call or job offer claiming to be from us, <strong>verify it only through our official website (<a href="https://www.jindalsteel.com" target="_blank" rel="noopener noreferrer" className="modal_disclaimer_link">www.jindalsteel.com</a>)</strong> or directly with our HR department.
                </p>
                <div className="c-modal-v2__footer">
                    <button className="btn-primary-green" onClick={onClose} type="button">Okay</button>
                </div>
            </div>
        </Modal>
    );
};

export default RecruitmentDisclaimerModal;

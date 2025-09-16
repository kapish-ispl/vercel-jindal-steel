import React from 'react';

const Footer = () => {
    return (
        <>
            <footer>
                <div className="c-footer commonSection bg-gray">
                    <div className="container cus-container">
                        <div className="row">
                            <div className="col-lg-4 col-md-12 col-sm-12">
                                <div className="c-footer__info pad_right70 corporate-address">
                                    <div className="c-footer__info-logo">
                                        <a href="#" className="footer-link" target="_blank">
                                            <img
                                                src='/logo/jindal-steel-logo-black.svg'
                                                alt="jindal steel logo"
                                                width={170}
                                                height={76}
                                                className="img-fluid u-img" />
                                        </a>
                                    </div>
                                    <div className="c-footer__info-content">
                                        <div className="head c-content-19">Corporate Office</div>
                                        <div className="desc c-content-19 mt-3">Jindal Centre 12, Bhikaiji Cama Place, New Delhi - 110 066, INDIA <span className='d-md-block d-lg-inline'>(Formerly Jindal Steel & Power Limited)</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-12">
                                <div className="c-footer__info">
                                    <div className="c-footer__info-content">
                                        <div className="head">Our Story</div>
                                        <ul className="footerMenu">
                                            <li className="footerMenu__item"><a href="#" className="footerMenu__item-link" target="_blank">Overview</a></li>
                                            <li className="footerMenu__item"><a href="#" className="footerMenu__item-link" target="_blank">Our Leadership</a></li>
                                            <li className="footerMenu__item"><a href="#" className="footerMenu__item-link" target="_blank">Awards & Recognition</a></li>
                                        </ul>
                                    </div>
                                    <div className="c-footer__info-content">
                                        <div className="head">Mine to Metal</div>
                                        <ul className="footerMenu">
                                            <li className="footerMenu__item"><a href="#" className="footerMenu__item-link" target="_blank">Overview</a></li>
                                            <li className="footerMenu__item"><a href="#" className="footerMenu__item-link" target="_blank">Mining</a></li>
                                            <li className="footerMenu__item"><a href="#" className="footerMenu__item-link" target="_blank">Captive Power</a></li>
                                            <li className="footerMenu__item"><a href="#" className="footerMenu__item-link" target="_blank">Steel</a></li>
                                            <li className="footerMenu__item"><a href="#" className="footerMenu__item-link" target="_blank">Offerings</a></li>
                                            <li className="footerMenu__item"><a href="#" className="footerMenu__item-link" target="_blank">Global Footprint</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-12">
                                <div className="c-footer__info pad_left40">
                                    <div className="c-footer__info-content">
                                        <div className="head">Sustainability</div>
                                        <ul className="footerMenu">
                                            <li className="footerMenu__item"><a href="#" className="footerMenu__item-link" target="_blank">Overview</a></li>
                                            <li className="footerMenu__item"><a href="#" className="footerMenu__item-link" target="_blank">ESG 360 </a></li>
                                            <li className="footerMenu__item"><a href="#" className="footerMenu__item-link" target="_blank">Community </a></li>
                                            <li className="footerMenu__item"><a href="#" className="footerMenu__item-link" target="_blank">Reports</a></li>
                                            <li className="footerMenu__item"><a href="#" className="footerMenu__item-link" target="_blank">Media</a></li>
                                        </ul>
                                    </div>
                                    <div className="c-footer__info-content">
                                        <div className="head">Contact us</div>
                                        <p className="c-content-19">+91 11 26188340-50, <br/>1800 208 2008</p>
                                        <p className="c-content-19"><a href="mailto:info@jindalsteel.com" className="u-link">info[at]jindalsteel[dot]com</a></p>

                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-12">
                                <div className="c-footer__info pad_left40">
                                    <div className="c-footer__info-content">
                                        <div className="head">Other Links</div>
                                        <ul className="footerMenu">
                                            <li className="footerMenu__item"><a href="#" className="footerMenu__item-link" target="_blank">People</a></li>
                                            <li className="footerMenu__item"><a href="#" className="footerMenu__item-link" target="_blank">Jobs</a></li>
                                            <li className="footerMenu__item"><a href="#" className="footerMenu__item-link" target="_blank">Disclaimer</a></li>
                                            <li className="footerMenu__item"><a href="#" className="footerMenu__item-link" target="_blank">MSME</a></li>
                                        </ul>
                                    </div>
                                    <div className="c-footer__info-content">
                                        <div className="head">Connect with us</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer

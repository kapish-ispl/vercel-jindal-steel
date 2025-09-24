"use client";

import React, { useContext } from 'react';
import FooterList from './FooterList';
import { AppContext } from '@/context/AppContext';

const Footer = () => {
    const contextInfo = useContext(AppContext);
    const FOOTER_MAIN_MENU = contextInfo.footerMenu;
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
                                                src='/images/logo/jindal-steel-logo-black.svg'
                                                alt="jindal steel logo"
                                                width={200}
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
                                    {FOOTER_MAIN_MENU?.length > 0 && <FooterList data={FOOTER_MAIN_MENU.slice(0, 2)} />}
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-12">
                                <div className="c-footer__info pad_left40">
                                    {FOOTER_MAIN_MENU?.length > 0 && <FooterList data={FOOTER_MAIN_MENU.slice(2, 3)} />}
                                    <div className="c-footer__info-content">
                                        <div className="head">Contact us</div>
                                        <p className="c-content-19">+91 11 26188340-50, <br />1800 208 2008</p>
                                        <p className="c-content-19"><a href="mailto:info@jindalsteel.com" className="u-link">info[at]jindalsteel[dot]com</a></p>

                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-12">
                                <div className="c-footer__info pad_left40">
                                    {FOOTER_MAIN_MENU?.length > 0 && <FooterList data={FOOTER_MAIN_MENU.slice(3, 4)} />}
                                    <div className="c-footer__info-content">
                                        <div className="head">Connect with us</div>
                                        <div className="socialMenu">
                                            <ul className="social__wrapper">
                                                <li className="social__wrapper--item"><a href='#' className='social__wrapper--item-link'>
                                                    <img
                                                        src='/images/icons/linkdin-icon.svg'
                                                        alt="jindal steel logo"
                                                        width={41}
                                                        height={41}
                                                        className="img-fluid u-img" />
                                                </a></li>
                                                <li className="social__wrapper--item"><a href='#' className='social__wrapper--item-link'>
                                                    <img
                                                        src='/images/icons/fb-icon.svg'
                                                        alt="jindal steel logo"
                                                        width={41}
                                                        height={41}
                                                        className="img-fluid u-img" />
                                                </a></li>
                                                <li className="social__wrapper--item"><a href='#' className='social__wrapper--item-link'>
                                                    <img
                                                        src='/images/icons/twitter-icon.svg'
                                                        alt="jindal steel logo"
                                                        width={41}
                                                        height={41}
                                                        className="img-fluid u-img" />
                                                </a></li>
                                                <li className="social__wrapper--item"><a href='#' className='social__wrapper--item-link'>
                                                    <img
                                                        src='/images/icons/youtube.svg'
                                                        alt="jindal steel logo"
                                                        width={41}
                                                        height={41}
                                                        className="img-fluid u-img" />
                                                </a></li>
                                                <li className="social__wrapper--item">
                                                    <a href='#' className='social__wrapper--item-link'>
                                                        <img
                                                            src='/images/icons/insta-icon.svg'
                                                            alt="jindal steel logo"
                                                            width={41}
                                                            height={41}
                                                            className="img-fluid u-img" />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
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

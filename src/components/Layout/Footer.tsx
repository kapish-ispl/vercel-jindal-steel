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
                                        <div className="head c-content-16">Corporate Office</div>
                                        <div className="desc c-content-16 mt-3">Jindal Centre 12, Bhikaiji Cama Place, New Delhi - 110 066, INDIA <span className='d-md-block d-lg-inline'>(Formerly Jindal Steel & Power Limited)</span></div>
                                    </div>
                                     <div className="c-footer__info-content  mt-2">
                                        
                                        <div className="socialMenu">
                                            <ul className="social__wrapper">
                                                <li className="social__wrapper--item active"><a href='https://www.linkedin.com/company/jindalsteel-ltd./' className='social__wrapper--item-link'>
                                                    <img
                                                        src='/images/icons/linkdin-icon.svg'
                                                        alt="jindal steel logo"
                                                        width={41}
                                                        height={41}
                                                        className="img-fluid u-img" />
                                                </a>

                                                </li>
                                                <li className="social__wrapper--item"><a href='https://www.facebook.com/share/16qokH8ACe/?mibextid=wwXIfr' className='social__wrapper--item-link'>
                                                    <img
                                                        src='/images/icons/fb-icon.svg'
                                                        alt="jindal steel logo"
                                                        width={41}
                                                        height={41}
                                                        className="img-fluid u-img" />
                                                </a></li>
                                                <li className="social__wrapper--item"><a href='https://x.com/JindalSteel_In' className='social__wrapper--item-link'>
                                                    <img
                                                        src='/images/icons/twitter-icon.svg'
                                                        alt="jindal steel logo"
                                                        width={41}
                                                        height={41}
                                                        className="img-fluid u-img" />
                                                </a></li>
                                                <li className="social__wrapper--item"><a href='https://www.youtube.com/@JindalSteel_In' className='social__wrapper--item-link'>
                                                    <img
                                                        src='/images/icons/youtube.svg'
                                                        alt="jindal steel logo"
                                                        width={41}
                                                        height={41}
                                                        className="img-fluid u-img" />
                                                </a></li>
                                                <li className="social__wrapper--item">
                                                    <a href='https://www.instagram.com/jindalsteel_in' className='social__wrapper--item-link'>
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
                            <div className="col-lg-2 col-md-4 col-sm-12">
                                <div className="c-footer__info">
                                    {FOOTER_MAIN_MENU?.length > 0 && <FooterList data={FOOTER_MAIN_MENU.slice(0, 2)} />}
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-12">
                                <div className="c-footer__info pad_left40">
                                    {FOOTER_MAIN_MENU?.length > 0 && <FooterList data={FOOTER_MAIN_MENU.slice(2, 4)} />}
                                   
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-12">
                                <div className="c-footer__info pad_left40">
                                    {FOOTER_MAIN_MENU?.length > 0 && <FooterList data={FOOTER_MAIN_MENU.slice(4, 5)} />}
                                    <div><span className="c-content-16 mt-1 ft_light">Have questions or need assistance? Our team is here to help.</span></div>
                                    <div className="c-footer__info-content  mt-2">
                                        <div className="head"><a href="/contact-us-v2" className="u-link">Contact us</a></div>
                                        

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="c-footer__bottom"><p>Copyright ©2026&nbsp;Jindal Steel. All rights reserved.</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer
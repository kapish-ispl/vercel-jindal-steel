'use client'
import React, { useState } from 'react'
import { createPortal } from 'react-dom';
import parse from "html-react-parser";
import Pagination from '@/components/Pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const LeadershipCardV2 = ({ postData, totalPost, itemsPerPage, title }: any) => {
    console.log(totalPost, itemsPerPage)
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const pageCount = Math.ceil(totalPost / itemsPerPage);
    const currentPage = Number(searchParams.get("page") || 1);
    const [contentToggler, setContentToggler] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [modalData, setModalData] = useState<any>(null);


    const handlePageClick = ({ selected }: { selected: any }) => {

        const newParams = new URLSearchParams(searchParams?.toString() || '');
        newParams.set('page', `${selected + 1}`);
        const newUrl = `${pathname}?${newParams.toString()}`;
        router.push(newUrl, { scroll: false });
    };

    const hanndleModal = (item: any) => {
        document.body.classList.add("modal-open");
        setModalData(item);
        setContentToggler(true);
    };

    const hanndleModalClose = () => {
        document.body.classList.remove("modal-open");
        setContentToggler(false);
        setModalData(null);
    };
    return (
        <>
            <div className="row">
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="c-heading-60 clr-gray ft_extraLight lh_1-2 mb-50">{title}</div>
                </div>
                {
                    postData.length > 0 && postData.slice(0, 3).map((item: any, index: number) => {
                        const finalImg = item?.media[0]?.cdnPath || 'https://d2lptvt2jijg6f.cloudfront.net/document/129/1763462000_1761992337_tumbnail.png'
                        return (
                            <React.Fragment key={index}>
                                <div className="col-12 col-md-6 col-lg-3" onClick={() => hanndleModal(item)}>
                                    <div className="c-card cursor-pointer holographic-card">
                                        <div className="c-card__media ratio ratio-1x1"><img alt="card media" className="img-fluid u-img"
                                            src={finalImg} />
                                        </div>

                                        <div className="c-card__content">
                                            <div className="c-card__content-wrapper">
                                                <div className="c-content-20 ft_semiBold title lh_1-3">{item.title}</div>
                                                <div className="label c-content-14 ft_regular">{item.metaInfo.designation}</div>
                                                {item.metaInfo.company != "" &&
                                                    <div className="label c-content-14 ft_light clr-primary">{item.metaInfo.company}</div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        )
                    })
                }
            </div>
            <div className='row'>
                {
                    postData.length > 3 && postData.slice(3).map((item: any, index: number) => {
                        const finalImg = item?.media[0]?.cdnPath || 'https://d2lptvt2jijg6f.cloudfront.net/document/129/1763462000_1761992337_tumbnail.png'
                        return (
                            <React.Fragment key={index}>
                                <div className="col-12 col-md-6 col-lg-3" onClick={() => hanndleModal(item)}>
                                    <div className="c-card cursor-pointer holographic-card ">
                                        <div className="c-card__media ratio ratio-1x1"><img alt="card media" className="img-fluid u-img"
                                            src={finalImg} />
                                        </div>

                                        <div className="c-card__content">
                                            <div className="c-card__content-wrapper">
                                                <div className="c-content-20 ft_semiBold title lh_1-3">{item.title}</div>
                                                <div className="label c-content-14 ft_regular">{item.metaInfo.designation}</div>
                                                {item.metaInfo.company != "" &&
                                                    <div className="label c-content-14 ft_light clr-primary">{item.metaInfo.company}</div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        )
                    })
                }
            </div>

            {/* {totalPost > itemsPerPage &&
                <Pagination pageCount={pageCount} handlePageClick={handlePageClick} currentPage={currentPage} />
            } */}


            {modalData != null &&
                <div className={`c-modal ${contentToggler ? 'active' : ''}`} data-lenis-ignore>
                    <div className="generic_spacer_container genric_bottom_spacer">
                        <div className="container cus-conatiner">
                            <div className="row">
                                <div className="col-12 col-md-4">
                                    <div className="c-card h-auto">
                                        <div className="c-card__media ratio ratio-1x1"><img alt="card media" className="img-fluid u-img" src={modalData?.media[0]?.cdnPath || 'https://d2lptvt2jijg6f.cloudfront.net/document/129/1763462000_1761992337_tumbnail.png'} /></div>

                                        <div className="c-card__content">
                                            <div className="c-card__content-wrapper">
                                                <div className="c-content-20 ft_semiBold title lh_1-3">{modalData.title}</div>
                                                <div className="label c-content-14 ft_regular">{modalData.metaInfo.designation}</div>
                                                {modalData.metaInfo.company != "" &&
                                                    <div className="label c-content-14 ft_light clr-primary">{modalData.metaInfo.company}</div>
                                                }
                                            </div>

                                        </div>
                                    </div>


                                </div>
                                <div className="col-12 col-md-7 offset-lg-1">
                                    <div className="genric__content mb-50">
                                        <div className="c-content-32 ft_semiBold clr-gray mb-1">{modalData.title}</div>
                                        <div className="c-content-32 ft_semiBold clr-blue">{modalData.metaInfo.designation}</div>

                                    </div>
                                    <div>{parse(modalData.content)}</div>

                                </div>

                            </div>
                        </div>

                    </div>
                    <span className="modle-cls-btn" onClick={() => hanndleModalClose()}>
                        <div className="close-btn">
                            <svg width="30" height="30" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.8651 0.585741C17.6462 -0.195217 18.9122 -0.195277 19.6932 0.585741C20.4742 1.36677 20.4742 2.63284 19.6932 3.41386L12.9676 10.1394L19.6932 16.865C20.4741 17.6461 20.4742 18.9121 19.6932 19.6931C18.9122 20.4741 17.6462 20.474 16.8651 19.6931L10.1395 12.9676L3.41385 19.6931C2.63281 20.4739 1.36669 20.474 0.585706 19.6931C-0.195272 18.9122 -0.19512 17.6461 0.585706 16.865L7.31133 10.1394L0.585706 3.41386C-0.195179 2.6328 -0.195291 1.36673 0.585706 0.585741C1.3667 -0.195233 2.63279 -0.195132 3.41385 0.585741L10.1395 7.31132L16.8651 0.585741Z" fill="#F5821E" />
                            </svg>

                        </div>
                    </span>
                </div>
            }
        </>
    )
}

export default LeadershipCardV2;

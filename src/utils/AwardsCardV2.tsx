"use client";
import React, { FC, useState } from 'react';
import Image from 'next/image';
import { MONTH_NAMES } from "@/config/config";
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import Pagination from '@/components/Pagination';
import parse from 'html-react-parser'
import { formatDate } from '@/components/formatDate';
import CustomSelect from '@/components/CustomSelect';
interface MediaItem {
    cdnPath: string;
}
interface Post {
    title: string;
    media?: MediaItem[];
}

interface AwardsCardProps {
    postData: Post[];
    totalPost: number;
    itemsPerPage?: any;
}

const AwardsCardV2: FC<AwardsCardProps> = ({ postData, totalPost, itemsPerPage }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const pageCount = Math.ceil(totalPost / itemsPerPage);
    const currentPage = Number(searchParams.get("page") || 1);
    const [contentToggler, setContentToggler] = useState(false);
    const [modalData, setModalData] = useState<any>(null);

    const handlePageClick = ({ selected }: { selected: any }) => {

        const newParams = new URLSearchParams(searchParams?.toString() || '');
        newParams.set('page', `${selected + 1}`);
        const newUrl = `${pathname}?${newParams.toString()}`;
        router.push(newUrl, { scroll: false });
    };

    const handleModal = (post: any) => {
        const formatted = formatDate(post?.postingDate);

        document.body.classList.add("modal-open");

        setModalData({
            ...post,
            formattedDate: formatted
        });

        setContentToggler(true);
    };

    const handleModalClose = () => {
        setContentToggler(false);
        document.body.classList.remove("modal-open");
        setModalData(null);
    }

    const myOptions = [
        { label: "2025", value: "2025" },
        { label: "2024", value: "2024" },
        { label: "2023", value: "2023" },
    ];

    return (
        <>
            <div className="c-filterView justify-content-end mb-4">
                <div className="row gy-2">
                    <div className="col-md-10 col-sm-12">
                        <CustomSelect options={myOptions} placeholder="Select Year" />
                    </div>
                    <div className="col-12 col-md-2"><button type='button' className='u-btn action_btn'>Reset</button></div>
                </div>
            </div>
            <div className='row'>
                {postData && postData.length > 0 && postData.map((post: any, index: number) => {
                    const { monthYear: newDateMonth } = formatDate(post?.postingDate);

                    return (
                        <div className="col-12 col-md-6 col-lg-4" key={index}>
                            <button className="c-cardBox__wrapper v3" onClick={() => handleModal(post)}>
                                <span className="c-cardBox__wrapper-top">
                                    <span className="media ratio ratio-4x3">
                                        {post?.media[0]?.cdnPath &&
                                            <Image
                                                alt="Jindal image"
                                                className="img-fluid u-img"
                                                src={post?.media[0]?.cdnPath}
                                                width={450}
                                                height={350}
                                            />
                                        }

                                    </span>
                                </span>
                                <span className="c-cardBox__wrapper-bottom">
                                    <span className="content">
                                        <span className="label c-content-16 clr-gray ft_regular">{newDateMonth !== "" ? newDateMonth : ""}</span>
                                        <span className="c-content-20 ft_regular">{post.title}</span>
                                    </span>
                                </span>
                            </button>
                        </div>
                    )
                })}
                {totalPost > itemsPerPage &&
                    <Pagination pageCount={pageCount} handlePageClick={handlePageClick} currentPage={currentPage} />
                }
            </div>

            {modalData != null &&
                <div className={`c-modal__wrapper v2 ${contentToggler ? 'show' : ''}`}>
                    <div className="c-modal__overlay" onClick={() => handleModalClose}></div>
                    <div className="container cus-container position-relative">
                        <div className="c-modal__box v2">

                            <div className="row h-100">
                                <div className="col-12 col-lg-5 p-0">
                                    <div className="c-modal__box-ls">
                                        <div className="media">
                                            <img src={modalData?.media[0]?.cdnPath} className='img-fluid u-img' alt='award media'></img>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-7">
                                    <div className="c-modal__box-rs">
                                        <div className="c-modal__box-header c-withBorder">
                                            <div className="c-content-32 clr-gray ft_medium">{modalData.title}</div>
                                        </div>
                                        <div className="c-modal__box-body">
                                            <div className="genric__content">
                                                {/* <div className="c-content-20 clr-gray lh_1-3 ft_light mb-4">Our commitment to community development, education, livelihood support, and sustainable growth continues to shape real change across the regions we serve.</div> */}
                                                {parse(modalData.content)}
                                            </div>

                                            <div className="c-modal__box_highlights">
                                                {modalData.metaInfo.event_date !== '' || modalData.postingDate !== '' &&
                                                    <div className="c-modal__box_highlights-item">
                                                        <p className='c-content-20 clr-gray'><span className="label ft_semiBold"></span> Event Date: <span className='ft_light value'>{modalData?.metaInfo?.event_date || modalData?.formattedDate?.full}</span> </p>
                                                    </div>
                                                }
                                                {modalData.metaInfo.location !== '' &&
                                                    <div className="c-modal__box_highlights-item">
                                                        <p className='c-content-20 clr-gray'><span className="label ft_semiBold"></span> Location: <span className='ft_light value'>{modalData?.metaInfo?.location}</span> </p>
                                                    </div>
                                                }
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="c-modal__box--close" onClick={() => { setContentToggler(false); document.body.classList.remove("modal-open"); }}>
                        </button>
                    </div>
                </div>
            }
        </>
    );
}

export default AwardsCardV2;
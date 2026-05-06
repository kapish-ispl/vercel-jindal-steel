import CustomSelect from '@/components/CustomSelect';
import { invDocOptions, yearOptions } from '@/constants/GenericFilter';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import React, { useRef } from 'react'
import ReactPaginate from 'react-paginate';

// --- Sub-components ---

const DownloadIcon = () => (
    <span className="icon-move-down icon arrowremove">
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="52" viewBox="0 0 70 52" fill="none">
            <path d="M8.5 43H4C2.34315 43 1 41.6569 1 40V4C1 2.34315 2.34315 1 4 1H56C57.6569 1 59 2.34315 59 4V7.5" stroke="#636466" strokeWidth="2"></path>
            <rect x="11" y="10" width="58" height="41" rx="3" stroke="#636466" strokeWidth="2"></rect>
            <path d="M21.5 21.5H59" stroke="#636466" strokeWidth="2"></path>
            <path d="M21.5 30H59" stroke="#636466" strokeWidth="2"></path>
            <path d="M21.5 38.5H59" stroke="#636466" strokeWidth="2"></path>
        </svg>
    </span>
);


const AudioCard = ({ post }: any) => (
    <div className='c-audio__container mb-4'>
        <div className='hw mb-40'>
            <div className="c-heading-30 clr-blue ft_semiBold">{post.title}</div>
        </div>
        <div className='c-audio__wrap'>
            <audio src={post.media?.[0]?.cdnPath} controls></audio>
        </div>
    </div>
);

const DocumentCard = ({ post, compSlug }: any) => {
    const href = compSlug === 'investor-documents'
        ? post.media?.[0]?.cdnPath
        : post.metaInfo?.external_link || post.media?.[0]?.cdnPath;

    return (
        <Link target='_blank' href={href || "#"} className='performance-link radiusShape-5'>
            <div className="title c-content-19 ft_regular">{post.title}</div>
            <DownloadIcon />
        </Link>
    );
};

const PaginationArrow = ({ type }: { type: 'prev' | 'next' }) => {
    const isNext = type === 'next';
    return (
        <svg width="30" height="27" viewBox="0 0 44 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath={`url(#clip0_94_${isNext ? '89' : '93'})`}>
                <path d={isNext ? "M39.67 14.8799H1.75C0.78 14.8799 0 14.0999 0 13.1299C0 12.1599 0.78 11.3799 1.75 11.3799H39.67C40.64 11.3799 41.42 12.1599 41.42 13.1299C41.42 14.0999 40.64 14.8799 39.67 14.8799Z" : "M4.31047 11.3801L42.2305 11.3801C43.2005 11.3801 43.9805 12.1601 43.9805 13.1301C43.9805 14.1001 43.2005 14.8801 42.2305 14.8801L4.31047 14.8801C3.34047 14.8801 2.56047 14.1001 2.56047 13.1301C2.56047 12.1601 3.34047 11.3801 4.31047 11.3801Z"} fill="#626466" />
                <path d={isNext ? "M30.1299 26.26C29.6799 26.26 29.2299 26.09 28.8899 25.75C28.2099 25.07 28.2099 23.96 28.8899 23.28L39.0299 13.14L28.8899 2.99001C28.2099 2.31001 28.2099 1.20001 28.8899 0.52001C29.5699 -0.15999 30.6799 -0.15999 31.3599 0.52001L43.9799 13.14L31.3599 25.76C31.0199 26.1 30.5699 26.27 30.1199 26.27L30.1299 26.26Z" : "M13.8506 -1.5299e-07C14.3006 -1.1365e-07 14.7506 0.17 15.0906 0.51C15.7706 1.19 15.7706 2.3 15.0906 2.98L4.95059 13.12L15.0906 23.27C15.7706 23.95 15.7706 25.06 15.0906 25.74C14.4106 26.42 13.3006 26.42 12.6206 25.74L0.000586704 13.12L12.6206 0.5C12.9606 0.16 13.4106 -0.0100004 13.8606 -0.0100004L13.8506 -1.5299e-07Z"} fill="#626466" />
            </g>
            <defs>
                <clipPath id={`clip0_94_${isNext ? '89' : '93'}`}>
                    {isNext ? <rect width="43.98" height="26.26" fill="white" /> : <rect width="43.98" height="26.26" fill="white" transform="translate(43.9805 26.26) rotate(-180)" />}
                </clipPath>
            </defs>
        </svg>
    )
}

// --- Main Component ---

const PerformanceCard = ({ postData, itemsPerPage, totalPost, loading, compSlug }: any) => {
    console.log(itemsPerPage);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const currentPage = Number(searchParams.get(`${compSlug}-page`) || 1);
    const pageCount = Math.ceil(totalPost / itemsPerPage);

    const handlePageClick = ({ selected }: { selected: number }) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(`${compSlug}-page`, `${selected + 1}`);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const selectRef = useRef<{ clearValue: () => void }>(null);
    const handleClear = () => {
        selectRef.current?.clearValue();
        router.push(pathname, { scroll: false });
    };

    const renderCardContent = (post: any) => {
        switch (compSlug) {
            case 'conference-call':
                return <AudioCard post={post} />;
            case 'investor-documents':
            case 'subsidiary-financials':
                return <DocumentCard post={post} compSlug={compSlug} />;
            default:
                return <DocumentCard post={post} compSlug={compSlug} />;
        }
    };

    return (
        <>
            {['conference-call', 'investor-documents'].includes(compSlug) && (
                <div className="c-filterView mb-5">
                    <div className="row gy-2">
                        {compSlug === 'conference-call' && (
                            <>
                                <div className="col-md-10 col-sm-12">
                                    <CustomSelect
                                        options={yearOptions}
                                        placeholder="2025-26"
                                        paramKey="conference-call-year"
                                        selectRef={selectRef}
                                    />
                                </div>
                                <div className="col-12 col-md-2">
                                    <button type="button" className="u-btn bg-blue action_btn" onClick={handleClear}>CLEAR</button>
                                </div>
                            </>
                        )}

                        {compSlug === 'investor-documents' && (
                            <>
                                <div className="col-md-5 col-sm-12">
                                    <CustomSelect
                                        options={invDocOptions}
                                        placeholder="Select Earning Presentation"
                                        paramKey="investor-documents-type"
                                        searchable
                                        selectRef={selectRef}
                                    />
                                </div>
                                <div className="col-md-5 col-sm-12">
                                    <CustomSelect
                                        options={yearOptions}
                                        placeholder="Select Year"
                                        paramKey="investor-documents-year"
                                        selectRef={selectRef}
                                    />
                                </div>
                                <div className="col-12 col-md-2">
                                    <button type="button" className="u-btn bg-blue action_btn" onClick={handleClear}>CLEAR</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="c-cardView v7 fixSpace">
                <div className="row">
                    {loading ? (
                        <div className="col-12 text-center py-5">Loading...</div>
                    ) : postData?.length > 0 ? (
                        postData.map((post: any, index: number) => (
                            <div className="col-12 col-md-6 col-lg-4" key={index}>
                                {renderCardContent(post)}
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">No Data found</div>
                    )}

                    {pageCount > 1 && (
                        <div className="pagination-container mt-80 d-flex justify-content-center">
                            <ReactPaginate
                                previousLabel={<PaginationArrow type="prev" />}
                                nextLabel={<PaginationArrow type="next" />}
                                breakLabel={'...'}
                                breakClassName={'break-me'}
                                pageCount={pageCount}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={2}
                                onPageChange={handlePageClick}
                                containerClassName={'pagination'}
                                pageClassName={'pages'}
                                activeClassName={'active'}
                                forcePage={currentPage - 1}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PerformanceCard;

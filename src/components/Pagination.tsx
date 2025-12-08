import React from 'react'
import ReactPaginate from 'react-paginate'

const Pagination = ({ pageCount, handlePageClick, currentPage }: any) => {
    return (
        <>
            <div className="col-12">
                <div className="pagination-container v2 my-4 d-flex justify-content-center">
                    <ReactPaginate
                        previousLabel={
                            <svg
                                width="40"
                                height="40"
                                viewBox="0 0 40 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle cx="20" cy="20" r="19.5" fill="white" stroke="#A1A1A1" />
                                <path
                                    d="M22 31L12.44 21.9999C11.8533 21.4476 11.8533 20.5524 12.44 20.0001L22 11"
                                    stroke="#A1A1A1"
                                    strokeLinecap="round"
                                />
                            </svg>
                        }
                        nextLabel={
                            <svg
                                width="40"
                                height="40"
                                viewBox="0 0 40 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle cx="20" cy="20" r="19.5" fill="white" stroke="#A1A1A1" />
                                <path
                                    d="M17 11L26.56 20.0001C27.1467 20.5524 27.1467 21.4476 26.56 21.9999L17 31"
                                    stroke="#A1A1A1"
                                    strokeLinecap="round"
                                />
                            </svg>
                        }
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={pageCount}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={2}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        pageClassName={"pages"}
                        activeClassName={"active"}
                        forcePage={currentPage - 1}
                    />
                </div>
            </div>
        </>
    )
}

export default Pagination

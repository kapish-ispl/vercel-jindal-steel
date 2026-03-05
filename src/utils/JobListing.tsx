"use client";
import React, { useRef, useContext } from 'react';
import CustomSelect from '@/components/CustomSelect';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { AppContext } from '@/context/AppContext';
import Link from 'next/link';
import Pagination from '@/components/Pagination';

const JobListing = ({ postData, totalPost, itemsPerPage }: any) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { departmentOptions, locationOptions } = useContext(AppContext);
    const departmentRef = useRef<{ clearValue: (push?: boolean) => void } | null>(null);
    const locationRef = useRef<{ clearValue: (push?: boolean) => void } | null>(null);
    const contextInfo = useContext(AppContext);

    const handlePageClick = ({ selected }: { selected: any }) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('page', `${selected + 1}`);
        const newUrl = `${pathname}?${newParams.toString()}`;
        router.push(newUrl, { scroll: false });
    };

    const handleClear = () => {
        departmentRef.current?.clearValue(false);
        locationRef.current?.clearValue(false);

        const params = new URLSearchParams(window.location.search);
        params.delete("department");
        params.delete("location");
        params.delete("page"); // Clear page on reset
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        router.push(newUrl, { scroll: false });
    };

    const currentDate = new Date();
    let currentDay = `${currentDate.getDate()}`;
    let currentMonth = `${currentDate.getMonth() + 1}`;
    let currentYear = currentDate.getFullYear();
    if (currentDate.getMonth() + 1 <= 9) {
        currentMonth = `0${currentDate.getMonth() + 1}`
    }
    if (currentDate.getDate() <= 9) {
        currentDay = `0${currentDate.getDate()}`
    }
    const getCurrentDate = `${currentYear}${currentMonth}${currentDay}`;

    const selectedDeptLabel = departmentOptions.find(o => o.value === searchParams.get("department"))?.label;
    const selectedLocLabel = locationOptions.find(o => o.value === searchParams.get("location"))?.label;

    const filterData = postData.filter((item: any) => {
        // Location Filter
        if (selectedLocLabel && item.metaInfo.location !== selectedLocLabel) {
            return false;
        }

        // Department Filter
        if (selectedDeptLabel && item.metaInfo.department !== selectedDeptLabel) {
            return false;
        }

        let startDate, endDate;
        if (item.startDate != undefined && item.startDate != "" && item.endDate != undefined && item.endDate != "") {
            let getStartDate = item.startDate.split("-");
            let getEndDate = item.endDate.split("-");

            if (getStartDate[0].length == 4) {
                startDate = `${getStartDate[0]}${getStartDate[1]}${getStartDate[2]}`;
            } else {
                startDate = `${getStartDate[2]}${getStartDate[1]}${getStartDate[0]}`;
            }

            if (getEndDate[0].length == 4) {
                endDate = `${getEndDate[0]}${getEndDate[1]}${getEndDate[2]}`;
            } else {
                endDate = `${getEndDate[2]}${getEndDate[1]}${getEndDate[0]}`;
            }
        }

        if (endDate !== undefined && startDate !== undefined) {
            if (startDate <= getCurrentDate && endDate >= getCurrentDate) {
                return item;
            }
            return false;
        }
        return true;
    });

    const sortData = filterData.sort((a: any, b: any) => {
        if (b.metaInfo.end_date !== "" && a.metaInfo.end_date !== "" && b.metaInfo.end_date !== undefined && a.metaInfo.end_date !== undefined) {
            return a.metaInfo.end_date.split("-").reverse().join("").localeCompare(b.metaInfo.end_date.split("-").reverse().join(""));
        }
    });

    const totalCount = sortData.length;
    const pageCount = Math.ceil(totalCount / itemsPerPage);
    const currentPage = Number(searchParams.get("page") || 1);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const displayData = sortData.slice(start, end);

    const redirectToJobPage = (item: any) => {
        contextInfo.setJobPostId(item.id);
        contextInfo.setJobCode(item.metaInfo.job_code);
        contextInfo.setJobTitle(item.title);
        contextInfo.setJobLocation(item.metaInfo.location);
        contextInfo.setJobRole(item.metaInfo.role);
    };

    return (
        <>
            <div className="c-filterView mb-4">
                <div className="row gy-2">
                    <div className="col-md-10 col-sm-12">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <CustomSelect
                                    options={departmentOptions}
                                    placeholder="Select Department"
                                    paramKey="department"
                                    selectRef={departmentRef}
                                />
                            </div>
                            <div className="col-md-6">
                                <CustomSelect
                                    options={locationOptions}
                                    placeholder="Select Location"
                                    paramKey="location"
                                    selectRef={locationRef}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-2">
                        <button
                            type="button"
                            className="u-btn bg-blue action_btn w-100"
                            onClick={handleClear}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
            <div className="generic_spacer_container genric_bottom_spacer pt-2 v-2 newListCard">
                <div className="container cus-container">
                    <div className="row gy-4">

                        {displayData.length > 0 ? (
                            displayData.map((item: any) => {
                                return (
                                    <div className="col-12 col-md-6" key={item.id}>
                                        <div className="newListCard__item">
                                            <div className="newListCard__item-info">
                                                <div className="c-content-24 clr-gray ft_semiBold lh_1-4 mb-3">{item.metaInfo.role !== "" ? `${item.metaInfo.role}, ` : ""}
                                                    {item.title}</div>

                                                <div className="c-content-20 clr-gray lh_1-4 mb-3"><span className="ft_semiBold u-text">Location:{" "}</span><span className="ft_regular">{item.metaInfo.location !== "" ? item.metaInfo.location : "-"}</span></div>

                                                <div className="c-content-20 clr-gray lh_1-4 mb-3"><span className="ft_semiBold u-text">Department:{" "}</span><span className="ft_regular">{item.metaInfo.department !== "" ? item.metaInfo.department : "-"}</span></div>

                                                <div className="c-content-20 clr-gray lh_1-4 mb-3">{item.metaInfo.description !== "" ? item.metaInfo.description : ""}</div>

                                                <div className="action-btn">
                                                    <Link className="u-btn clr-white" href={`/test-page`} onClick={() => redirectToJobPage(item)}>Apply Now</Link>
                                                    <button className="u-btn withBorder" type="button">
                                                        <span className="clr-olive">Know More</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="cus_text24 text-center">No Data Found</p>
                        )}

                        {totalCount > itemsPerPage && (
                            <Pagination
                                pageCount={pageCount}
                                handlePageClick={handlePageClick}
                                currentPage={currentPage}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default JobListing;
"use client";
import React, { useRef, useContext } from 'react';
import CustomSelect from '@/components/CustomSelect';
import { useRouter } from 'next/navigation';
import { AppContext } from '@/context/AppContext';

const JobListing = () => {
    const router = useRouter();
    const { departmentOptions, locationOptions } = useContext(AppContext);
    const departmentRef = useRef<{ clearValue: (push?: boolean) => void } | null>(null);
    const locationRef = useRef<{ clearValue: (push?: boolean) => void } | null>(null);

    const handleClear = () => {
        departmentRef.current?.clearValue(false);
        locationRef.current?.clearValue(false);

        const params = new URLSearchParams(window.location.search);
        params.delete("department");
        params.delete("location");
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        router.push(newUrl, { scroll: false });
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
                        <div className="col-12 col-md-6">
                            <div className="newListCard__item">
                                <div className="newListCard__item-info">
                                    <div className="c-content-24 clr-gray ft_semiBold lh_1-4 mb-3">HRBP Executive &ndash; AM/DM,&nbsp;HRBP Executive</div>

                                    <div className="c-content-20 clr-gray lh_1-4 mb-3"><span className="ft_semiBold u-text">Location</span><span className="ft_regular">Barbil, Odisha</span></div>

                                    <div className="c-content-20 clr-gray lh_1-4 mb-3"><span className="ft_semiBold u-text">Department</span><span className="ft_regular">Human Resources and Employee Services</span></div>

                                    <div className="c-content-20 clr-gray lh_1-4 mb-3">Supports the HRBP function in executing people processes, compliance, and welfare initiatives at the unit level. Acts as the HR point of contact for assigned clusters,...</div>

                                    <div className="action-btn"><a className="u-btn clr-white" href="#" target="_blank">Apply Now</a><button className="u-btn withBorder" type="button"><span className="clr-olive">Know More</span></button></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="newListCard__item">
                                <div className="newListCard__item-info">
                                    <div className="c-content-24 clr-gray ft_semiBold lh_1-4 mb-3">HRBP Executive &ndash; AM/DM,&nbsp;HRBP Executive</div>

                                    <div className="c-content-20 clr-gray lh_1-4 mb-3"><span className="ft_semiBold u-text">Location</span><span className="ft_regular">Barbil, Odisha</span></div>

                                    <div className="c-content-20 clr-gray lh_1-4 mb-3"><span className="ft_semiBold u-text">Department</span><span className="ft_regular">Human Resources and Employee Services</span></div>

                                    <div className="c-content-20 clr-gray lh_1-4 mb-3">Supports the HRBP function in executing people processes, compliance, and welfare initiatives at the unit level. Acts as the HR point of contact for assigned clusters,...</div>

                                    <div className="action-btn"><a className="u-btn clr-white" href="#" target="_blank">Apply Now</a><button className="u-btn withBorder" type="button"><span className="clr-olive">Know More</span></button></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="newListCard__item">
                                <div className="newListCard__item-info">
                                    <div className="c-content-24 clr-gray ft_semiBold lh_1-4 mb-3">HRBP Executive &ndash; AM/DM,&nbsp;HRBP Executive</div>

                                    <div className="c-content-20 clr-gray lh_1-4 mb-3"><span className="ft_semiBold u-text">Location</span><span className="ft_regular">Barbil, Odisha</span></div>

                                    <div className="c-content-20 clr-gray lh_1-4 mb-3"><span className="ft_semiBold u-text">Department</span><span className="ft_regular">Human Resources and Employee Services</span></div>

                                    <div className="c-content-20 clr-gray lh_1-4 mb-3">Supports the HRBP function in executing people processes, compliance, and welfare initiatives at the unit level. Acts as the HR point of contact for assigned clusters,...</div>

                                    <div className="action-btn"><a className="u-btn clr-white" href="#" target="_blank">Apply Now</a><button className="u-btn withBorder" type="button"><span className="clr-olive">Know More</span></button></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="newListCard__item">
                                <div className="newListCard__item-info">
                                    <div className="c-content-24 clr-gray ft_semiBold lh_1-4 mb-3">HRBP Executive &ndash; AM/DM,&nbsp;HRBP Executive</div>

                                    <div className="c-content-20 clr-gray lh_1-4 mb-3"><span className="ft_semiBold u-text">Location</span><span className="ft_regular">Barbil, Odisha</span></div>

                                    <div className="c-content-20 clr-gray lh_1-4 mb-3"><span className="ft_semiBold u-text">Department</span><span className="ft_regular">Human Resources and Employee Services</span></div>

                                    <div className="c-content-20 clr-gray lh_1-4 mb-3">Supports the HRBP function in executing people processes, compliance, and welfare initiatives at the unit level. Acts as the HR point of contact for assigned clusters,...</div>

                                    <div className="action-btn"><a className="u-btn clr-white" href="#" target="_blank">Apply Now</a><button className="u-btn withBorder" type="button"><span className="clr-olive">Know More</span></button></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="newListCard__item">
                                <div className="newListCard__item-info">
                                    <div className="c-content-24 clr-gray ft_semiBold lh_1-4 mb-3">HRBP Executive &ndash; AM/DM,&nbsp;HRBP Executive</div>

                                    <div className="c-content-20 clr-gray lh_1-4 mb-3"><span className="ft_semiBold u-text">Location</span><span className="ft_regular">Barbil, Odisha</span></div>

                                    <div className="c-content-20 clr-gray lh_1-4 mb-3"><span className="ft_semiBold u-text">Department</span><span className="ft_regular">Human Resources and Employee Services</span></div>

                                    <div className="c-content-20 clr-gray lh_1-4 mb-3">Supports the HRBP function in executing people processes, compliance, and welfare initiatives at the unit level. Acts as the HR point of contact for assigned clusters,...</div>

                                    <div className="action-btn"><a className="u-btn clr-white" href="#" target="_blank">Apply Now</a><button className="u-btn withBorder" type="button"><span className="clr-olive">Know More</span></button></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default JobListing;
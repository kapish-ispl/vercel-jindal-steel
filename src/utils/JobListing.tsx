"use client";
import React, { useRef } from 'react';
import CustomSelect from '@/components/CustomSelect';
import { useRouter } from 'next/navigation';
import { departmentOptions, locationOptions } from '@/constants/GenericFilter';

const JobListing = () => {
    const router = useRouter();
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
    );
};

export default JobListing;
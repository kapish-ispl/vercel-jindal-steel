import React from 'react';
import { useField } from 'formik';
import Select from 'react-select';

interface Option {
    label: string;
    value: string;
}

interface FormMultiSelectProps {
    label: string;
    name: string;
    options: Option[];
    placeholder?: string;
    onChange?: (options: any) => void;
    showLabel?: boolean;
    isMulti?: boolean;
    error?: string;
    touched?: boolean;
}

const FormMultiSelect: React.FC<FormMultiSelectProps> = ({
    label,
    name,
    options,
    placeholder = "Select options",
    onChange,
    showLabel = false,
    isMulti = false,
    error,
    touched,
}) => {
    const [field, meta, helpers] = useField(name);

    const hasError = Boolean((touched || meta.touched) && (error || meta.error));
    const displayError = error || meta.error;

    // Handle initial value or external value updates
    const selectedOptions = isMulti
        ? options.filter(option => (field.value as string[])?.includes(option.value))
        : options.find(option => option.value === field.value) || null;

    const handleChange = (selected: any) => {
        if (isMulti) {
            const values = selected ? selected.map((opt: any) => opt.value) : [];
            helpers.setValue(values, true);
        } else {
            helpers.setValue(selected ? selected.value : "", true);
        }

        if (onChange) onChange(selected);
    };

    return (
        <div
            className={`form_grider_wrap ${hasError ? "hasError" : ""}`}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    helpers.setTouched(true, true);
                }
            }}
        >
            {showLabel && <label className="form_grider_wrap_label">{label}</label>}
            <div className="dropdown d-inline-block w-100 cus-select">
                <Select
                    data-lenis-ignore
                    isMulti={isMulti}
                    name={name}
                    className="form_grider_wrap_field select_field"
                    classNamePrefix="react-select"
                    placeholder={placeholder}
                    value={selectedOptions}
                    onChange={handleChange}
                    options={options}
                    onBlur={() => helpers.setTouched(true, true)}
                    styles={{
                        control: (base, state) => ({
                            ...base,
                            border: hasError ? '1px solid rgb(237, 67, 55)' : 'none',
                            boxShadow: 'none',
                            '&:hover': {
                                border: hasError ? '1px solid rgb(237, 67, 55)' : 'none'
                            }
                        }),
                        valueContainer: (base) => ({
                            ...base,
                            paddingLeft: '15px'
                        }),
                        singleValue: (base) => ({
                            ...base,
                            margin: 0
                        }),
                        placeholder: (base) => ({
                            ...base,
                            margin: 0
                        })
                    }}
                />
            </div>
            {hasError && <p className="form_grider_wrap_helper">{displayError}</p>}
        </div>
    );
};

export default FormMultiSelect;

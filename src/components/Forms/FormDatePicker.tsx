import React from 'react';
import { useField, useFormikContext } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface FormDatePickerProps {
    label: string;
    name: string;
    placeholder?: string;
    error?: string;
    touched?: boolean;
    [key: string]: any;
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({
    label,
    name,
    placeholder,
    error,
    touched,
    ...props
}) => {
    const [field] = useField(name);
    const { setFieldValue } = useFormikContext();

    const hasError = touched && !!error;
    const containerClassName = `form_grider_wrap ${hasError ? "hasError" : ""}`;

    return (
        <div className={containerClassName}>
            <label htmlFor={name} className="form_grider_wrap_label">
                {label}
            </label>
            <div className="datepicker_wrapper w-100">
                <DatePicker
                    {...props}
                    {...field}
                    id={name}
                    selected={(field.value && new Date(field.value)) || null}
                    onChange={(val: Date | null) => setFieldValue(name, val)}
                    placeholderText={placeholder || label}
                    className="form_grider_wrap_field w-100"
                    autoComplete="off"
                />
            </div>
            {hasError && <p className="form_grider_wrap_helper">{error}</p>}
        </div>
    );
};

export default FormDatePicker;

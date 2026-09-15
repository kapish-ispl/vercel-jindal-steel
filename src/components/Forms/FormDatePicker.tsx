import React from 'react';
import { useField, useFormikContext } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';

interface FormDatePickerProps {
    label: string;
    name: string;
    placeholder?: string;
    placeholderText?: string;
    error?: string;
    touched?: boolean;
    showLabel?: boolean;
    dateFormat?: string;
    [key: string]: unknown;
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({
    label,
    name,
    placeholder,
    placeholderText,
    error,
    touched,
    showLabel = false,
    dateFormat = "MM/dd/yyyy",
    ...props
}) => {
    const [field, meta] = useField(name);
    const { setFieldValue, setFieldTouched } = useFormikContext();

    const hasError = (touched || meta.touched) && (error || meta.error);
    const displayError = error || meta.error;
    const containerClassName = `form_grider_wrap ${hasError ? "hasError" : ""}`;

    const selectedDate = React.useMemo(() => {
        if (!field.value) return null;
        const d = new Date(field.value);
        return isNaN(d.getTime()) ? null : d;
    }, [field.value]);

    const resolvedPlaceholder = placeholderText || placeholder || `${label} (MM/DD/YYYY)`;

    return (
        <div className={containerClassName}>
            {showLabel && (
                <label htmlFor={name} className="form_grider_wrap_label">
                    {label}
                </label>
            )}
            <div className="datepicker_wrapper w-100 position-relative">
                <DatePicker
                    {...props}
                    id={name}
                    name={name}
                    selected={selectedDate}
                    dateFormat={dateFormat}
                    onChange={(val: Date | null) => {
                        setFieldTouched(name, true, false);
                        setFieldValue(name, val, true);
                    }}
                    onBlur={() => setFieldTouched(name, true, true)}
                    placeholderText={resolvedPlaceholder}
                    className="form_grider_wrap_field w-100 pe-5"
                    autoComplete="off"
                />
                <Calendar
                    className="datepicker_icon"
                    size={18}
                    style={{
                        position: 'absolute',
                        right: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#878787',
                    }}
                />
            </div>
            {hasError && <p className="form_grider_wrap_helper">{displayError}</p>}
        </div>
    );
};

export default FormDatePicker;

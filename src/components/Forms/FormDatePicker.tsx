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
    openToDate?: Date;
    minDate?: Date;
    maxDate?: Date;
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
    openToDate,
    minDate,
    maxDate,
    ...props
}) => {
    const [field, meta] = useField(name);
    const { setFieldValue, setFieldTouched, setFieldError } = useFormikContext();
    const [typedText, setTypedText] = React.useState<string | null>(null);

    const hasError = (touched || meta.touched) && (error || meta.error);
    const displayError = error || meta.error;
    const isFieldDisabled = Boolean((props as any).disabled);
    const containerClassName = `form_grider_wrap ${hasError ? "hasError" : ""} ${isFieldDisabled ? "isDisabled" : ""}`;

    const selectedDate = React.useMemo(() => {
        if (!field.value) return null;
        const d = new Date(field.value);
        return isNaN(d.getTime()) ? null : d;
    }, [field.value]);

    const resolvedPlaceholder = placeholderText || placeholder || `${label} (MM/DD/YYYY)`;

    const parseDateString = (rawVal: string): Date | null => {
        const parts = rawVal.trim().split(/[\/\-\.]/);
        if (parts.length === 3) {
            let month = 0, day = 0, year = 0;
            if (parts[0].length === 4) {
                year = parseInt(parts[0], 10);
                month = parseInt(parts[1], 10) - 1;
                day = parseInt(parts[2], 10);
            } else if (parts[2].length === 4) {
                month = parseInt(parts[0], 10) - 1;
                day = parseInt(parts[1], 10);
                year = parseInt(parts[2], 10);
            }
            if (year >= 1900 && month >= 0 && month < 12 && day >= 1 && day <= 31) {
                const parsed = new Date(year, month, day);
                if (!isNaN(parsed.getTime())) {
                    return parsed;
                }
            }
        }
        return null;
    };

    const validateDateValue = (parsed: Date | null, rawText: string) => {
        if (!parsed) {
            if (rawText.trim() === "") {
                setFieldValue(name, null, true);
            } else {
                setFieldTouched(name, true, false);
                setFieldValue(name, new Date("invalid"), false);
                setFieldError(name, "Enter a valid Date of Birth");
            }
            return;
        }

        const cutoff = new Date();
        cutoff.setHours(23, 59, 59, 999);
        cutoff.setFullYear(cutoff.getFullYear() - 18);

        if (name === "dob" && parsed > cutoff) {
            setFieldTouched(name, true, false);
            setFieldValue(name, parsed, false);
            setFieldError(name, "Applicant must be at least 18 years old");
            return;
        }

        if (name === "dob" && parsed.getFullYear() < 1940) {
            setFieldTouched(name, true, false);
            setFieldValue(name, parsed, false);
            setFieldError(name, "Applicant must be born after 1940");
            return;
        }

        setFieldTouched(name, true, false);
        setFieldValue(name, parsed, true);
    };

    const handleRawChange = (e: any) => {
        const raw = e?.target?.value ?? "";
        setTypedText(raw);
        if (raw.length === 10) {
            const parsed = parseDateString(raw);
            if (parsed) {
                validateDateValue(parsed, raw);
            }
        }
    };

    const handleBlur = () => {
        setFieldTouched(name, true, true);
        if (typedText !== null) {
            const parsed = parseDateString(typedText);
            validateDateValue(parsed, typedText);
            if (parsed) {
                const cutoff = new Date();
                cutoff.setHours(23, 59, 59, 999);
                cutoff.setFullYear(cutoff.getFullYear() - 18);
                if (name !== "dob" || (parsed <= cutoff && parsed.getFullYear() >= 1940)) {
                    setTypedText(null);
                }
            }
        }
    };

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
                    openToDate={openToDate}
                    minDate={minDate}
                    maxDate={maxDate}
                    value={typedText !== null ? typedText : undefined}
                    onChangeRaw={handleRawChange}
                    onChange={(val: Date | null) => {
                        setTypedText(null);
                        setFieldTouched(name, true, false);
                        setFieldValue(name, val, true);
                    }}
                    onBlur={handleBlur}
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

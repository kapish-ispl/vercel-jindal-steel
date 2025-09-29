import { useField } from 'formik';
import React, { forwardRef } from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label?: string;
    name: string;
    type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'date' | 'textarea' | 'radio' | 'checkbox';
    error?: string;
    touched?: boolean;
    rows?: number;
    ref?: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
}

const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
    ({ type = 'text', label, name, error, touched, ...rest }, ref) => {

        const hasError = touched && !!error;
        const [field, meta] = useField({ name, type, ...rest });

        const containerClassName = `form_grider_wrap ${hasError ? "hasError" : ""}`;

        if (type === 'radio') {
            const uniqueId = `${name}-${rest.value}`;
            return (
                <div className="form_radio_wrap form-check">
                    <input
                        id={uniqueId}
                        {...rest}
                        {...field}
                        type="radio"
                        className="form_radio_field form-check-input"
                        ref={ref as React.Ref<HTMLInputElement>}
                    />
                    <label htmlFor={uniqueId} className="form_radio_label form-check-label">
                        {label}
                    </label>
                </div>
            );
        }

        return (
            <div className={containerClassName}>
                <label htmlFor={name} className="form_grider_wrap_label">
                    {label}
                </label>
                {type === 'textarea' ? (
                    <textarea
                        id={name}
                        placeholder={label}
                        {...field}
                        className="form_grider_wrap_field"
                        ref={ref as React.Ref<HTMLTextAreaElement>}
                        {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                    />
                ) : (
                    <input
                        id={name}
                        {...field}
                        placeholder={label}
                        type={type}
                        className="form_grider_wrap_field"
                        ref={ref as React.Ref<HTMLInputElement>}
                        {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
                    />
                )}
                {hasError && <p className="form_grider_wrap_helper">{error}</p>}
            </div>
        );
    }
);

FormField.displayName = 'FormField';

export default FormField;
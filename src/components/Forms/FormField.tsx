import React, { forwardRef } from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label: string;
    name: string;
    type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'date' | 'textarea' | 'radio';
    error?: string;
    touched?: boolean;
}

const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
    ({ type = 'text', label, name, error, touched, ...rest }, ref) => {

        const hasError = touched && !!error;

        const containerClassName = `form_grider_wrap ${hasError ? "hasError" : ""}`;

        if (type === 'radio') {
            const uniqueId = `${name}-${rest.value}`;
            return (
                <div className="form_radio_wrap">
                    <input
                        id={uniqueId}
                        name={name}
                        type="radio"
                        className="form_radio_field"
                        ref={ref as React.Ref<HTMLInputElement>}
                        {...rest}
                    />
                    <label htmlFor={uniqueId} className="form_radio_label">
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
                        name={name}
                        className="form_grider_wrap_field"
                        ref={ref as React.Ref<HTMLTextAreaElement>}
                        {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                    />
                ) : (
                    <input
                        id={name}
                        name={name}
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
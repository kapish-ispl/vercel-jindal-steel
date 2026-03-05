import React, { useState, useRef, useEffect } from 'react';
import { useField } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';

export interface Option {
    label: string;
    value: string;
}

interface FormSelectProps {
    label: string;
    name: string;
    options: Option[];
    placeholder?: string;
    searchable?: boolean;
    error?: string;
    touched?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({
    label,
    name,
    options,
    placeholder = "Select an option",
    searchable = false,
    error,
    touched,
    ...props
}) => {
    const [field, meta, helpers] = useField(name);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    const hasError = (touched || meta.touched) && (error || meta.error);
    const displayError = error || meta.error;
    const selectedOption = options.find(opt => opt.value === field.value);

    const filteredOptions = searchable
        ? options.filter((opt) =>
            opt.label.toLowerCase().includes(search.toLowerCase())
        )
        : options;

    useEffect(() => {
        if (isOpen) setSearch("");
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                if (isOpen) {
                    setIsOpen(false);
                    helpers.setTouched(true);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleSelect = (option: Option) => {
        helpers.setValue(option.value);
        helpers.setTouched(true);
        setIsOpen(false);
    };

    const containerClassName = `form_grider_wrap ${hasError ? "hasError" : ""}`;

    return (
        <div className={containerClassName} ref={wrapperRef}>
            <label htmlFor={name} className="form_grider_wrap_label">
                {label}
            </label>
            <div className="dropdown d-inline-block w-100 cus-select">
                <motion.button
                    type="button"
                    className="form_grider_wrap_field d-flex justify-content-between align-items-center w-100"
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (isOpen) helpers.setTouched(true);
                    }}
                    style={{ textAlign: 'left', background: 'transparent' }}
                >
                    <span className="flex-grow-1 text-start">
                        {searchable && isOpen ? (
                            <input
                                type="text"
                                className="form-control border-0 p-0 m-0 shadow-none"
                                style={{ background: 'transparent', color: 'inherit', fontSize: 'inherit' }}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search..."
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : selectedOption ? (
                            selectedOption.label
                        ) : (
                            <span style={{ color: '#949494' }}>{placeholder}</span>
                        )}
                    </span>

                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                            key={isOpen ? "open" : "closed"}
                            className="ms-2 d-inline-flex"
                            initial={{ opacity: 0, scaleY: 0.6 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0.6 }}
                        >
                            {isOpen ? <i className="icon-minus" /> : <i className="icon-list-filter" />}
                        </motion.span>
                    </AnimatePresence>
                </motion.button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.ul
                            className="dropdown-menu show w-100 mt-1"
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0 }}
                            style={{ transformOrigin: "top", maxHeight: '300px', overflowY: 'auto', zIndex: 1000 }}
                        >
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt) => (
                                    <li key={opt.value}>
                                        <button
                                            type="button"
                                            className={`dropdown-item ${field.value === opt.value ? 'active' : ''}`}
                                            onClick={() => handleSelect(opt)}
                                        >
                                            {opt.label}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li className="px-3 py-2 text-muted small">No results found</li>
                            )}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>
            {hasError && <p className="form_grider_wrap_helper">{displayError}</p>}
        </div>
    );
};

export default FormSelect;

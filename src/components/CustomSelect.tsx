"use client";
import { useState, useRef, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Option {
    label: string;
    value: string;
}

interface CustomSelectProps {
    options: Option[];
    onChange?: (value: string) => void;
    placeholder?: string;
    icon?: ReactNode;
}

export default function CustomSelect({
    options,
    onChange,
    placeholder = "Select an option",
    icon,
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<Option | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close on ESC key
    useEffect(() => {
        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        }
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, []);

    const handleSelect = (option: Option) => {
        setSelected(option);
        setIsOpen(false);
        onChange?.(option.value);
    };

    return (
        <div ref={wrapperRef} className="dropdown d-inline-block w-100 cus-select">
            <motion.button
                type="button"
                className="d-flex justify-content-between align-items-center w-100"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                layout
            >
                <span>{selected ? selected.label : placeholder}</span>

                {/* Icon Animation */}
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={isOpen ? "open" : "closed"}
                        className="ms-2 d-inline-flex"
                        initial={{ opacity: 0, scaleY: 0.6 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0.6 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {isOpen ? (
                            <i className="icon-minus"></i>
                        ) : icon ? (
                            icon
                        ) : (
                            <i className="icon-list-filter"></i>
                        )}
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
                        style={{ transformOrigin: "top" }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {options.map((opt) => (
                            <li key={opt.value}>
                                <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => handleSelect(opt)}
                                >
                                    {opt.label}
                                </button>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}

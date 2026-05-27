'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExtractedItem {
    title: string;
    content: React.ReactNode;
}

// Helper to get text content from nested children
const getInnerText = (node: React.ReactNode): string => {
    let text = "";
    if (typeof node === "string" || typeof node === "number") {
        return String(node);
    }
    if (React.isValidElement(node)) {
        const props = node.props as any;
        if (props.children) {
            React.Children.forEach(props.children, (child) => {
                text += getInnerText(child);
            });
        }
    } else if (Array.isArray(node)) {
        node.forEach((child) => {
            text += getInnerText(child);
        });
    }
    return text.trim();
};

const findAccordionItems = (node: React.ReactNode): ExtractedItem[] => {
    const items: ExtractedItem[] = [];

    const traverse = (current: React.ReactNode) => {
        if (!current) return;

        if (React.isValidElement(current)) {
            const props = current.props as any;
            const className = props.className || "";

            // Check if this node is an accordion item
            if (className.includes("accordion-item")) {
                let title = "";
                let content: React.ReactNode = null;

                const findItemParts = (cNode: React.ReactNode) => {
                    React.Children.forEach(cNode, (child) => {
                        if (React.isValidElement(child)) {
                            const cProps = child.props as any;
                            const cClass = cProps.className || "";

                            if (cClass.includes("accordion-header") || cClass.includes("accordion-button")) {
                                title = getInnerText(child);
                            } else if (cClass.includes("accordion-collapse") || cClass.includes("accordion-body")) {
                                content = cProps.children;
                            } else {
                                findItemParts(cProps.children);
                            }
                        }
                    });
                };

                findItemParts(props.children);

                if (title && content) {
                    items.push({ title, content });
                    return;
                }
            }

            if (props.children) {
                React.Children.forEach(props.children, (child) => {
                    traverse(child);
                });
            }
        } else if (Array.isArray(current)) {
            current.forEach((child) => traverse(child));
        }
    };

    traverse(node);
    return items;
};

const CustomAccordion = ({ data, children }: { data?: React.ReactNode; children?: React.ReactNode }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const itemsToRender = children || data;

    // Try to extract Bootstrap accordion items recursively
    let items = findAccordionItems(itemsToRender);

    // Fall back to title attributes if no bootstrap classes were found
    if (items.length === 0) {
        React.Children.forEach(itemsToRender, (childNode) => {
            if (React.isValidElement(childNode)) {
                const child = childNode as React.ReactElement<any>;
                if (child.props && child.props.title) {
                    items.push({
                        title: child.props.title,
                        content: child.props.children,
                    });
                }
            }
        });
    }

    return (
        <div className="custom-accordion-container">
            {/* Scoped CSS styling tag to style the Accordion beautifully to match the screenshot */}


            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    isOpen={openIndex === index}
                    onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                >
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    );
};

export const AccordionItem = ({ title, children, isOpen, onToggle }: any) => {
    return (
        <div className="custom-accordion-item">
            <button
                className={`custom-accordion-header ${isOpen ? 'active' : ''}`}
                type="button"
                onClick={onToggle}
            >
                <span className="custom-accordion-title">{title}</span>

                {/* Clean SVG Chevron Icon */}
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="custom-accordion-icon"
                >
                    <svg
                        width="20"
                        height="11"
                        viewBox="0 0 20 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M18.71 0.5L10.5153 9.20447C10.0124 9.7386 9.19735 9.7386 8.69451 9.20447L0.499823 0.499999"
                            stroke={isOpen ? "var(--color-primary, #f07c22)" : "#636466"}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </motion.span>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        className="custom-accordion-collapse"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        <div className="custom-accordion-body">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomAccordion;
import React, { useMemo, useState } from "react";
import parse from "html-react-parser";
import { motion, AnimatePresence } from "framer-motion";

interface CustomAccordionProps {
    data: React.ReactNode[];
}

interface AccordionItemProps {
    title?: string;
    imgsrc?: string;
    children?: string | React.ReactNode;
}

const CustomAccordions = ({ data }: CustomAccordionProps) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const toggleAccordion = (index: number) => {
        setActiveIndex(index);
    };

    const accrodionData = useMemo(() => {
        if (!data) return [];

        return React.Children.toArray(data)
            .filter(
                (child): child is React.ReactElement<AccordionItemProps> =>
                    React.isValidElement(child) && typeof child.props !== "undefined"
            )
            .map((child, index) => ({
                id: index + 1,
                title: child.props.title,
                imgsrc: child.props.imgsrc,
                content: child.props.children,
            }));
    }, [data]);

    return (
        <>
            {/* Image Fade Animation */}
            <div className="col-12  col-xl-6">
                <div className="accordion__media position-relative v2">
                    <AnimatePresence mode="wait">
                        {activeIndex !== null && (
                            <>
                                <motion.img
                                    key={accrodionData[activeIndex]?.imgsrc}
                                    src={accrodionData[activeIndex]?.imgsrc}
                                    alt=""
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="img-fluid u-img"
                                />
                                <div className="overlaytext">{accrodionData[activeIndex]?.title}</div>
                            </>
                        )}
                    </AnimatePresence>

                </div>
            </div>
            <div className="col-12 col-xl-6">
                <div className="c-accordionBase">
                    <div className="c-accordionBase__body">
                        {accrodionData.map((post, index) => {
                            const isOpen = activeIndex === index;

                            return (
                                <div className="c-accordionBase__item" key={index}>
                                    <button
                                        className={`c-accordionBase__item-head px-0 ${isOpen ? "active" : ""
                                            }`}
                                        type="button"
                                        onClick={() => toggleAccordion(index)}
                                    >
                                        <span className="c-accordionBase__item-head-title">
                                            {post.title}
                                        </span>

                                        {/* Icon Rotation Animation */}
                                        <motion.span
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="c-accordionBase__item-head-icon"
                                        >
                                            <svg
                                                width="20"
                                                height="11"
                                                viewBox="0 0 20 11"
                                                fill="none"
                                            >
                                                <path
                                                    d="M18.71 0.5L10.5153 9.20447C10.0124 9.7386 9.19735 9.7386 8.69451 9.20447L0.499823 0.499999"
                                                    stroke="#A1A1A1"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </motion.span>
                                    </button>

                                    {/* Accordion Animation */}
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                className="c-accordionBase__item-body"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.35, ease: "easeInOut" }}
                                                style={{ overflow: "hidden" }}
                                            >
                                                <div>
                                                    {typeof post.content === "string"
                                                        ? parse(post.content)
                                                        : post.content}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>


        </>
    );
};

export default CustomAccordions;
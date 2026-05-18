


import React, { useMemo, useState } from "react";
import parse from "html-react-parser";
import { motion, AnimatePresence } from "framer-motion";

interface CustomAccordionsWithoutimgProps {
    data: React.ReactNode[];
    leftImage?: string;
}

interface AccordionItemProps {
    title?: string;
    children?: string | React.ReactNode;
}

const CustomAccordionsWithoutimg = ({
    data,
    leftImage = "https://docs.jindalsteel.in/document/124/1779108212_Jindal-Leadership-Acceleration-Programme.jpg",
}: CustomAccordionsWithoutimgProps) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const toggleAccordion = (index: number) => {
        setActiveIndex(index);
    };

    const accordionData = useMemo(() => {
        if (!data) return [];

        return React.Children.toArray(data)
            .filter(
                (child): child is React.ReactElement<AccordionItemProps> =>
                    React.isValidElement(child)
            )
            .map((child, index) => ({
                id: index + 1,
                title: child.props.title,
                content: child.props.children,
            }));
    }, [data]);

    return (
        <div className="row align-items-center">
            {/* Left Side Image */}
            <div className="col-12 col-xl-6 mb-4 mb-xl-0">
                <div className="accordion__media position-relative v2">
                    <img
                        src={leftImage}
                        alt="Accordion"
                        className="img-fluid u-img w-100"
                    />
                </div>
            </div>

            {/* Right Side Accordion */}
            <div className="col-12 col-xl-6">
                <div className="c-accordionBase">
                    <div className="c-accordionBase__body">
                        {accordionData.map((post, index) => {
                            const isOpen = activeIndex === index;

                            return (
                                <div
                                    className="c-accordionBase__item"
                                    key={post.id}
                                >
                                    {/* Accordion Header */}
                                    <button
                                        type="button"
                                        className={`c-accordionBase__item-head px-0 ${
                                            isOpen ? "active" : ""
                                        }`}
                                        onClick={() =>
                                            toggleAccordion(index)
                                        }
                                    >
                                        <span className="c-accordionBase__item-head-title">
                                            {post.title}
                                        </span>

                                        {/* Arrow Icon */}
                                        <motion.span
                                            className="c-accordionBase__item-head-icon"
                                            animate={{
                                                rotate: isOpen ? 180 : 0,
                                            }}
                                            transition={{
                                                duration: 0.3,
                                            }}
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

                                    {/* Accordion Body */}
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                className="c-accordionBase__item-body"
                                                initial={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    height: "auto",
                                                    opacity: 1,
                                                }}
                                                exit={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                transition={{
                                                    duration: 0.35,
                                                    ease: "easeInOut",
                                                }}
                                                style={{
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <div className="pt-2">
                                                    {typeof post.content ===
                                                    "string"
                                                        ? parse(
                                                              post.content
                                                          )
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
        </div>
    );
};

export default CustomAccordionsWithoutimg;
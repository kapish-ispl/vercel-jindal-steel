'use client'
import React from 'react';
import parse, { HTMLReactParserOptions, Element, attributesToProps, domToReact, DOMNode } from 'html-react-parser';
import dynamic from 'next/dynamic';

const SplitAnimation = dynamic(() => import('../SplitText'), { ssr: false });
const BlurAnimation = dynamic(() => import('../BlurText'), { ssr: false });
const ScrollRevealAnimation = dynamic(() => import('../ScrollReveal'), { ssr: false });
const Counter = dynamic(() => import('../AnimatedCountUp'), { ssr: false });
const CardStackSlider = dynamic(() => import('../CardStackSlider'), { ssr: false });
const ScrollAnimation = dynamic(() => import('../ScrollAnimation'), { ssr: false });
const PostList = dynamic(() => import('@/utils/PostList'), { ssr: false });
const CustomForm = dynamic(() => import('@/utils/CustomForm'), { ssr: false });
const CustomMap = dynamic(() => import('@/utils/CustomMap'), { ssr: false });
const CustomMapIndia = dynamic(() => import('@/utils/CustomMapIndia'), { ssr: false });
const CenterModeSlider = dynamic(() => import('../CenterModeSlider'), { ssr: false });
const CustomContentSlider = dynamic(() => import('../CustomContentSlider'), { ssr: false });

const PageTemplate = ({ data }: any) => {
    const options: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (domNode instanceof Element && domNode.attribs) {
                if (domNode.name === "custompost") {
                    const props = attributesToProps(domNode.attribs);
                    return <PostList {...props} />;
                }
                if (domNode.name == "animatedcountup") {
                    const props = attributesToProps(domNode.attribs);
                    const toValue = props.to ? Number(props.to) : 0;
                    return <Counter to={toValue} />;
                }

                if (domNode.name === "splitanimation") {
                    const props = attributesToProps(domNode.attribs);
                    return <SplitAnimation text={String(props.text)} />;
                }
                if (domNode.name === "bluranimation") {
                    const props = attributesToProps(domNode.attribs);
                    return <BlurAnimation text={String(props.text)} />;
                }
                if (domNode.name === "cardstackslider") {
                    const props = attributesToProps(domNode.attribs);
                    return <CardStackSlider {...props} />;
                }
                if (domNode.name === "scrollanimation") {
                    const props = attributesToProps(domNode.attribs);
                    return (
                        <ScrollAnimation
                            {...props}
                            data={domToReact(domNode.children as DOMNode[], {
                                replace: (childNode) => {
                                    if (childNode instanceof Element) {
                                        if (childNode.name === "animatedcountup") {
                                            const childProps = attributesToProps(childNode.attribs);
                                            const toValue = childProps.to ? Number(childProps.to) : 0;
                                            return <Counter to={toValue} />;
                                        }
                                    }
                                },
                            })}
                        />
                    );
                }
                if (domNode.name === "customform") {
                    const props = attributesToProps(domNode.attribs);
                    return <CustomForm {...props} pageTitle={String(props.title)} component={String(props.component)} />;
                }
                if (domNode.name === "custommapindia") {
                    const props = attributesToProps(domNode.attribs);
                    return <CustomMapIndia {...props} data={domToReact(domNode.children as DOMNode[])} />;
                }
                if (domNode.name === "custommap") {
                    const props = attributesToProps(domNode.attribs);
                    return (
                        <CustomMap
                            {...props}
                            data={domToReact(domNode.children as DOMNode[], {
                                replace: (childNode) => {
                                    if (childNode instanceof Element) {
                                        if (childNode.name === "animatedcountup") {
                                            const childProps = attributesToProps(childNode.attribs);
                                            const toValue = childProps.to ? Number(childProps.to) : 0;
                                            return <Counter to={toValue} />;
                                        }
                                    }
                                },
                            })}
                        />
                    );
                }
                if (domNode.name === "centermodeslider") {
                    const props = attributesToProps(domNode.attribs);
                    return <CenterModeSlider {...props} data={domToReact(domNode.children as DOMNode[])} />;
                }
                if (domNode.name === "customcontentslider") {
                    const props = attributesToProps(domNode.attribs);
                    return <CustomContentSlider {...props} data={domToReact(domNode.children as DOMNode[])} />;
                }
                // ✅ Universal fix for self-closing tags
                if (domNode instanceof Element && domNode.name?.startsWith("source")) {
                    const props = attributesToProps(domNode.attribs);
                    return <source {...props} />;
                }
                if (domNode instanceof Element && domNode.name?.startsWith("span")) {
                    const props = attributesToProps(domNode.attribs);
                    return <span {...props}>{domToReact(domNode.children as DOMNode[])}</span>;
                }
                if (domNode instanceof Element && domNode.name?.startsWith("iframe")) {
                    const props = attributesToProps(domNode.attribs);
                    return <iframe {...props}></iframe>;
                }
            }

            return null;
        },
        htmlparser2: {
            lowerCaseTags: false,
            xmlMode: true,
        },
    };

    return <>{parse(data?.content, options)}</>;
};

export default PageTemplate;

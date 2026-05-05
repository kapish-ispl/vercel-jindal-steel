'use client'
import parse, { HTMLReactParserOptions, Element, attributesToProps, domToReact, DOMNode } from 'html-react-parser';
import dynamic from "next/dynamic";
import CustomSliderCategory from '@/utils/CustomSliderCategory';

const CustomSilder = dynamic(() => import('@/utils/CustomSilder'), { ssr: false });
const Counter = dynamic(() => import('@/components/AnimatedCountUp'), { ssr: false });
const CustomContentSlider = dynamic(() => import('@/components/CustomContentSlider'), { ssr: false });
const CustomProductForm = dynamic(() => import("@/utils/CustomProductForm"));

const PageTemplate = ({ pageData }: any) => {
    const options: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (domNode instanceof Element && domNode.attribs) {

                if (domNode.name === "customslider") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <CustomSilder {...props} data={Array.isArray(children) ? children : [children]} />;
                }
                if (domNode.name == "animatedcountup") {
                    const props = attributesToProps(domNode.attribs);
                    const toValue = props.to ? Number(props.to) : 0;
                    return <Counter to={toValue} />;
                }
                if (domNode.name === "customcontentslider") {
                    const props = attributesToProps(domNode.attribs);
                    return <CustomContentSlider {...props} data={domToReact(domNode.children as DOMNode[])} />;
                }
                if (domNode.name === "customslidercategory") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[], {
                        replace: (childNode) => {
                            if (childNode instanceof Element) {
                                if (childNode.name === "animatedcountup") {
                                    const childProps = attributesToProps(childNode.attribs);
                                    const toValue = childProps.to ? Number(childProps.to) : 0;
                                    return <Counter to={toValue} />;
                                }
                            }
                        },
                    });
                    return <CustomSliderCategory {...props} data={Array.isArray(children) ? children : [children]} />;
                }
                if (domNode.name === "customproductform") {
                    const props = attributesToProps(domNode.attribs);
                    return <CustomProductForm {...props} />;
                }
            }

            return null;
        },
        htmlparser2: {
            lowerCaseTags: false,
            xmlMode: true,
        },
    };

    return (
        <>
            {parse(pageData?.content, options)}
        </>
    )
}

export default PageTemplate;
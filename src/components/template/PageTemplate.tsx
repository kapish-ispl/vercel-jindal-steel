
"use client";
import parse, { HTMLReactParserOptions, Element, attributesToProps, domToReact, DOMNode } from 'html-react-parser';
import dynamic from 'next/dynamic';

const CustomAccordian = dynamic(() => import('../custom-components/CustomAccordian'), { ssr: false });
const CardStackSlider = dynamic(() => import('../custom-components/CardStackSlider'), { ssr: false });
const IntractiveMap = dynamic(() => import('../custom-components/IntractiveMap'), { ssr: false });
const Counter = dynamic(() => import('../custom-components/Counter'), { ssr: false });

const PageTemplate = ({ data }: any) => {
    const options: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (domNode instanceof Element && domNode.attribs) {
                if (!domNode.attribs) {
                    return;
                }
                if (domNode.name === "customaccordian") {
                    const props = attributesToProps(domNode.attribs);
                    return <CustomAccordian {...props} data={domToReact(domNode.children as DOMNode[])} />;
                }
                if (domNode.name === "sardstackslider") {
                    const props = attributesToProps(domNode.attribs);
                    return <CardStackSlider {...props} />;
                }
                if (domNode.name === "interactivemap") {
                    const props = attributesToProps(domNode.attribs);
                    return <IntractiveMap {...props} />;
                }
                if (domNode.name === "animatedcountup") {
                    const props = attributesToProps(domNode.attribs);
                    return <Counter {...props} />;
                }
            }
            return null;
        },
        htmlparser2: {
            lowerCaseTags: false,
            xmlMode: true,
        },
    }

    return (
        <>
            {parse(data?.content, options)}
        </>
    );
}

export default PageTemplate;
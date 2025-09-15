
"use client";
import parse, { HTMLReactParserOptions, Element, attributesToProps, domToReact, DOMNode } from 'html-react-parser';
import dynamic from 'next/dynamic';

const CustomAccordian = dynamic(() => import('../custom-components/CustomAccordian'), { ssr: false });

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
            {parse(data.content, options)}
        </>
    );
}

export default PageTemplate;
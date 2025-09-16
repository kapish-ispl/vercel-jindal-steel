"use client";
import parse, { HTMLReactParserOptions, Element, attributesToProps, domToReact, DOMNode } from 'html-react-parser';
import dynamic from 'next/dynamic';

const CustomAccordian = dynamic(() => import('../custom-components/CustomAccordian'), { ssr: false });
const CardStackSlider = dynamic(() => import('../custom-components/CardStackSlider'), { ssr: false });
const IntractiveMap = dynamic(() => import('../custom-components/IntractiveMap'), { ssr: false });
const Counter = dynamic(() => import('../custom-components/ComponentHelper').then(m => m.Counter), { ssr: false });
const SplitAnimation = dynamic(() => import('../custom-components/ComponentHelper').then(m => m.SplitAnimation), { ssr: false });
const PostList = dynamic(() => import('../custom-components/PostList'), { ssr: false });

const PageTemplate = ({ data }: any) => {
    const options: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (domNode instanceof Element && domNode.attribs) {
                if (domNode.name === "postlist") {
                    const props = attributesToProps(domNode.attribs);
                    return <PostList slug={''} category={''} type={''} limit={''} component={'FinancialCard'} datatabs={''} {...props} />;
                }
                if (domNode.name === "customaccordian") {
                    const props = attributesToProps(domNode.attribs);
                    return <CustomAccordian {...props} data={domToReact(domNode.children as DOMNode[])} />;
                }
                if (domNode.name === "cardstackslider") {
                    const props = attributesToProps(domNode.attribs);
                    return <CardStackSlider {...props} />;
                }
                if (domNode.name === "interactivemap") {
                    const props = attributesToProps(domNode.attribs);
                    return <IntractiveMap {...props} />;
                }
                if (domNode.name === "animatedcountup") {
                    const props = attributesToProps(domNode.attribs);
                    const toValue = props.to ? Number(props.to) : 0;
                    return <Counter to={toValue} />;
                }

                if (domNode.attribs.id === "splitanimation") {
                    const props = attributesToProps(domNode.attribs);
                    return <SplitAnimation text={String(props.text)} />;
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

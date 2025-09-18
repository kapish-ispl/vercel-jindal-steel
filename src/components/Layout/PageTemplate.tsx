'use client'
import parse, { HTMLReactParserOptions, Element, attributesToProps, domToReact, DOMNode } from 'html-react-parser';
import dynamic from 'next/dynamic';

const SplitAnimation = dynamic(() => import('../SplitText'), { ssr: false });
const BlurAnimation = dynamic(() => import('../BlurText'), { ssr: false });
const ScrollRevealAnimation = dynamic(() => import('../ScrollReveal'), { ssr: false });
const Counter = dynamic(() => import('../AnimatedCountUp'), { ssr: false });
// const CardStackSlider = dynamic(() => import('../CardStackSlider'), { ssr: false });
const IntractiveMap = dynamic(() => import('../IntractiveMap'), { ssr: false });
const PostList = dynamic(() => import('@/utils/PostList'), { ssr: false });

const PageTemplate = ({ data }: any) => {
    const options: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (domNode instanceof Element && domNode.attribs) {
                if (domNode.name === "custompost") {
                    const props = attributesToProps(domNode.attribs);
                    return <PostList {...props} />;
                }
                if (domNode.name === "animatedcountup") {
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
                if (domNode.name === "interactivemap") {
                    const props = attributesToProps(domNode.attribs);
                    return <IntractiveMap {...props} />;
                }
                // if (domNode.name === "cardstackslider") {
                //     const props = attributesToProps(domNode.attribs);
                //     return <CardStackSlider {...props} />;
                // }
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

'use client'
import React from 'react';
import parse, { HTMLReactParserOptions, Element, attributesToProps, domToReact, DOMNode } from 'html-react-parser';
import dynamic from 'next/dynamic';
import CustomSliderCategory from '@/utils/CustomSliderCategory';

const SplitAnimation = dynamic(() => import('../SplitText'), { ssr: false });
const BlurAnimation = dynamic(() => import('../BlurText'), { ssr: false });
const Counter = dynamic(() => import('../AnimatedCountUp'), { ssr: false });
const CardStackSlider = dynamic(() => import('../CardStackSlider'), { ssr: false });
const ScrollAnimation = dynamic(() => import('../ScrollAnimation'), { ssr: false });
const PostList = dynamic(() => import('@/utils/PostList'), { ssr: false });
const CustomForm = dynamic(() => import('@/utils/CustomForm'), { ssr: false });
const CustomMap = dynamic(() => import('@/utils/CustomMap'), { ssr: false });
const CustomWorldMap = dynamic(() => import('@/utils/CustomWorldMap'), { ssr: false });
const CustomMapIndia = dynamic(() => import('@/utils/CustomMapIndia'), { ssr: false });
const CustomContentSlider = dynamic(() => import('../CustomContentSlider'), { ssr: false });
const CustomHorizontalScroll = dynamic(() => import('@/utils/CustomHorizontalScroll'), { ssr: false });
const HorizontalScrollSecton = dynamic(() => import('@/utils/HorizontalScrollSecton'), { ssr: false });
const CustomStickyCard = dynamic(() => import('@/utils/CustomStickyCard'), { ssr: false });
const CustomSilder = dynamic(() => import('@/utils/CustomSilder'), { ssr: false });
const CardSwipeSlider = dynamic(() => import("@/utils/CardSwipeSlider"), { ssr: false });
const Tabs = dynamic(() => import("@/utils/Tabs"), { ssr: false });
const CustomCarouselSlider = dynamic(() => import("@/utils/CustomCarouselSlider"), { ssr: false });
const ReadMoreModal = dynamic(() => import("@/utils/ReadMoreModal"), { ssr: false });
const PodcastSlider = dynamic(() => import("@/utils/PodcastSlider"), { ssr: false });
const ReadMore = dynamic(() => import("@/utils/ReadMore"), { ssr: false });
const CustomZoomScrollEffectV2 = dynamic(() => import('@/utils/CustomZoomScrollEffectV2'), { ssr: false });
const GallerySlider = dynamic(() => import("@/utils/GallerySlider"), { ssr: false });
const StackSlider = dynamic(() => import("@/utils/StackSlider"), { ssr: false });
const CategorySlider = dynamic(() => import("@/utils/CategorySlider"), { ssr: false });
const CustomContentSliders = dynamic(() => import("@/utils/CustomContentSliders"), { ssr: false });
const JobForm = dynamic(() => import("@/components/Forms/JobForm"), { ssr: false });
const VerticalCarousel = dynamic(() => import("@/utils/VerticalCarousel"), { ssr: false });
const CustomWheelSection = dynamic(() => import("@/utils/CustomWheelSection"), { ssr: false });
const CircleSlider = dynamic(() => import("@/utils/CircleSlider"), { ssr: false });
const CustomAccordions = dynamic(() => import("@/utils/CustomAccordions"), { ssr: false });
const TimelineSlider = dynamic(() => import("@/utils/TimeLineSlider"), { ssr: false });
const CustomCircleAnimation = dynamic(() => import("@/utils/CustomCircleAnimation"), { ssr: false });
const BentoSyncReveal = dynamic(() => import("@/utils/BentoSyncReveal"), { ssr: false });
const HighlightCarousel = dynamic(() => import("@/utils/HighlightCarousel"), { ssr: false });
const ScrollProgress = dynamic(() => import("@/utils/ScrollProgress"), { ssr: false });
const GenericSlideWrapper = dynamic(() => import("@/utils/GenericSlideWrapper"), { ssr: false });
const TimeLineSection = dynamic(() => import("@/utils/TimeLineSection"), { ssr: false });
const RotatingSlider = dynamic(() => import("@/utils/RotatingSlider"), { ssr: false });
const SportsGallerySlider = dynamic(() => import("@/utils/SportsGallerySlider"), { ssr: false });
const HeroSection = dynamic(() => import("@/utils/HeroSection"), { ssr: false });
const CustomTabs = dynamic(() => import("@/utils/CustomTabs"), { ssr: false });
const CustomRiseCircular = dynamic(() => import("@/utils/CustomRiseCircular"), { ssr: false });
const Timeline = dynamic(() => import("@/utils/Timeline"), { ssr: false });
const CustomAccordionsWithoutimg = dynamic(() => import("@/utils/CustomAccordionsWithoutimg"), { ssr: false });
const CustomValueChart = dynamic(() => import("@/utils/CustomValueChart"), { ssr: false });
const HexagonSection = dynamic(() => import("@/utils/HexagonSection"), { ssr: false });
const CustomAccordion = dynamic(() => import("@/utils/CustomAccordian"), { ssr: false });
const AirEmissionsChart = dynamic(() => import("@/utils/AirEmissionsChart"), { ssr: false });

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
                if (domNode.name === "cardswipeslider") {
                    return <CardSwipeSlider />
                }
                if (domNode.name === "customcircleanimation") {
                    return <CustomCircleAnimation />
                }
                if (domNode.name === "customvaluechart") {
                    return <CustomValueChart />
                }
                if (domNode.name === "airemissionschart") {
                    return <AirEmissionsChart />
                }
                if (domNode.name === "customrisecircular") {
                    return <CustomRiseCircular />
                }
                if (domNode.name === "scrollprogress") {
                    return <ScrollProgress />
                }

                if (domNode.name === "highlightcarousel") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <HighlightCarousel props={props} data={Array.isArray(children) ? children : [children]} />
                }
                if (domNode.name === "hexagonsection") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <HexagonSection props={props} data={Array.isArray(children) ? children : [children]} />
                }
                if (domNode.name === "customtabs") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <CustomTabs props={props} data={Array.isArray(children) ? children : [children]} />
                }
                if (domNode.name === "timeline") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <Timeline props={props} data={Array.isArray(children) ? children : [children]} />
                }
                if (domNode.name === "sportsgalleryslider") {
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <SportsGallerySlider data={Array.isArray(children) ? children : [children]} />
                }

                if (domNode.name === "bluranimation") {
                    const props = attributesToProps(domNode.attribs);
                    return <BlurAnimation text={String(props.text)} />;
                }
                if (domNode.name === "galleryslider") {
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <GallerySlider data={Array.isArray(children) ? children : [children]} />;
                }
                if (domNode.name === "timelinesection") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <TimeLineSection {...props} data={Array.isArray(children) ? children : [children]} />
                }
                if (domNode.name === "herosection") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <HeroSection {...props} data={Array.isArray(children) ? children : [children]} />
                }
                if (domNode.name === "cardstackslider") {
                    const props = attributesToProps(domNode.attribs);
                    return <CardStackSlider {...props} data={domToReact(domNode.children as DOMNode[])} />;
                }
                if (domNode.name === "verticalcarousel") {
                    const props = attributesToProps(domNode.attribs);
                    return <VerticalCarousel {...props} data={domToReact(domNode.children as DOMNode[])} />;
                }
                if (domNode.name === "customaccordions") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <CustomAccordions {...props} data={Array.isArray(children) ? children : [children]} />;
                }
                if (domNode.name === "customaccordion") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <CustomAccordion {...props} data={Array.isArray(children) ? children : [children]} />;
                }
                if (domNode.name === "customaccordionswithoutimg") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <CustomAccordionsWithoutimg {...props} data={Array.isArray(children) ? children : [children]} />;
                }
                if (domNode.name == "customcontentsliders") {
                    const props = attributesToProps(domNode.attribs);
                    return <CustomContentSliders {...props} data={domToReact(domNode.children as DOMNode[])} />;
                }

                if (domNode.name === "customcarouselslider") {
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <CustomCarouselSlider data={Array.isArray(children) ? children : [children]} />
                }
                if (domNode.name === "rotatingslider") {
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <RotatingSlider data={Array.isArray(children) ? children : [children]} />
                }

                if (domNode.name === "customreadmore") {
                    const props = attributesToProps(domNode.attribs);
                    return <ReadMore {...props} data={domToReact(domNode.children as DOMNode[])} />;
                }
                if (domNode.name === "customzoomscrolleffectv2") {
                    const props = attributesToProps(domNode.attribs);
                    return <CustomZoomScrollEffectV2 {...props} videourl={String(props.videourl)} />;
                }
                if (domNode.name === "bentosyncreveal") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <BentoSyncReveal props={props} data={Array.isArray(children) ? children : [children]} />;
                }


                if (domNode.name === "customreadmoremodal") {
                    const props = attributesToProps(domNode.attribs);
                    return <ReadMoreModal {...props} data={domToReact(domNode.children as DOMNode[])} />;
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
                if (domNode.name === "customworldmap") {
                    const props = attributesToProps(domNode.attribs);
                    return (
                        <CustomWorldMap
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
                if (domNode.name === "customcontentslider") {
                    const props = attributesToProps(domNode.attribs);
                    return <CustomContentSlider {...props} data={domToReact(domNode.children as DOMNode[])} />;
                }
                if (domNode.name === "podcastslider") {
                    const props = attributesToProps(domNode.attribs);
                    return <PodcastSlider {...props} data={domToReact(domNode.children as DOMNode[])} />;
                }
                if (domNode.name === "customslider") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <CustomSilder {...props} data={Array.isArray(children) ? children : [children]} />;
                }
                if (domNode.name === "stackslider") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <StackSlider {...props} data={Array.isArray(children) ? children : [children]} />;
                }
                if (domNode.name === "timelineslider") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <TimelineSlider {...props}>{children}</TimelineSlider>;
                }
                if (domNode.name === "customhorizontalscroll") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <CustomHorizontalScroll {...props} data={Array.isArray(children) ? children : [children]} />;
                }
                if (domNode.name === "horizontalscrollsecton") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <HorizontalScrollSecton {...props} data={Array.isArray(children) ? children : [children]} />;
                }

                if (domNode.name === "customwheelsection") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <CustomWheelSection {...props}>
                        {children}
                    </CustomWheelSection>;
                }

                if (domNode.name === "circleslider") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <CircleSlider props={props} data={Array.isArray(children) ? children : [children]} />;
                }
                if (domNode.name === "jobform") {
                    // const props = attributesToProps(domNode.attribs);
                    // const children = domToReact(domNode.children as DOMNode[]);
                    return <JobForm />;
                }

                if (domNode.name === "categoryslider") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <CategorySlider />;
                }
                if (domNode.name === "customstickycard") {
                    const props = attributesToProps(domNode.attribs);
                    return <CustomStickyCard
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
                    />;
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
                if (domNode.name === "genericslidewrapper") {
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
                    return <GenericSlideWrapper {...props} data={Array.isArray(children) ? children : [children]} />;
                }
                if (domNode.name === "customtabs") {
                    const props = attributesToProps(domNode.attribs);
                    return <Tabs {...props} data={domToReact(domNode.children as DOMNode[])} />;
                }
                // ✅ Universal fix for self-closing tags
                if (domNode instanceof Element && domNode.name?.startsWith("source")) {
                    const props = attributesToProps(domNode.attribs);
                    return <source {...props} />;
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

'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';

const CardSwipeSlider = () => {
    const [pluginReady, setPluginReady] = useState(false);

    useEffect(() => {
        // 👇 wait until window.Swiper exists
        if ((window as any).Swiper && (window as any).EffectMaterial) {
            setPluginReady(true);
        }
    }, []);

    const slides = [
        <div className="swiper-material-wrapper border-radius-20">
             <Link href="https://www.jindalsteel.in/products/hollow-sections" className="swiper-material-content">
                <img className="demo-material-image" data-swiper-material-scale="1.25" src="https://docs.jindalsteel.in/document/124/1778136524_Hollow-Sections-img2.jpg" />
                <span className="demo-material-label swiper-material-animate-opacity">Hollow Sections</span>
            </Link>
        </div>, 
        <div className="swiper-material-wrapper border-radius-20">
             <Link href="https://www.jindalsteel.in/products/rails" className="swiper-material-content"> 
                <img className="demo-material-image" data-swiper-material-scale="1.25" src="https://d2lptvt2jijg6f.cloudfront.net/document/126/1767876149_Rails.jpg" />
                <span className="demo-material-label swiper-material-animate-opacity">Rails</span>
            </Link>
        </div>,

        <div className="swiper-material-wrapper border-radius-20">  
            <Link href="https://www.jindalsteel.in/products/parallel-flange-beams-columns" className="swiper-material-content">
                <img className="demo-material-image" data-swiper-material-scale="1.25" src="https://d2lptvt2jijg6f.cloudfront.net/document/126/1767875547_Beams.jpg" />
                <span className="demo-material-label swiper-material-animate-opacity">Parallel Flange Beams & Columns</span>
            </Link>
        </div>,

        <div className="swiper-material-wrapper border-radius-20">
            <Link href="https://www.jindalsteel.in/products/plates-coils" className="swiper-material-content">
                <img className="demo-material-image" data-swiper-material-scale="1.25" src="https://d2lptvt2jijg6f.cloudfront.net/document/126/1767876467_Plates.jpg" />
                <span className="demo-material-label swiper-material-animate-opacity">Plates & Coils</span>
            </Link>
        </div>,

        <div className="swiper-material-wrapper border-radius-20">
            <Link href="https://www.jindalsteel.in/products/angles-channels" className="swiper-material-content">
                <img className="demo-material-image" data-swiper-material-scale="1.25" src="https://docs.jindalsteel.in/document/124/1778071767_1698411338angles-channels1.jpg" />
                <span className="demo-material-label swiper-material-animate-opacity">Angles & Channels</span> 
            </Link>
        </div>,

        <div className="swiper-material-wrapper border-radius-20">
            <Link href="https://www.jindalsteel.in/products/wire-rods" className="swiper-material-content">
                <img className="demo-material-image" data-swiper-material-scale="1.25" src="https://d2lptvt2jijg6f.cloudfront.net/document/126/1767876575_Wire-Rods.jpg" />
                <span className="demo-material-label swiper-material-animate-opacity">Wire Rods</span>
            </Link>
        </div>,
        
        <div className="swiper-material-wrapper border-radius-20">
             <Link href="https://www.jindalsteel.in/products/round-bars" className="swiper-material-content"> 
                <img className="demo-material-image" data-swiper-material-scale="1.25" src="https://docs.jindalsteel.in/document/124/1778131307_1698475929round-bar-banner1.jpg" />
                <span className="demo-material-label swiper-material-animate-opacity">Round Bars</span>
            </Link>
        </div>,
      
        
        <div className="swiper-material-wrapper border-radius-20">
             <Link href="https://www.jindalsteel.in/products/fabricated-sections" className="swiper-material-content"> 
                <img className="demo-material-image" data-swiper-material-scale="1.25" src="https://docs.jindalsteel.in/document/124/1774261479_1698479600fabricated-sectionbanner1.jpg" />
                <span className="demo-material-label swiper-material-animate-opacity">Fabricated Sections</span>
            </Link>
        </div>,
        
        
        <div className="swiper-material-wrapper border-radius-20">
            <Link  href="https://www.jindalsteel.in/products/speedfloor" className="swiper-material-content">
                <img className="demo-material-image" data-swiper-material-scale="1.25" src="https://d2lptvt2jijg6f.cloudfront.net/document/126/1767876671_Speedfloor.jpg" />
                <span className="demo-material-label swiper-material-animate-opacity">Speedfloor</span>
            </Link>
        </div>,

        <div className="swiper-material-wrapper border-radius-20">
            <Link  href="https://www.jindalsteel.in/products/semi-finished" className="swiper-material-content">
                <img className="demo-material-image" data-swiper-material-scale="1.25" src="https://docs.jindalsteel.in/document/124/1774343517_1698491709semifinished-banner1.jpg" />
                <span className="demo-material-label swiper-material-animate-opacity">Semi-Finished</span> 
            </Link>
        </div>,

        <div className="swiper-material-wrapper border-radius-20">
            <Link  href="https://www.jindalsteel.in/products/jindal-panther-tmt-rebars" className="swiper-material-content">
                <img className="demo-material-image" data-swiper-material-scale="1.25" src="https://docs.jindalsteel.in/document/124/1778072708_1763381495_1761223450_Company-Camina.jpg" />
                <span className="demo-material-label swiper-material-animate-opacity">Jindal Panther TMT Rebars</span> 
            </Link>
        </div>,

        <div className="swiper-material-wrapper border-radius-20">
            <Link  href="https://www.jindalsteel.in/products/jindal-panther-cement" className="swiper-material-content">
                <img className="demo-material-image" data-swiper-material-scale="1.25" src="https://docs.jindalsteel.in/document/124/1774420252_1698496086jindal-panther-cement-banner1.jpg" />
                <span className="demo-material-label swiper-material-animate-opacity">Jindal Panther Cement</span> 
            </Link>
        </div>
    ];

    return (
        <>
            <Script
                src="/swiper-effects/effect-material.min.js"
                strategy="afterInteractive"
                onReady={() => {
                    // expose plugin if it attaches globally
                    setTimeout(() => {
                        if ((window as any).EffectMaterial) {
                            setPluginReady(true);
                        }
                    }, 0);
                }}
            />
            {pluginReady && (
                <Swiper
                    modules={[Navigation, Pagination, Autoplay, (window as any).EffectMaterial]}
                    effect="material"
                    grabCursor
                    slidesPerView={1}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                    }}
                    spaceBetween={16}
                    speed={600}
                    loop
                    pagination={{ clickable: true }}
                    onBeforeInit={(swiper: SwiperClass) => {
                        // inject paid params (TS-safe)
                        //const spv = swiper.params.slidesPerView as number;
                        const ratio = 0.65;
                        (swiper.params as any).materialEffect = {
                            slideSplitRatio: ratio,
                        };
                    }}
                    onSwiper={(swiper: SwiperClass) => {
                        // 🔥 FORCE autoplay after Material effect is ready
                        setTimeout(() => {
                            if (swiper.autoplay) {
                                swiper.autoplay.start();
                            }
                        }, 0);
                    }}
                    className="swiper swiper-material mw-100"
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            {slide}
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </>
    )
}

export default CardSwipeSlider;
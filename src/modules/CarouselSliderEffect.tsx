"use client";

export default function CarouselSliderEffect({
    swiper,
    on,
    extendParams,
}: any) {
    extendParams({
        carouselEffect: {
            opacityStep: 0.33,
            scaleStep: 0.2,
            sideSlides: 2,
        },
    });

    // ------------------------------------
    // INIT
    // ------------------------------------
    on("beforeInit", () => {
        if (swiper.params.effect !== "carousel") return;

        swiper.classNames.push(
            `${swiper.params.containerModifierClass}carousel`
        );

        const overwriteParams = {
            watchSlidesProgress: true,
            centeredSlides: true,
        };

        Object.assign(swiper.params, overwriteParams);
        Object.assign(swiper.originalParams, overwriteParams);
    });

    // ------------------------------------
    // PROGRESS (TX FIXED)
    // ------------------------------------
    on("progress", () => {
        if (swiper.params.effect !== "carousel") return;

        const { scaleStep, opacityStep } = swiper.params.carouselEffect;

        const sideSlides = Math.max(
            Math.min(swiper.params.carouselEffect.sideSlides, 3),
            1
        );

        const modifyMultiplierMap: any = {
            1: 2,
            2: 1,
            3: 0.2,
        };

        const translateModifierMap: any = {
            1: 50,
            2: 50,
            3: 67,
        };

        const modifyMultiplier = modifyMultiplierMap[sideSlides];
        const translateModifier = translateModifierMap[sideSlides];

        const zIndexMax = swiper.slides.length;

        for (let i = 0; i < swiper.slides.length; i += 1) {
            const slideEl = swiper.slides[i];
            const progress = slideEl.progress;

            // 🔑 KEY FIX
            const absProgress = Math.abs(progress);
            const direction = progress < 0 ? -1 : 1;

            let modify = 1;
            if (absProgress > 1) {
                modify =
                    (absProgress - 1) * 0.3 * modifyMultiplier + 1;
            }

            // ✅ TX FIXED (direction × distance)
            const translate = `${direction *
                absProgress *
                modify *
                translateModifier *
                (swiper.rtlTranslate ? -1 : 1)
                }%`;

            const scale = Math.max(
                1 - absProgress * scaleStep,
                0.6
            );

            const zIndex = zIndexMax - Math.floor(absProgress);

            slideEl.style.transform = `translateX(${translate}) scale(${scale})`;
            slideEl.style.zIndex = zIndex;
            slideEl.style.opacity =
                absProgress > sideSlides + 1 ? "0" : "1";

            const opacityEls = slideEl.querySelectorAll(
                ".swiper-carousel-animate-opacity"
            );

            opacityEls.forEach((el: HTMLElement) => {
                el.style.opacity = `${1 - absProgress * opacityStep}`;
            });
        }
    });

    // ------------------------------------
    // RESIZE
    // ------------------------------------
    on("resize", () => {
        if (
            swiper.virtual &&
            swiper.params.virtual &&
            swiper.params.virtual.enabled
        ) {
            requestAnimationFrame(() => {
                if (swiper.destroyed) return;
                swiper.updateSlides();
                swiper.updateProgress();
            });
        }
    });

    // ------------------------------------
    // TRANSITION
    // ------------------------------------
    on("setTransition", (_s: any, duration: number) => {
        if (swiper.params.effect !== "carousel") return;

        for (let i = 0; i < swiper.slides.length; i += 1) {
            const slideEl = swiper.slides[i];
            slideEl.style.transitionDuration = `${duration}ms`;

            const opacityEls = slideEl.querySelectorAll(
                ".swiper-carousel-animate-opacity"
            );

            opacityEls.forEach((el: HTMLElement) => {
                el.style.transitionDuration = `${duration}ms`;
            });
        }
    });
}

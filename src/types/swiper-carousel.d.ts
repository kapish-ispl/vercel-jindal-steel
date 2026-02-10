import type { SwiperOptions } from "swiper/types";

declare module "swiper/types" {
  interface SwiperOptions {
    carouselEffect?: {
      opacityStep?: number;
      scaleStep?: number;
      sideSlides?: number;
    };
  }
}

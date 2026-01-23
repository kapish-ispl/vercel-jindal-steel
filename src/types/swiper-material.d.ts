import 'swiper';
import 'swiper/react';

declare module 'swiper' {
  interface SwiperOptions {
    materialEffect?: any;
  }
}

declare module 'swiper/react' {
  interface SwiperProps {
    materialEffect?: any;
  }
}

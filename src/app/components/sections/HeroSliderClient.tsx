"use client";

import Link from "next/link";
import LazyImage from "@/app/components/ui/LazyImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { SlideItem } from "@/app/utils";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface HeroSliderClientProps {
  slides: SlideItem[];
}

export default function HeroSliderClient({ slides }: HeroSliderClientProps) {
  return (
    <section className="relative w-full h-156 overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: ".hero-button-next",
          prevEl: ".hero-button-prev",
        }}
        pagination={{
          clickable: true,
          dynamicBullets: false,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        loop={true}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <LazyImage
                src={slide.imageUrl}
                alt={slide.title}
                fill
                className="object-cover z-0"
                priority={index === 0} // Only prioritize first slide
                sizes="100vw"
              />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="max-w-4xl mx-auto px-4 text-center text-white">
                  <div className="space-y-4">
                    <h2
                      className="text-4xl md:text-5xl lg:text-6xl font-bold"
                      style={{ color: "#F58C28" }}
                    >
                      {slide.title}
                    </h2>
                    {/* {slide.subtitle && ( */}
                    {/*   <h3 */}
                    {/*     className="text-xl md:text-2xl lg:text-3xl font-medium" */}
                    {/*     style={{ color: "#F58C28" }} */}
                    {/*   > */}
                    {/*     {slide.subtitle} */}
                    {/*   </h3> */}
                    {/* )} */}
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                      {slide.description}
                    </p>
                    <div className="pt-6">
                      <Link
                        href={slide.linkUrl}
                        target={slide.linkTarget || "_self"}
                        className="px-4 py-2 border-2 rounded-sm border-orange-400 text-2xl  transition-colors duration-200 shadow-lg hover:shadow-xl"
                        // className="inline-block text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                        style={{ backgroundColor: "transparent" }}
                        onMouseEnter={(e) =>{
                          e.currentTarget.style.backgroundColor = "#E67C1F"
                            e.currentTarget.style.color = 'white';
                        }
                        }
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent"
                          e.currentTarget.style.color = '';
                        }
                        }
                      >
                        {slide.linkText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons - Hidden on mobile */}
        <div className="hero-button-prev absolute left-4 top-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200 z-30 cursor-pointer hidden md:block">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="hero-button-next absolute right-4 top-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200 z-30 cursor-pointer hidden md:block">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

      </Swiper>

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transition: all 0.2s;
          margin: 0 4px !important;
        }

        .swiper-pagination-bullet-active {
          background: white;
          transform: scale(1.2);
        }

        .swiper-pagination {
          bottom: 120px !important;
          position: absolute !important;
          z-index: 30;
        }

        .hero-button-prev,
        .hero-button-next {
          transform: translateY(-50%);
        }
        
        .hero-button-prev:hover,
        .hero-button-next:hover {
          transform: translateY(-50%) scale(1.1);
        }
      `}</style>
    </section>
  );
}
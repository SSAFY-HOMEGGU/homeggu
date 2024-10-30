"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

export default function ImageSwiper({ 
  images, 
  swiperHeight = "h-full", 
  swiperWidth = "w-full", 
  arrowSize = "text-3xl", 
  arrowColor = "text-point2", 
  paginationColor = "bg-gray-500", 
  paginationSize = "w-3 h-3",
  imageWidth = 1920,  // 기본값 추가
  imageHeight = 1080  // 기본값 추가
}) {
  return (
    <div className={`relative ${swiperWidth} ${swiperHeight}`}>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={{
          clickable: true,
          bulletClass: `swiper-pagination-bullet ${paginationColor} ${paginationSize}`,
        }}
        modules={[Autoplay, Navigation, Pagination]}
        className={`${swiperWidth} ${swiperHeight}`} // Swiper 전체 크기 설정
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="flex items-center justify-center bg-white text-lg">
            {/* <div className="relative w-full h-[10rem]"> */}
            <div className="relative w-full h-full">
              <Image
                src={image.src}
                alt={image.alt || "slide image"}
                width={imageWidth}
                height={imageHeight}
                className="rounded-lg"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className={`swiper-button-prev-custom absolute top-1/2 left-4 transform -translate-y-1/2 z-10 cursor-pointer ${arrowSize} ${arrowColor}`}
      >
        <IoIosArrowBack />
      </div>
      <div
        className={`swiper-button-next-custom absolute top-1/2 right-4 transform -translate-y-1/2 z-10 cursor-pointer ${arrowSize} ${arrowColor}`}
      >
        <IoIosArrowForward />
      </div>
    </div>
  );
}

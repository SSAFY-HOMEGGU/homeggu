"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

export default function ImageSwiper({ images }) {
  return (
    <div className="relative w-full h-full">
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      // navigation={true}
      navigation={{
        nextEl: ".swiper-button-next-custom",
        prevEl: ".swiper-button-prev-custom",
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Navigation, Pagination]}
      className="w-full h-full" // Swiper 전체 크기 설정
    >
      {images.map((image, index) => (
        <SwiperSlide key={index} className="flex items-center justify-center bg-white text-lg">
          <div className="relative w-full h-[10rem]">
            <Image
              src={image.src}
              alt={image.alt || "slide image"}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
    <div className="swiper-button-prev-custom absolute top-1/2 left-4 transform -translate-y-1/2 z-10 cursor-pointer text-3xl text-point2">
        <IoIosArrowBack />
      </div>
      <div className="swiper-button-next-custom absolute top-1/2 right-4 transform -translate-y-1/2 z-10 cursor-pointer text-3xl text-point2">
        <IoIosArrowForward />
      </div>
    </div>
  );
}

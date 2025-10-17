"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import "./ProductGallery.scss";

interface ProductGalleryProps {
  imageSlide: string[];
  alt: string;
}

export default function ProductGallery({ imageSlide, alt }: ProductGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  return (
    <div className="product-gallery">
      {/* Swiper chính */}
      <Swiper
        spaceBetween={10}
        navigation
        modules={[Navigation, Thumbs]}
        thumbs={{ swiper: thumbsSwiper }}
        className="gallery-main"
      >
        {imageSlide.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="gallery-image">
              <Image
                src={src}
                alt={`${alt} ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Swiper thumbnails */}
      <Swiper
        onSwiper={setThumbsSwiper}
        modules={[Thumbs]}
        watchSlidesProgress
        spaceBetween={20}
        slidesPerView={5}
        freeMode
        slideToClickedSlide
        className="gallery-thumbs"
      >
        {imageSlide.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="thumb-image">
              <Image
                src={src}
                alt={`${alt} thumbnail ${index + 1}`}
                width={80}
                height={80}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

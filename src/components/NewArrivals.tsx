"use client";

import Link from "next/link";
import { products } from "@/data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import ProductCard from "./ProductCard";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
// import "./NewArrivals.scss";

export default function NewArrivals() {
  // Lọc sản phẩm mới trong 30 ngày
  const newArrivals = products
    .filter((p) => {
      if (!p.createdAt) return false;
      const release = new Date(p.createdAt);
      const now = new Date();
      const diffDays = (now.getTime() - release.getTime()) / (1000 * 60 * 60 * 24); // 1 giây = 1000 ms; 1 phút = 60 giây; 1 giờ = 60 phút; 1 ngày = 24 giờ; → 1 ngày = 1000 * 60 * 60 * 24 = 86,400,000 ms
      return diffDays <= 30; // sản phẩm ra mắt trong vòng 30 ngày
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);
  

  if (newArrivals.length === 0) return null; // Không hiển thị nếu không có sản phẩm mới

  return (
    <div className="product-section new-arrivals">
      <div className="box-head">
        <strong className="text-title">New Arrivals</strong>
        <div className="btn-box">
          <Link href="#none" className="btn-all">see all</Link>
        </div>
      </div>
      <div className="box-content">
        <Swiper
          className="swiper-product-home swiper-custom"
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={2}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {newArrivals.map((item) => (
            <SwiperSlide key={item.id} className="item-product-home">
              <ProductCard {...item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

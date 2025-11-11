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
// import "./BestSeller.scss";

export default function BestSeller() {
  const bestSellers = products
    .filter(p => p.rating >= 4.5) // chỉ lấy sp rating cao
    .sort((a, b) => b.rating - a.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // sắp xếp giảm dần
    .slice(0, 8); // giới hạn số lượng dụ 8 sp
  
  if (bestSellers.length === 0) return null; // Không hiển thị nếu không có sản phẩm Best Sellers

  return (
    <div className="product-section best-seller">
      <div className="box-head">
        <strong className="text-title">Best Sellers</strong>
        <div className="btn-box">
          <Link href="/best-sell" className="btn-all">see all</Link>
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
          {bestSellers.map((item) => (
            <SwiperSlide key={item.id} className="item-product-home">
              <ProductCard {...item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

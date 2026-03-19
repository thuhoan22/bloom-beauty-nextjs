"use client";

import { useState, useEffect  } from "react";
import Link from "next/link";
// import { products } from "@/data/products";
import { getProducts } from "@/lib/product.api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import ProductCard from "./ProductCard";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
// import "./NewArrivals.scss";

export default function NewArrivals() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  if (!products.length) return null;

  // Tìm ngày mới nhất trong danh sách sản phẩm
  const latestDate = products.reduce((max, p) => {
    if (!p.createdAt) return max;
    const date = new Date(p.createdAt);
    return date > max ? date : max;
  }, new Date(0));

  // Mốc 30 ngày trước ngày mới nhất
  const threshold = new Date(latestDate.getTime() - 30 * 24 * 60 * 60 * 1000); //30days, 24hours, 60minus, 60seconds, 1000milliseconds

  // Lọc sản phẩm mới trong 30 ngày gần nhất
  const newArrivals = products
    .filter((p) => {
      if (!p.createdAt) return false;
      return new Date(p.createdAt) >= threshold;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  if (!newArrivals.length) return null; // Không hiển thị nếu không có sản phẩm mới

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

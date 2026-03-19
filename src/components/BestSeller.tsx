"use client";

import { useState, useEffect  } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/product.api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import ProductCard from "./ProductCard";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
// import "./BestSeller.scss";

export default function BestSeller() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  if (!products.length) return null;

  const bestSellers = products
    .filter((p) => (p.rating ?? 0) >= 4.5) // chỉ lấy sp rating cao
    .sort((a, b) => {
      const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);

      if (ratingDiff !== 0) return ratingDiff;

      // fallback theo ngày
      const dateA = new Date(a.createdAt ?? a.created_at ?? 0).getTime();
      const dateB = new Date(b.createdAt ?? b.created_at ?? 0).getTime();

      return dateB - dateA;  // sắp xếp giảm dần
    })
    .slice(0, 8);
    
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

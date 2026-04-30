"use client";

import { useState, useEffect  } from "react";
import Link from "next/link";
import { getBestSellers } from "@/lib/product.api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import ProductCard from "./ProductCard";
// import "./BestSeller.scss";

export default function BestSeller() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    getBestSellers().then(setProducts);
  }, []);

  if (!products.length) return null;

  const bestSellers = products
    .filter((p) => (p.rating ?? 0) >= 4.5) // giữ lại điều kiện cũ
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
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            501: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1120: { slidesPerView: 4 },
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

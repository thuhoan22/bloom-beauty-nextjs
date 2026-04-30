"use client";

import { useState, useEffect  } from "react";
import Link from "next/link";
// import { products } from "@/data/products";
import { getNewArrivalsProducts } from "@/lib/product.api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import ProductCard from "./ProductCard";
// import "./NewArrivals.scss";

export default function NewArrivals() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    getNewArrivalsProducts(8).then(setProducts);
  }, []);

  if (!products.length) return null;

  const newArrivals = products;

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
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            501: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1120: { slidesPerView: 4 },
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

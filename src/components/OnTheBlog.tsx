"use client";

import Link from "next/link";
import { blogs } from "@/data/blogs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import BlogCard from "./BlogCard";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
// import "./OnTheBlog.scss";

export default function OnTheBlog() {
  const blog = blogs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  if (blog.length === 0) return null;

  return (
    <div className="product-section product-blog">
      <div className="box-head">
        <strong className="text-title">On The Blog</strong>
        <div className="btn-box">
          <Link href="/blogs" className="btn-all">see all</Link>
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
            1024: { slidesPerView: 3 },
          }}
        >
          {blog.map((item) => (
            <SwiperSlide key={item.id} className="item-product-home">
              <BlogCard {...item} showDate={false} showTags={false} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

"use client";

import { useEffect, useRef, useState } from "react";
import { getBlogs } from "@/lib/blog.api";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import BlogCard from "@/components/BlogCard";
import Pagination from "@/components/Pagination"; 

gsap.registerPlugin(ScrollTrigger);

import "./BlogList.scss";

export default function BlogList() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  useEffect(() => {
    getBlogs().then(setBlogs);
  }, []);

  const containerRef = useRef<HTMLDivElement | null>(null);
  useGSAP(() => {
    const blogItem = gsap.utils.toArray<HTMLElement>(".blog-item");

    blogItem.forEach((blog) => {
      const thumbs = blog.querySelectorAll(".thumb");
      
      if (!thumbs.length) return;

      gsap.from(thumbs, {
        scrollTrigger: {
          trigger: blog,
          start: "top 80%",
        },
        opacity: 0,
        y: 80,
        duration: 1,
        ease: "power1.in",
        stagger: 0.25,
      });
    });

    blogItem.forEach((blog) => {
      const infors = blog.querySelectorAll(".blog-info");
      
      if (!infors.length) return;

      gsap.from(infors, {
        scrollTrigger: {
          trigger: blog,
          start: "top 80%",
        },
        opacity: 0,
        duration: 1,
        ease: "power1.in",
      });
    });
  },
    { scope: containerRef, dependencies: [blogs] }
  );

  // SORT (mới → cũ)
  const sortedBlogs = [...blogs].sort((a, b) => {
    const dateA = new Date(a.date ?? a.created_at ?? 0).getTime();
    const dateB = new Date(b.date ?? b.created_at ?? 0).getTime();
    return dateB - dateA;
  });

  // Phân trang:
  const totalPages = Math.ceil(sortedBlogs.length / itemsPerPage);
  // Phân chia danh sách theo trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBlogs = sortedBlogs.slice(startIndex, startIndex + itemsPerPage);
  //[E] Phân trang

  return (
    <main className="main-content blog-page">
      <div className="inner" ref={containerRef}>
        <div className="blog-list">
          {currentBlogs.map((item) => (
            <BlogCard key={item.id} {...item} />
          ))}
        </div>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </main>
  )
}

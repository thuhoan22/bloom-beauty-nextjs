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

export default function BlogList({ initialBlogs = [] }: { initialBlogs?: any[] }) {
  const [blogs, setBlogs] = useState<any[]>(initialBlogs);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const containerRef = useRef<HTMLDivElement | null>(null);
  // SORT (mới → cũ)
  const sortedBlogs = [...blogs].sort((a, b) => {
    const dateA = new Date(a.date ?? 0).getTime();
    const dateB = new Date(b.date ?? 0).getTime();
    return dateB - dateA;
  });

  // Phân trang:
  const totalPages = Math.ceil(sortedBlogs.length / itemsPerPage);
  // Phân chia danh sách theo trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBlogs = sortedBlogs.slice(startIndex, startIndex + itemsPerPage);
  //[E] Phân trang
  
  useEffect(() => {
    // If server already provided data, skip client refetch.
    if (initialBlogs.length > 0) return;
    getBlogs().then(setBlogs);
  }, [initialBlogs.length]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [currentPage]);

  useGSAP(
    () => {
      const blogItems = gsap.utils.toArray<HTMLElement>(".blog-item");

      blogItems.forEach((blog) => {
        const thumbs = blog.querySelectorAll<HTMLElement>(".thumb");
        const infors = blog.querySelectorAll<HTMLElement>(".blog-info");

        if (thumbs.length) {
          gsap.from(thumbs, {
            scrollTrigger: {
              trigger: blog,
              start: "top 85%",
              once: true,
            },
            opacity: 0,
            y: 80,
            duration: 1,
            ease: "power1.out",
            stagger: 0.25,
          });
        }

        if (infors.length) {
          gsap.from(infors, {
            scrollTrigger: {
              trigger: blog,
              start: "top 85%",
              once: true,
            },
            opacity: 0,
            duration: 1,
            ease: "power1.out",
          });
        }
      });

      // Quan trọng với mobile
      ScrollTrigger.refresh();
    },
    {
      scope: containerRef,
      dependencies: [currentBlogs],
    }
  );

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

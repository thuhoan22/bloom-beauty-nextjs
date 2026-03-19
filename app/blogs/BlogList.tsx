"use client";

import { useEffect, useState } from "react";
import { getBlogs } from "@/lib/blog.api";
import BlogCard from "@/components/BlogCard";
import Pagination from "@/components/Pagination"; 

import "./BlogList.scss";

export default function BlogList() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  useEffect(() => {
    getBlogs().then(setBlogs);
  }, []);

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
      <div className="inner">
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

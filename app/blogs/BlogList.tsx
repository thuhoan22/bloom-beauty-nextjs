"use client";

import { useState } from "react";
import { blogs } from "@/data/blogs";
import BlogCard from "@/components/BlogCard";
import Pagination from "@/components/Pagination"; 

import "./BlogList.scss";

export default function BlogList() {
  // Phân trang:
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(blogs.length / itemsPerPage);

  // Phân chia danh sách theo trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBlogs = blogs.slice(startIndex, startIndex + itemsPerPage);
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

"use client"

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination"; 

import "./SearchPage.scss"

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q")?.toLowerCase() || "";

  // Nếu không có keyword → không cần search
  const results = keyword
    ? products.filter((item) =>
        item.name.toLowerCase().includes(keyword)
      )
    : [];

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = results.slice(startIndex, startIndex + itemsPerPage);
  // [E] Phân trang

  return (
    <main className="main-content search-page">
      <div className="inner">
        <div className="box-content">
          <h2 className="text-result">Search results for "{keyword}"</h2>
          <div className="product-list">
            {currentProducts.map((item) => (
              <ProductCard 
                key={item.id}
                {...item}
              />
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
      </div>
    </main>
  )
}

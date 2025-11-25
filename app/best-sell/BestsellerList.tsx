"use client";

import { useEffect, useState } from "react";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";
import Pagination from "@/components/Pagination"; 

import "../products/ProductList.scss";

interface FilterValues {
  productType: string[];
  skinType: string[];
  priceRange: string | null;
}

export default function BestsellerList() {
  const bestSellers = products
    .filter(p => p.rating >= 4.5) // chỉ lấy sp rating cao
    .sort((a, b) => b.rating - a.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // sắp xếp giảm dần
  
  if (bestSellers.length === 0) return null; // Không hiển thị nếu không có sản phẩm Best Sellers

  //[S] Lọc:
  // Lưu filter mà user đã chọn
  const [filters, setFilters] = useState<FilterValues>({
    productType: [],
    skinType: [],
    priceRange: null,
  });

  // Tạo biến để kiểm tra có điều kiện lọc hay không
  const isFiltered =
    (filters.productType?.length ?? 0) > 0 ||
    (filters.skinType?.length ?? 0) > 0 ||
    (filters.priceRange ?? '') !== '';

  // Nhận filter từ ProductFilter
  const handleApplyFilters = (newFilters: FilterValues) => {
    console.log("Filters applied:", newFilters);
    setFilters(newFilters);
    setCurrentPage(1); // reset về trang đầu khi lọc
  };

  // Lọc sản phẩm dựa trên filters
  const filteredProducts = bestSellers.filter((p) => {
    // Lọc theo productType
    if (filters.productType.length > 0 && !filters.productType.includes(p.category)) {
      return false;
    }

    // Lọc theo skinType
    if (filters.skinType.length > 0 && !p.details?.typeSkin?.some((s: string) => filters.skinType.includes(s))) {
      return false;
    }

    // Lọc theo priceRange
    if (filters.priceRange) {
      const price = p.sale > 0 ? p.price * (1 - p.sale / 100) : p.price;

      if (
        (filters.priceRange === "Under $25" && price >= 25) ||
        (filters.priceRange === "$25 - $50" && (price < 25 || price > 50)) ||
        (filters.priceRange === "$50 - $100" && (price < 50 || price > 100)) ||
        (filters.priceRange === "Over $100" && price <= 100)
      ) {
        return false;
      }
    }
    return true;
  });
  //[E] Lọc


  // Sắp xếp
  const [sortOption, setSortOption] = useState("Default");
  const [isOpen, setIsOpen] = useState(false);
  const options = ["Default", "Low to High", "High to Low"];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".select-box")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const getFinalPrice = (p: any) => (p.sale > 0 ? p.price * (1 - p.sale / 100) : p.price); // Hàm tính giá cuối cùng của 1 sản phẩm (đã áp dụng sale)

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "Low to High") {
      return getFinalPrice(a) - getFinalPrice(b);
    }
    if (sortOption === "High to Low") {
      return getFinalPrice(b) - getFinalPrice(a);
    }
    return 0; // Default (không sort)
  });
  // [E] Sắp xếp

  // Phân trang:
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortOption]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  // Phân chia danh sách theo trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  // const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  //[E] Phân trang

  return (
  <main className="main-content product-page">
    <div className="inner">
      <div className="box-content">
        <ProductFilter onApply={handleApplyFilters} />
        <div className="product-area">
          <div className="product-sort">
            <span className="text-total">
              {isFiltered ? (
                <>
                  <em>{filteredProducts.length}</em> / {bestSellers.length} PRODUCT
                </>
              ) : (
                <><em>{bestSellers.length}</em> PRODUCT</>
              )}
            </span>
            <div className="sort-area">
              <span className="text">Sort by</span>
              <div className={`select-box ${isOpen ? "is-open" : ""}`}>
                <button 
                  type="button" 
                  className="btn-select" 
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className="select-value">{sortOption}</span>
                </button>
                {isOpen && (
                  <ul className="select-list">
                    {options.map((opt) => (
                      <li
                        key={opt}
                        className="select-item"
                        onClick={() => {
                          setSortOption(opt);
                          setIsOpen(false);
                        }}
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="product-list">
            {currentProducts.length > 0 ? (
              currentProducts.map((item) => (
                <ProductCard 
                  key={item.id}
                  {...item}
                />
              ))
            ) : (
              <p className="no-result">No products found</p>
            )}
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
    </div>
  </main>
  )
}

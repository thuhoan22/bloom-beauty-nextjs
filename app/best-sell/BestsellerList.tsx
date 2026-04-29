"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/product.api";
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
  const [products, setProducts] = useState<any[]>([]);

  const [filters, setFilters] = useState<FilterValues>({
    productType: [],
    skinType: [],
    priceRange: null,
  });

  const [sortOption, setSortOption] = useState("Default");
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // fetch data
  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  // close dropdown khi click ngoài
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".select-box")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // reset page khi filter/sort
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortOption]);

  if (!products.length) return null;

  // BEST SELLER
  const bestSellers = products
    .filter((p) => (p.rating ?? 0) >= 4.8) // chỉ lấy sp rating cao
    .sort((a, b) => {
      const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
      if (ratingDiff !== 0) return ratingDiff;

      const dateA = new Date(a.createdAt ?? a.created_at ?? 0).getTime();
      const dateB = new Date(b.createdAt ?? b.created_at ?? 0).getTime();

      return dateB - dateA;  // sắp xếp giảm dần
    });

  // FILTER
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

  // SORT
  const getFinalPrice = (p: any) =>
    p.sale > 0 ? p.price * (1 - p.sale / 100) : p.price; // Hàm tính giá cuối cùng của 1 sản phẩm (đã áp dụng sale)


  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "Low to High") {
      return getFinalPrice(a) - getFinalPrice(b);
    }
    if (sortOption === "High to Low") {
      return getFinalPrice(b) - getFinalPrice(a);
    }
    return 0;
  });

  // PAGINATION
  const totalPages = Math.ceil(
    sortedProducts.length / itemsPerPage
  );

  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

   // Tạo biến để kiểm tra có điều kiện lọc hay không
  const isFiltered =
    filters.productType.length > 0 ||
    filters.skinType.length > 0 ||
    !!filters.priceRange;

  const options = ["Default", "Low to High", "High to Low"];
  
  if (bestSellers.length === 0) return null; // Không hiển thị nếu không có sản phẩm Best Sellers

  // Nhận filter từ ProductFilter
  const handleApplyFilters = (newFilters: FilterValues) => {
    console.log("Filters applied:", newFilters);
    setFilters(newFilters);
    setCurrentPage(1); // reset về trang đầu khi lọc
  };
  

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

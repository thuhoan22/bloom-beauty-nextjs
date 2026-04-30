"use client";

import { useEffect, useState } from "react";
import { getBestSellerProducts } from "@/lib/product.api";
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

  // Applied filters: chỉ thay đổi khi bấm Apply
  const [filters, setFilters] = useState<FilterValues>({
    productType: [],
    skinType: [],
    priceRange: null,
  });

  // Draft filters: thay đổi khi click checkbox/radio (chưa áp dụng)
  const [draftFilters, setDraftFilters] = useState<FilterValues>({
    productType: [],
    skinType: [],
    priceRange: null,
  });

  // MOBILE
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sắp xếp
  const [sortOption, setSortOption] = useState("High to Low");
  const [isOpen, setIsOpen] = useState(false);
  const options = ["Default", "Low to High", "High to Low"];

  // Phân trang:
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);

  // fetch data
  useEffect(() => {
    getBestSellerProducts().then(setProducts);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".select-box")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortOption, itemsPerPage]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setItemsPerPage(6);
      } else {
        setItemsPerPage(9);
      }
    };

    handleResize(); // chạy lần đầu
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getFinalPrice = (p: any) => (p.sale > 0 ? p.price * (1 - p.sale / 100) : p.price); // Hàm tính giá cuối cùng của 1 sản phẩm (đã áp dụng sale)

  if (!products.length) return null;

  // BEST SELLER
  // Data đã được query rating >= 4.8, giữ lại điều kiện và sort fallback như logic cũ.
  const bestSellers = products
    .filter((p) => (p.rating ?? 0) >= 4.8) // chỉ lấy sp rating cao
    .sort((a, b) => {
      const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
      if (ratingDiff !== 0) return ratingDiff;

      const dateA = new Date(a.createdAt ?? a.created_at ?? 0).getTime();
      const dateB = new Date(b.createdAt ?? b.created_at ?? 0).getTime();

      return dateB - dateA; // sắp xếp giảm dần
    });

  if (bestSellers.length === 0) return null; // Không hiển thị nếu không có sản phẩm Best Sellers

  // Tạo biến để kiểm tra có điều kiện lọc hay không
  const isFiltered =
    (filters.productType?.length ?? 0) > 0 ||
    (filters.skinType?.length ?? 0) > 0 ||
    (filters.priceRange ?? "") !== "";

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

  // Nhận filter từ ProductFilter
  const handleApplyFilters = (newFilters: FilterValues) => {
    console.log("Filters applied:", newFilters);
    setFilters(newFilters);
    setCurrentPage(1); // reset về trang đầu khi lọc
  };

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
  <main className="main-content product-page">
    <div className="inner">
      <div className="box-content">
        <ProductFilter
          value={draftFilters}
          onChange={setDraftFilters}
          onApply={handleApplyFilters}
        />
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
            <button 
              className="btn-filter-mo"
              onClick={() => {
                setDraftFilters(filters); // mở sheet thì sync theo applied hiện tại
                setIsFilterOpen(true);
              }}
            >
              <span className="icon">
                <img src="/images/svg/icon-filter.svg" alt="" />
              </span>
              <span className="text">Filter</span>
            </button>
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
    {isFilterOpen && (
      <div 
        className="filter-overlay" 
        onClick={() => setIsFilterOpen(false)}
      >
        <div 
          className="filter-sheet"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sheet-header">
            <div className="sheet-header-text">
              <span className="text-title">Filter</span>
              <span className="text-total">
                {isFiltered ? (
                  <>
                    <em>{filteredProducts.length}</em> Product
                  </>
                ) : (
                  <><em>{bestSellers.length}</em> Product</>
                )}
              </span>
            </div>
            <button 
              className="btn-close" 
              onClick={() => setIsFilterOpen(false)}
            >
              <span className="icon">
                <img src="/images/svg/icon-close.svg" alt="" />
              </span>
            </button>
          </div>
          <ProductFilter
            value={draftFilters}
            onChange={setDraftFilters}
            onApply={(f) => {
              handleApplyFilters(f);
              setIsFilterOpen(false);
            }}
          />
        </div>
      </div>
    )}
  </main>
  )
}

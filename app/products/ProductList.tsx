"use client";

import { useState } from "react";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";
import "./ProductList.scss";

interface FilterValues {
  productType: string[];
  skinType: string[];
  priceRange: string | null;
}

export default function ProductList() {
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
  };

  // Lọc sản phẩm dựa trên filters
  const filteredProducts = products.filter((p) => {
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
        (filters.priceRange === "$50 - $100" && (price > 50 || price >= 100)) ||
        (filters.priceRange === "Over $100" && (price > 100))
      ) {
        return false;
      }
    }

    return true;
  });

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
                    <em>{filteredProducts.length}</em> / {products.length} PRODUCT
                  </>
                ) : (
                  <><em>{products.length}</em> PRODUCT</>
                )}
              </span>
              <div className="sort-area">
                <span className="text">Sort by</span>
              </div>
            </div>
            <div className="product-list">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                  <ProductCard 
                    key={item.id}
                    {...item}
                  />
                ))
              ) : (
                <p className="no-result">No products found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useRecentlyViewed  } from "@/hooks/useRecentlyViewed";
import ProductCard from "./ProductCard";

import "./RecentlyViewed.scss";

export default function RecentlyViewed() {
  const { viewedProducts } = useRecentlyViewed();

  if (viewedProducts.length === 0) return null;

  return (
    <div className="recently-viewed">
      <div className="box-head">
        <strong className="text-title">Recently Viewed Products</strong>
      </div>
      <div className="box-content">
        {viewedProducts.map((item) => (
          <ProductCard 
            key={item.id} 
            {...item} 
          />
        ))}
      </div>
    </div>
  );
}
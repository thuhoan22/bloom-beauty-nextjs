"use client";

import { useEffect, useState } from "react";
import { products } from "@/data/products";

// Giới hạn số lượng sản phẩm lưu
const MAX_RECENT = 4;

export function useRecentlyViewed() {
  const [viewedIds, setViewedIds] = useState<number[]>([]);

  // Lấy danh sách sản phẩm đã xem từ localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      setViewedIds(stored);
    } catch (err) {
      console.error('Failed to parse recentlyViewed:', err);
    }
  }, []);

  // Lưu id sản phẩm khi người dùng click
  const addViewed = (id: number) => {
    setViewedIds((prev) => {
      const updated = [id, ...prev.filter((v) => v !== id)].slice(0, MAX_RECENT);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      return updated;
    });
  };

  // Dùng mock data:
  const viewedProducts = products.filter((p) => viewedIds.includes(p.id));

  return { viewedIds, viewedProducts, addViewed };
}

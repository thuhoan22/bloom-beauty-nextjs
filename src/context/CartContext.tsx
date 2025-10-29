"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartContextType {
  cartCount: number;
  addToCart: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState<number>(0);

  // 1. Đọc từ localStorage khi component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCount = localStorage.getItem("cartCount");
      if (storedCount) setCartCount(Number(storedCount));
    }
  }, []);

  // 2. Mỗi khi cartCount thay đổi, cập nhật localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cartCount", String(cartCount));
    }
  }, [cartCount]);

  // 3. Hàm thêm sản phẩm (vẫn giữ nguyên)
  const addToCart = (id: number) => {
    console.log("Added product:", id);
    setCartCount((prev) => prev + 1);
  };

  return (
    <CartContext.Provider value={{ cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

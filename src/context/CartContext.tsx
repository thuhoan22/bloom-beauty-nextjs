"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CartContextType {
  cartCount: number;
  addToCart: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// CartProvider, useCart để quản lý state giỏ hàng
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);

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

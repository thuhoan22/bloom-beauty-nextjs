"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";

interface CartItem {
  id: number;
  quantity: number;
}
interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (id: number) => void;
  updateItemQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 1. Đọc từ localStorage khi component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored  = localStorage.getItem("cartItems");
      if (stored) setCartItems(JSON.parse(stored));
    }
  }, []);

  // 2. Mỗi khi cartCount thay đổi, cập nhật localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // 3. Hàm thêm sản phẩm (vẫn giữ nguyên)
  const addToCart = (id: number) => {
    const exist = cartItems.find((item) => item.id === id);

    if (exist) {
      toast.success("Increased product quantity!");
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      toast.success("Added to cart!");
      setCartItems(prev => [...prev, { id: id, quantity: 1 }]);
    }
  };

  // Update quantity
  const updateItemQuantity = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
    toast.success("Quantity updated!");
  };

  // Remove item
  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Removed from cart!");
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      cartCount: cartItems.reduce((sum, i) => sum + i.quantity, 0),
      addToCart,
      updateItemQuantity,
      removeFromCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

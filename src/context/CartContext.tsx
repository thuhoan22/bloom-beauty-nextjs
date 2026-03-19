"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";
import { addToCartAPI, getCart, updateCartItemAPI, removeCartItemAPI } from "@/lib/cart.api";
import { getUser } from "@/lib/common.api";

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
  const [user, setUser] = useState<any>(null);

  // Lấy user từ supabase
  useEffect(() => {
    getUser().then(setUser);
  }, []);

  // Lấy user từ supabase
  useEffect(() => {
    getUser().then(setUser);
  }, []);

  // Add to cart
  const addToCart = async (id: number) => {
    if (!user) {
      toast.error("Please login");
      return;
    }

    try {
      await addToCartAPI(user.id, id);

      const updated = await getCart(user.id);
      setCartItems(updated);

      toast.success("Added to cart!");
    } catch (err) {
      console.error(err);
      toast.error("Add failed!");
    }
  };

  // Update quantity
  const updateItemQuantity = async (id: number, quantity: number) => {
    if (!user) return;

    try {
      await updateCartItemAPI(user.id, id, quantity);

      const updated = await getCart(user.id);
      setCartItems(updated);

      toast.success("Quantity updated!");
    } catch (err) {
      toast.error("Update failed!");
    }
  };

  // Remove item
  const removeFromCart = async (id: number) => {
    if (!user) return;

    try {
      await removeCartItemAPI(user.id, id);

      const updated = await getCart(user.id);
      setCartItems(updated);

      toast.success("Removed from cart!");
    } catch (err) {
      toast.error("Remove failed!");
    }
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

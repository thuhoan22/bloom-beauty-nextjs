"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";
import {
  addToCartAPI,
  getCart,
  updateCartItemAPI,
  removeCartItemAPI,
} from "@/lib/cart.api";
import { supabase } from "@/lib/supabase";

// type chuẩn
interface CartItem {
  id: string;          // cart_item.id
  product_id: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  user: any;
  addToCart: (productId: number) => void;
  updateItemQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Load user + listen auth
  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setLoading(false);
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);

        // chỉ clear khi logout thật
        if (_event === "SIGNED_OUT") {
          setCartItems([]);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 2. Load cart khi user ready
  useEffect(() => {
    if (!user) return;

    const loadCart = async () => {
      const cart = await getCart(user.id);

      setCartItems([...cart]); // clone để đảm bảo re-render
    };

    loadCart();
  }, [user]);

  // 3. Actions
  const addToCart = async (productId: number) => {
    if (!user) {
      toast.error("Please login");
      return;
    }

    try {
      await addToCartAPI(user.id, productId);

      const updated = await getCart(user.id);
      setCartItems([...updated]);

      toast.success("Added to cart!");
    } catch (err) {
      console.error(err);
      toast.error("Add failed!");
    }
  };

  const updateItemQuantity = async (id: number, quantity: number) => {
    if (!user) return;

    try {
      await updateCartItemAPI(user.id, id, quantity);

      const updated = await getCart(user.id);
      console.log("UPDATED CART:", updated);

      setCartItems([...updated]);

      toast.success("Quantity updated!");
    } catch (err) {
      console.error(err);
      toast.error("Update failed!");
    }
  };

  const removeFromCart = async (id: number) => {
    if (!user) return;

    try {
      await removeCartItemAPI(user.id, id);

      const updated = await getCart(user.id);
      setCartItems([...updated]);

      toast.success("Removed!");
    } catch (err) {
      console.error(err);
      toast.error("Remove failed!");
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount: cartItems.reduce((sum, i) => sum + i.quantity, 0),
        user,
        addToCart,
        updateItemQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
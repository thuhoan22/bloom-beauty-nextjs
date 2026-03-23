import { fetchAPI } from "./fetcher";
import { supabase } from "@/lib/supabase";

export const getCart = async (userId: string) => {
  // 1. Lấy cart
  const { data: cart, error: cartError } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (cartError || !cart) {
    console.log("No cart found");
    return [];
  }

  // 2. Lấy cart_item
  const { data: items, error: itemError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cart.id)
    .order("id", { ascending: true });

  return [...(items || [])];
};

export const addToCartAPI = async (userId: string, productId: number) => {
  // 1. lấy cart
  const { data: cart } = await supabase
    .from("carts")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  let cartId = cart?.id;

  // 2. nếu chưa có → tạo
  if (!cartId) {
    const { data: newCart, error } = await supabase
      .from("carts")
      .insert({ user_id: userId })
      .select()
      .single();

    if (error || !newCart) {
      throw new Error("Create cart failed");
    }

    cartId = newCart.id;
  }

  // guard
  if (!cartId) throw new Error("Cart ID undefined");

  // 3. check item
  const { data: existing } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing?.id) {
    await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + 1 })
      .eq("id", existing.id);
  } else {
    await supabase.from("cart_items").insert({
      cart_id: cartId,
      product_id: productId,
      quantity: 1,
    });
  }
};

export const updateCartItemAPI = async (
  userId: string,
  id: number,
  quantity: number
) => {
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", id);

  console.log("UPDATE ERROR:", error);
};

export const removeCartItemAPI = async (
  userId: string,
  id: number
) => {
  await supabase
    .from("cart_items")
    .delete()
    .eq("id", id);
};
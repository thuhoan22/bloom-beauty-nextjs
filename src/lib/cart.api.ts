import { fetchAPI } from "./fetcher";
import { supabase } from "@/lib/supabase";

export const getCart = async (userId: string) => {
  // 1. Lấy cart
  const { data: cart, error: cartError } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (cartError || !cart) {
    console.log("No cart found");
    return [];
  }

  // 2. Lấy cart_item
  const { data: items, error: itemError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cart.id);

  return items || [];
};

export const addToCartAPI = async (userId: string, productId: number) => {
  // 1. tìm cart
  const { data: carts } = await supabase
    .from("carts")
    .select("*")
    .eq("user_id", userId);

  let cartId;

  if (!carts || carts.length === 0) {
    // 2. tạo cart
    const { data: newCart, error } = await supabase
      .from("carts")
      .insert({ user_id: userId })
      .select();

    if (error) {
      console.error(error);
      throw new Error("Create cart failed");
    }

    if (!newCart || newCart.length === 0) {
      throw new Error("Cart empty after insert");
    }

    cartId = newCart[0].id;
  } else {
    cartId = carts[0].id;
  }

  // 3. check item đã tồn tại chưa
  const { data: existing } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .single();

  if (existing) {
    // update quantity
    await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + 1 })
      .eq("id", existing.id);
  } else {
    // insert mới
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
};

export const removeCartItemAPI = async (
  userId: string,
  productId: number
) => {
  // delete DB
};
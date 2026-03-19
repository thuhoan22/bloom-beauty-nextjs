import { fetchAPI } from "./fetcher";

const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const headers = {
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json"
};

export const getCart = async (userId: string) => {
  const carts = await fetchAPI(`carts?user_id=eq.${userId}&select=id`);

  if (!carts.length) return [];

  const cartId = carts[0].id;

  const items = await fetchAPI(`
    cart_items?cart_id=eq.${cartId}&select=*
  `);

  return items;
};

export const addToCartAPI = async (userId: string, productId: number) => {
  // 1. lấy cart
  let carts = await fetchAPI(`carts?user_id=eq.${userId}`);

  let cartId;

  if (!carts.length) {
    const newCart = await fetch(`${BASE_URL}/rest/v1/carts`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify({ user_id: userId })
    }).then(res => res.json());

    cartId = newCart[0].id;
  } else {
    cartId = carts[0].id;
  }

  // 2. check item tồn tại
  const existing = await fetchAPI(
    `cart_items?cart_id=eq.${cartId}&product_id=eq.${productId}`
  );

  if (existing.length) {
    // update quantity
    await fetch(`${BASE_URL}/rest/v1/cart_items?id=eq.${existing[0].id}`, {
      method: "PATCH",
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quantity: existing[0].quantity + 1
      })
    });
  } else {
    // insert
    await fetch(`${BASE_URL}/rest/v1/cart_items`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cart_id: cartId,
        product_id: productId,
        quantity: 1
      })
    });
  }
};

export const updateCartItemAPI = async (
  userId: string,
  productId: number,
  quantity: number
) => {
  // update DB
};

export const removeCartItemAPI = async (
  userId: string,
  productId: number
) => {
  // delete DB
};
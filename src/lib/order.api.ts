import { supabase } from "@/lib/supabase";

export const createOrder = async (payload: {
  customer: {
    name: string;
    province: string;
    district: string;
    ward: string;
    address: string;
    phone: string;
  };
  items: any[];
}) => {
  try {
    const { customer, items } = payload;

    console.log("ITEMS FROM FE:", items);

    // lấy list product id
    const ids = items.map((item: any) => item.id);
    console.log("🧪 IDS:", ids);

    // query giá thật từ DB
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("id, price")
      .in("id", ids);

    if (productError) {
      console.error(productError);
      return { success: false };
    }

    // map lại cho dễ lookup
    const productMap = new Map(
      products.map((p: any) => [p.id, p.price])
    );

    // tính total chuẩn (anti hack)
    const total = items.reduce((sum: number, item: any) => {
      const realPrice = productMap.get(item.id) || 0;

      console.log("item:", item);
      console.log("realPrice:", realPrice);

      return sum + realPrice * item.quantity;
    }, 0);

    console.log("FINAL TOTAL:", total);

    // tính total
    // const total = items.reduce(
    //   (sum: number, item: any) =>
    //     sum + item.price * item.quantity,
    //   0
    // );

    // 1. create order
    const { data: order, error: insertError } = await supabase
      .from("orders")
      .insert({
        name: customer.name,
        province: customer.province,
        district: customer.district,
        ward: customer.ward,
        address: customer.address,
        phone: customer.phone,
        total: total,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // 2. create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    const { error: itemError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemError) throw itemError;

    return { success: true };
  } catch (error) {
    console.error("createOrder error:", error);
    return { success: false };
  }
};
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
  payment_method?: "cod" | "card";
}) => {
  try {
    const { customer, items } = payload;

    // lấy user
    const { data: { user }, } = await supabase.auth.getUser();
    if (!user?.id) return { success: false };

    // lấy list product id
    const ids = items.map(item => item.product_id);

    // query giá thật từ DB
    const { data: products, error: productError } = await supabase
      .from("products")
      .select(`
        id,
        price,
        name,
        product_images (
          image_url
        )
      `)
      .in("id", ids);

    if (productError) {
      return { success: false };
    }

    // map lại cho dễ lookup
    // const productMap = new Map(
    //   (products || []).map((p: any) => [String(p.id), p.price])
    // );
    const productMap = new Map((products || []).map((p: any) => {
      const imageFromRelation =
        Array.isArray(p.product_images) && p.product_images.length > 0
          ? p.product_images[0]?.image_url
          : null;

      return [
        String(p.id),
        {
          id: p.id,
          name: p.name ?? null,
          price: p.price ?? null,
          image: imageFromRelation ?? null,
        },
      ];
    }));

    // nếu thiếu product (id sai / bị xóa) thì stop để tránh insert snapshot null
    const missing = ids.filter((id: any) => !productMap.has(String(id)));
    if (missing.length > 0) {
      console.error("createOrder missing products:", missing);
      return { success: false };
    }

    // tính total chuẩn (anti hack)
    const subtotal = items.reduce((sum: number, item: any) => {
      const product = productMap.get(String(item.product_id));
      const price = product?.price ?? 0;
      return sum + price * item.quantity;
    }, 0);

    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    // 1. create order
    const { data: order, error: insertError } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id,
        name: customer.name,
        province: customer.province,
        district: customer.district,
        ward: customer.ward,
        address: customer.address,
        phone: customer.phone,
        total: total,
        status: "processing",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // 2. create order items
    const orderItems = items.map((item: any) => {
      const product = productMap.get(String(item.product_id));

      return {
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,

        // snapshot
        name: product?.name,
        image: product?.image,
        price: product?.price,
      };
    });

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

export const getOrders = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return { success: false, error: "Not authenticated" as const };
    }

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        total,
        created_at,
        name,
        province,
        district,
        ward,
        address,
        phone,
        order_items:order_items!order_id (
          id,
          quantity,
          price,
          name,
          image
        )`)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getOrders supabase error:", error);
      return { success: false, error };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("getOrders error:", error);
    return { success: false, error };
  }
};

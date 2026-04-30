import { fetchAPIWithOptions } from "./fetcher";

export const getProducts = async () => {
  // NOTE: This is used by listing pages/components. Keep payload small.
  // Only select fields needed for cards, filtering, and client-side sorting.
  const endpoint =
    "products?select=" +
    [
      "id",
      "name",
      "desc",
      "price",
      "sale",
      "rating",
      "image",
      "category",
      "createdAt",
      // keep relations generic to avoid selecting non-existent columns
      "product_details(*)",
      "product_images(image_url)",
      "product_skin_types(type)",
    ].join(",");

  const data = await fetchAPIWithOptions(endpoint, { cache: "force-cache", revalidate: 60 });

  return (data || []).map((p: any) => {
    const {
      product_details,
      product_images,
      product_skin_types,
      ...rest
    } = p;

    const details = product_details?.[0] || null;

    return {
      ...rest,
      details: {
        ...(details || {}),
        typeSkin: product_skin_types?.map((s: any) => s.type) || [],
        imageSlide: product_images?.map((i: any) => i.image_url) || [],
      }
    };
  });
};

export const getProductById = async (id: number | string) => {
  // Detail page can afford a heavier payload, but still avoid select=*
  const endpoint =
    `products?id=eq.${id}&select=` +
    [
      "id",
      "name",
      "desc",
      "price",
      "sale",
      "rating",
      "image",
      "category",
      "createdAt",
      "product_details(*)",
      "product_images(*)",
      "product_skin_types(*)",
    ].join(",");

  const data = await fetchAPIWithOptions(endpoint, { cache: "force-cache", revalidate: 60 });

  const p = data?.[0];
  if (!p) return null;

  const details = p.product_details?.[0];

  return {
    ...p,
    details: {
      ...(details || {}),
      typeSkin: p.product_skin_types?.map((s: any) => s.type) ?? [],
      imageSlide: p.product_images?.map((i: any) => i.image_url) ?? [],
    }
  };
};

export const getBestSellers = () =>
  fetchAPIWithOptions(
    "products?rating=gte.4.5&order=rating.desc&limit=8&select=id,name,desc,price,sale,rating,image,category,createdAt",
    { cache: "force-cache", revalidate: 60 }
  );

// Best-sell page needs enough fields for filters (category + skin types) but still keep it small.
export const getBestSellerProducts = async () => {
  const endpoint =
    "products?rating=gte.4.8&order=rating.desc&select=" +
    [
      "id",
      "name",
      "desc",
      "price",
      "sale",
      "rating",
      "image",
      "category",
      "createdAt",
      "product_skin_types(type)",
    ].join(",");

  const data = await fetchAPIWithOptions(endpoint, { cache: "force-cache", revalidate: 60 });

  return (data || []).map((p: any) => {
    const { product_skin_types, ...rest } = p;
    return {
      ...rest,
      details: {
        typeSkin: product_skin_types?.map((s: any) => s.type) || [],
      },
    };
  });
};

export const getNewArrivalsProducts = async (limit = 8) => {
  const endpoint =
    `products?order=createdAt.desc.nullslast&limit=${limit}&select=` +
    ["id", "name", "desc", "price", "sale", "rating", "image", "category", "createdAt"].join(",");

  return await fetchAPIWithOptions(endpoint, { cache: "force-cache", revalidate: 60 });
};

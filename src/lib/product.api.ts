import { fetchAPI } from "./fetcher";

export const getProducts = async () => {
  const endpoint = "products?select=*,product_details(*),product_images(*),product_skin_types(*)";

  const data = await fetchAPI(endpoint);

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
  const endpoint = `products?id=eq.${id}&select=*,product_details(*),product_images(*),product_skin_types(*)`;

  const data = await fetchAPI(endpoint);

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

export const getBestSellers = () => fetchAPI("products?rating=gte.4.5&order=rating.desc&limit=8");

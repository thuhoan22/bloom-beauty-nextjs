import ProductDetail from "./ProductDetail";

// Next.js 15 thay đổi cơ chế dynamic params nên phải dùng Promise/await
interface PageProps {
  params: Promise<{ id: string }>; // always string from Next.js
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const productId = Number(id); // convert to number

  return <ProductDetail id={productId} />;
}

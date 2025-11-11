import BlogDetail from "./BlogDetail";

// Next.js 15 thay đổi cơ chế dynamic params nên phải dùng Promise/await
interface PageProps {
  params: Promise<{ id: string }>; // always string from Next.js
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { id } = await params;
  const blogId = Number(id); // convert to number

  return <BlogDetail id={blogId} />;
}

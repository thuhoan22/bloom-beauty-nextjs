import BlogList from "./BlogList";
import { getBlogs } from "@/lib/blog.api";

export default async function BlogPage() {
  const initialBlogs = await getBlogs();
  return <BlogList initialBlogs={initialBlogs} />;
}
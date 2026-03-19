import { fetchAPI } from "./fetcher";

export const getBlogs = async () => {
  const data = await fetchAPI("blogs?select=*,blog_tags(*)");

  return (data || []).map((p: any) => ({
    ...p,
    tags: p.blog_tags?.map((t: any) => t.tag) || [],
  }));
};
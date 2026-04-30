import { fetchAPIWithOptions } from "./fetcher";

export const getBlogs = async (options?: { limit?: number }) => {
  // Keep payload small: only fields used by BlogCard + tag names.
  const limit = options?.limit;
  const endpoint =
    "blogs?" +
    [
      "select=id,title,desc,date,image,blog_tags(tag)",
      "order=date.desc.nullslast",
      limit != null ? `limit=${limit}` : null,
    ]
      .filter(Boolean)
      .join("&");

  const data = await fetchAPIWithOptions(endpoint, { cache: "force-cache", revalidate: 60 });

  return (data || []).map((p: any) => ({
    ...p,
    tags: p.blog_tags?.map((t: any) => t.tag) || [],
  }));
};
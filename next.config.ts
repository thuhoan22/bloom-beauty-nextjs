import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["htuxlhzgnlnonaqoycvm.supabase.co"],
  },
  sassOptions: {
    additionalData: `@use "@/styles/mixins" as *;`,
  },
};

export default nextConfig;

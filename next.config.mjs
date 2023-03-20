import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import nextMdx from "@next/mdx";

const withMDX = nextMdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkFrontmatter, remarkGfm],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactStrictMode: false,
};

// Merge MDX config with Next.js config
export default withMDX(nextConfig);

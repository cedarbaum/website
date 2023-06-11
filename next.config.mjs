import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkGitHub from "remark-github";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeShiki from "@leafac/rehype-shiki";
import { getHighlighter } from "shiki";
import nextMdx from "@next/mdx";

const withMDX = nextMdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkFrontmatter, remarkGfm, remarkMath],
    // MathJax doesn't currently work with SSR: https://github.com/remarkjs/remark-math/issues/80
    rehypePlugins: [
      rehypeKatex,
      rehypeSlug,
      rehypeAutolinkHeadings,
      [
        rehypeShiki,
        {
          highlighter: await getHighlighter({
            theme: "one-dark-pro",
          }),
        },
      ],
    ],
    providerImportSource: "@mdx-js/react",
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactStrictMode: false,
};

// Merge MDX config with Next.js config
export default withMDX(nextConfig);

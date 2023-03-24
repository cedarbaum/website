import fs from "fs";
import matter from "gray-matter";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import rehypePrism from "@mapbox/rehype-prism";

export async function getStaticPaths() {
  const files = fs.readdirSync("content/posts");
  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace(".mdx", ""),
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const fileName = fs.readFileSync(`content/posts/${slug}.mdx`, "utf-8");
  const { data: frontmatter, content: mdxContent } = matter(fileName);
  const mdxSource = await serialize(mdxContent, {
    mdxOptions: {
      remarkPlugins: [remarkFrontmatter, remarkGfm],
      rehypePlugins: [rehypePrism],
      format: "mdx",
    },
  });

  return {
    props: {
      frontmatter,
      mdxSource,
    },
  };
}

export default function PostPage({
  frontmatter,
  mdxSource,
}: {
  frontmatter: any;
  mdxSource: MDXRemoteSerializeResult;
}) {
  return (
    <div className="w-full h-full">
      <article className="prose p-8">
        <MDXRemote {...mdxSource} />
      </article>
    </div>
  );
}

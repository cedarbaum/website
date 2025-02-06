
import fs from "fs";
import matter from "gray-matter";

export default function getPosts() {
  const postsDirectory = "app/blog/posts";
  const files = fs.readdirSync(postsDirectory);
  const posts = files
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(".mdx", "");
      const readFile = fs.readFileSync(
        `${postsDirectory}/${fileName}`,
        "utf-8"
      );
      const { data: frontmatter } = matter(readFile);
      return {
        slug,
        frontmatter,
      };
    })
    .filter(
      ({ frontmatter }) =>
        !frontmatter.is_draft || process.env.NEXT_PUBLIC_SHOW_BLOG_DRAFTS
    );

  return posts;
}
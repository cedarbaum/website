import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";

export default function BlogIndex({
  posts,
}: {
  posts: { slug: string; frontmatter: any }[];
}) {
  console.log(posts);
  return (
    <div className="w-full h-full dark:bg-black prose dark:prose-invert p-8">
      <header className="text-5xl">Blog posts</header>
      <main>
        {posts.map((post) => (
          <article key={post.slug} className="my-10">
            <header>
              <Link href={`/blog/${post.slug}`} className="text-3xl">
                {post.frontmatter.title}
              </Link>
              <p className="text-sm mt-2">{post.frontmatter.date}</p>
            </header>
            <section>
              <p>{post.frontmatter.description}</p>
            </section>
          </article>
        ))}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const postsDirectory = "pages/blog";
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
    });

  return {
    props: {
      posts,
    },
  };
}

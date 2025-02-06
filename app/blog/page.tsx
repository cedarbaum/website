import Link from "next/link";
import getPosts from "./posts/getPosts";

export default function Page() {
  const posts = getPosts();
  if (posts.length === 0) {
    return (
      <header className="text-5xl">No blog posts 😔</header>
    );
  }

  return (
    <div className="w-full h-full dark:bg-black prose dark:prose-invert">
      <header className="text-5xl">Blog posts</header>
      <main>
        {posts.map(({ slug, frontmatter }) => (
          <article key={slug} className="my-10">
            <header>
              <Link href={`/blog/${slug}`} className="text-3xl">
                {frontmatter.title}
              </Link>
              <p className="text-sm mt-2">{frontmatter.date}</p>
            </header>
            <section>
              <p>{frontmatter.description}</p>
            </section>
          </article>
        ))}
      </main>
    </div>
  );
}
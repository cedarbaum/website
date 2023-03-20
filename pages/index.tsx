import fs from "fs";
import matter from "gray-matter";
import Chat from "@/components/Chat";

export default function Home({
  posts,
}: {
  posts: { slug: string; frontmatter: any }[];
}) {
  return (
    <div className="relative h-full w-full bg-white flex flex-col">
      <div className="h-full w-full md:py-4 chat-container">
        <Chat />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const postsDirectory = "content/posts";
  const files = fs.readdirSync(postsDirectory);

  const posts = files.map((fileName) => {
    const slug = fileName.replace(".mdx", "");
    const readFile = fs.readFileSync(`${postsDirectory}/${fileName}`, "utf-8");
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

import fs from "fs";
import matter from "gray-matter";
import Chat, { Context, ContextType } from "@/components/Chat";
import { useState } from "react";
import { useWindowWidth } from "@react-hook/window-size";

const blockedUrlDomains = ["strava", "github"];
const blockedUrlHosts = new Set(
  blockedUrlDomains.flatMap((domain) => [`www.${domain}.com`, `${domain}.com`])
);

export default function Home({
  posts,
}: {
  posts: { slug: string; frontmatter: any }[];
}) {
  const [sidecarExpanded, setSidecarExpanded] = useState<boolean>(false);
  const [focusUrl, setFocusUrl] = useState<undefined | string>();
  const windowWidth = useWindowWidth();

  function onContextChange(ctx: Context) {
    if (ctx.type === ContextType.SingleUrl && windowWidth > 640) {
      const host = new URL(ctx.data!).host;
      if (blockedUrlHosts.has(host)) {
        return;
      }

      setFocusUrl(ctx.data);
      setSidecarExpanded(true);
    } else {
      setSidecarExpanded(false);
    }
  }

  return (
    <div className="page-background relative h-full w-full flex flex-col md:mx-auto">
      <div className="md:p-8 relative h-full w-full md:mx-auto flex justify-center">
        <div className="w-full flex justify-center">
          <div
            className={`h-full w-full md:max-w-md overflow-hidden ${
              sidecarExpanded ? "md:rounded-l-lg" : "md:rounded-lg"
            }`}
          >
            <Chat onContextChange={onContextChange} />
          </div>
          <div
            className={`sidecar-container ${
              sidecarExpanded ? "grow" : ""
            } rounded-r-lg overflow-hidden bg-white h-full relative hidden md:block`}
          >
            <iframe
              allow="geolocation"
              className="top-0 right-0 bottom-0 left-0 absolute w-full h-full border-none"
              src={focusUrl}
            />
          </div>
        </div>
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

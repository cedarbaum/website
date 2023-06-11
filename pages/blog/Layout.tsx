import {
  ClipboardDocumentIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { MDXProvider } from "@mdx-js/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

function Pre({ children, className }: any) {
  const [clipboardShown, setClipboardShown] = useState(false);
  const preRef = useRef<HTMLPreElement | null>(null);

  const onMouseEnter = () => {
    setClipboardShown(true);
  };

  const onMouseLeave = () => {
    setClipboardShown(false);
  };

  const onClipboardClick = () => {
    navigator.clipboard.writeText(preRef.current?.innerText ?? "");
    toast("Copied to clipboard", {
      icon: "✂️",
    });
  };

  return (
    <pre
      className={`${className ?? ""} relative`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={preRef}
    >
      {clipboardShown && (
        <div className="flex flex-col justify-center absolute top-0 right-4 h-full">
          <ClipboardDocumentIcon
            className="w-6 h-6 cursor-pointer opacity-70 hover:opacity-100"
            onClick={onClipboardClick}
          />
        </div>
      )}
      {children}
    </pre>
  );
}

export default function Layout({
  title,
  children,
}: {
  title?: string;
  children: JSX.Element;
}) {
  const router = useRouter();
  const { pathname } = router;
  const isBlogIndex = pathname === "/blog";
  title = isBlogIndex ? "Blog posts" : title;

  return (
    <>
      {title && (
        <Head>
          <title>{title}</title>
        </Head>
      )}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 1000 }}
      />
      <div className="dark:bg-black prose dark:prose-invert p-8">
        {!isBlogIndex && (
          <nav className="pb-4">
            <Link href="/blog">
              <ListBulletIcon className="w-8 h-8 cursor-pointer opacity-70 hover:opacity-100" />
            </Link>
          </nav>
        )}
        <MDXProvider components={{ pre: Pre }}>{children}</MDXProvider>
      </div>
    </>
  );
}

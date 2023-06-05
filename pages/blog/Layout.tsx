import {
  ClipboardDocumentIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { MDXProvider } from "@mdx-js/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Highlight, themes, Prism } from "prism-react-renderer";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

(typeof global !== "undefined" ? global : window).Prism = Prism;
require("prismjs/components/prism-python");
require("prismjs/components/prism-lisp");

function Code({ children, className }: any) {
  const language = className?.replace(/language-/gm, "");
  if (!language) {
    return <code className={className}>{children}</code>;
  }

  return (
    <Highlight code={children} language={language} theme={themes.vsDark}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <code className={className} style={style}>
          {tokens.slice(0, -1).map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </code>
      )}
    </Highlight>
  );
}

function Pre({ children, className }: any) {
  const grandChildren = children?.props?.children;

  const [clipboardShown, setClipboardShown] = useState(false);

  const onMouseEnter = () => {
    setClipboardShown(true);
  };

  const onMouseLeave = () => {
    setClipboardShown(false);
  };

  const onClipboardClick = () => {
    navigator.clipboard.writeText(
      grandChildren ? grandChildren.trim() : children.trim()
    );
    toast("Copied to clipboard", {
      icon: "✂️",
    });
  };

  return (
    <pre
      className={`${className ?? ""} relative`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {(grandChildren || children) && clipboardShown && (
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
        <MDXProvider components={{ code: Code, pre: Pre }}>
          {children}
        </MDXProvider>
      </div>
    </>
  );
}

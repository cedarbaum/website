import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { MDXProvider } from "@mdx-js/react";
import { Highlight, themes, Prism } from "prism-react-renderer";
import { useState } from "react";

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
  const childClassName = children?.props?.className;
  const grandChildren = children?.props?.children;

  const [clipboardShown, setClipboardShown] = useState(false);

  if (
    childClassName === undefined ||
    grandChildren === undefined ||
    !childClassName?.replace(/language-/gm, "")
  ) {
    return <pre className={className}>{children}</pre>;
  }

  const onMouseEnter = () => {
    setClipboardShown(true);
  };

  const onMouseLeave = () => {
    setClipboardShown(false);
  };

  const onClipboardClick = () => {
    navigator.clipboard.writeText(grandChildren.trim());
  };

  return (
    <pre
      className={`${className ?? ""} relative`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {clipboardShown && (
        <div className="flex flex-col justify-center absolute top-0 right-4 h-full">
          <ClipboardDocumentIcon
            className="w-6 h-6 cursor-pointer opacity-50 hover:opacity-100"
            onClick={onClipboardClick}
          />
        </div>
      )}
      {children}
    </pre>
  );
}

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <MDXProvider components={{ code: Code, pre: Pre }}>
      <div className="dark:bg-black prose dark:prose-invert p-8">
        {children}
      </div>
    </MDXProvider>
  );
}

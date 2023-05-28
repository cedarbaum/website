import { MDXProvider } from "@mdx-js/react";
import { Highlight, themes, Prism } from "prism-react-renderer";

(typeof global !== "undefined" ? global : window).Prism = Prism;
require("prismjs/components/prism-python");

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

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <MDXProvider components={{ code: Code }}>
        <div className="dark:bg-black prose dark:prose-invert p-8">
          {children}
        </div>
    </MDXProvider>
  );
}

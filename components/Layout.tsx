import { useWindowWidth } from "@react-hook/window-size";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Chat, { Context, ContextType } from "./Chat";
import ContactCard from "./ContactCard";

const blockedUrlDomains = ["strava", "github"];
const blockedUrlHosts = new Set(
  blockedUrlDomains.flatMap((domain) => [`www.${domain}.com`, `${domain}.com`])
);

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [context, setContext] = useState<Context | null>(null);
  const [sidecarExpanded, setSidecarExpanded] = useState<boolean>(false);
  const [sidecarMaxWidth, setSidecarMaxWidth] = useState<string>("none");
  const [viewingPost, setIsViewingPost] = useState<boolean>(false);
  const [focusUrl, setFocusUrl] = useState<undefined | string>();
  const windowWidth = useWindowWidth();

  function onContextChange(ctx: Context) {
    setContext(ctx);

    if (windowWidth <= 640) {
      setSidecarExpanded(false);
      return;
    }

    if (ctx.type === ContextType.SingleUrl) {
      const host = new URL(ctx.data!).host;
      if (blockedUrlHosts.has(host)) {
        return;
      }

      setFocusUrl(ctx.data);
      setSidecarMaxWidth("none");
      setSidecarExpanded(true);
    } else if (ctx.type === ContextType.Contact) {
      setFocusUrl(undefined);
      setSidecarMaxWidth("max-w-[350px]");
      setSidecarExpanded(true);
    } else {
      setSidecarExpanded(false);
    }

    setIsViewingPost(false);
  }

  function getViewForContext() {
    if (context === null) {
      return null;
    }

    switch (context.type) {
      case ContextType.Contact:
        return <ContactCard />;
      case ContextType.SingleUrl:
        return (
          <iframe
            allow="geolocation"
            className=" w-full h-full"
            src={focusUrl}
          />
        );
      default:
        return null;
    }
  }

  function getSidecarView() {
    const viewForCtx = getViewForContext();
    if (viewForCtx) {
      return viewForCtx;
    }

    return <div className="w-full h-full">{children}</div>;
  }

  useEffect(() => {
    if (router.pathname !== "/") {
      setIsViewingPost(true);
      setSidecarExpanded(true);
    } else {
      setFocusUrl(undefined);
      setIsViewingPost(false);
    }
  }, [router.pathname]);

  return (
    <div className="w-full h-full">
      <Head>
        <title>Sam&apos;s website</title>
        <meta name="description" content="Personal website for Sam Cedarbaum" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚀</text></svg>"
        />
      </Head>
      <main className="w-full h-full">
        {windowWidth <= 640 && viewingPost ? (
          <>{children}</>
        ) : (
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
                  className={`sidecar-container ${sidecarMaxWidth} ${
                    sidecarExpanded ? "grow" : ""
                  } rounded-r-lg overflow-hidden bg-white h-full relative hidden md:block`}
                  onTransitionEnd={() => {
                    if (!sidecarExpanded) {
                      setFocusUrl(undefined);
                    }
                  }}
                >
                  <div
                    className={`top-0 right-0 bottom-0 left-0 absolute w-full h-full border-none`}
                  >
                    {getSidecarView()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

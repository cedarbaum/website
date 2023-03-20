import Head from "next/head";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        <Head>
          <title>Sam&apos;s website</title>
          <meta
            name="description"
            content="Personal website for Sam Cedarbaum"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="icon"
            href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚀</text></svg>"
          />
        </Head>
        <main className="w-full h-full">{children}</main>
      </div>
    </div>
  );
}

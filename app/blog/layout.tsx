import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 1000 }}
      />
      <div className="dark:bg-black prose dark:prose-invert p-8">
        {children}
      </div>
    </>
  );
}
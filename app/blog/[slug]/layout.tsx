import { ListBulletIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <div >
      <nav className="pb-4">
        <Link href="/blog">
          <ListBulletIcon className="w-8 h-8 cursor-pointer opacity-70 hover:opacity-100" />
        </Link>
      </nav>
      {children}
    </div>
  );
}
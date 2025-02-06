import { ListIcon } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <div >
      <nav className="pb-4">
        <Link href="/blog">
          <ListIcon className="w-8 h-8 cursor-pointer opacity-70 hover:opacity-100" />
        </Link>
      </nav>
      {children}
    </div>
  );
}
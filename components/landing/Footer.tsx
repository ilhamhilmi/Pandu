import Logo from "./Logo";
import Link from "next/link";
import Image from "next/image";

/** Landing page footer with the Pandu wordmark and copyright info. */
export default function Footer() {
  return (
    <footer className="border-t border-border bg-gradient-to-r from-orange-50/60 via-white to-violet-50/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo />
          </div>
          <div className="flex items-center justify-center space-x-3.5">
            <p className="font-inter text-sm text-muted-foreground">
              Product by
            </p>
            <Link href="https://github.com/ilhamhilmi" className="font-inter border rounded-full px-3 py-1.5 flex space-x-2 hover:bg-gray-100 duration-200 shadow-md" target="_blank" rel="noopener noreferrer">
              <Image src="/icon/github.webp" alt="Github" width={24} height={24} />
              <p className="text-black">ilhamhilmi</p>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Logo from "./Logo";

/** Landing page footer with the Pandu wordmark and copyright info. */
export default function Footer() {
  return (
    <footer className="border-t border-border bg-gradient-to-r from-orange-50/60 via-white to-violet-50/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo />
          </div>
          <p className="font-inter text-sm text-muted-foreground">
            © {new Date().getFullYear()} Pandu. Dibikin di Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
}

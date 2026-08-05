import Logo from "./Logo";

/** Landing page footer with the Pandu wordmark and copyright info. */
export default function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-inter uppercase border rounded-full py-1 px-2.5 text-sm font-semibold border-primary/10 bg-primary/10 text-primary">
              Ruang Belajar
            </span>
          </div>
          <p className="font-inter text-sm text-muted-foreground">
            © {new Date().getFullYear()} Pandu — Ruang Belajar. Dibuat dengan ❤️.
          </p>
        </div>
      </div>
    </footer>
  );
}

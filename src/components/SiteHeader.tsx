import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/10 bg-ink/90 text-ink-foreground backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-sm font-extrabold sm:text-lg">
          <span className="inline-block h-4 w-8 bg-highlight [clip-path:polygon(0_30%,35%_30%,40%_0,60%_0,65%_30%,100%_30%,100%_70%,65%_70%,60%_100%,40%_100%,35%_70%,0_70%)]" />
          CHEVROLET <span className="text-highlight">UNIVERSE</span>
        </Link>
        <nav className="hidden gap-6 text-sm font-medium opacity-80 md:flex">
          <Link to="/">Catálogo e seminovos</Link>
        </nav>
      </div>
    </header>
  );
}

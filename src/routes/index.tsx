import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Gauge, Calendar, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { listings, catalogListings, categories, filterListings, brl, type Listing } from "@/lib/listings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Comprar Chevrolet — Chevrolet Universe" },
      { name: "description", content: "Anúncios de veículos Chevrolet: Onix, S10, Tracker e mais." },
      { property: "og:title", content: "Comprar Chevrolet — Chevrolet Universe" },
      { property: "og:description", content: "Anúncios de veículos Chevrolet: Onix, S10, Tracker e mais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// The plain-file copy (site-pronto/) ships without scripts, so tabs can't switch:
// it shows the catalog and the used cars one after the other instead.
const isStaticCopy = import.meta.env.VITE_STATIC_COPY === "1";

function Index() {
  const [view, setView] = useState("catalog");
  const [category, setCategory] = useState("Todos");
  if (isStaticCopy) return <StaticIndex />;
  const visible = filterListings(view === "catalog" ? catalogListings : listings, category);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-xs font-bold uppercase text-muted-foreground">Chevrolet Universe</p>
        <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">Escolha seu Chevrolet</h1>
        <p className="mt-3 text-sm text-muted-foreground">Onix, Onix Plus, Tracker, Spin, Equinox e S10.</p>
        <div className="mt-7 flex gap-2 border-b border-border pb-4" role="group" aria-label="Tipo de veículos">
          <Button variant={view === "catalog" ? "default" : "outline"} aria-pressed={view === "catalog"} onClick={() => { setView("catalog"); setCategory("Todos"); }}>Catálogo · 6</Button>
          <Button variant={view === "used" ? "default" : "outline"} aria-pressed={view === "used"} onClick={() => { setView("used"); setCategory("Todos"); }}>Seminovos · 3</Button>
        </div>
        <nav aria-label="Categorias" className="mt-5 flex flex-wrap gap-2">
          {categories.map((item) => <Button key={item} size="sm" variant={category === item ? "secondary" : "ghost"} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</Button>)}
        </nav>
        <div className="my-5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>{visible.length} veículos</p>
          <p>{view === "catalog" ? "Catálogo demonstrativo · Preços sugeridos" : "Anúncios demonstrativos, apenas exemplos."}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((l) => <ListingCard key={l.id} l={l} />)}
        </div>
        {visible.length === 0 && <p className="py-12 text-center text-muted-foreground">Nenhum veículo nessa categoria.</p>}
      </main>
      <footer className="border-t border-border bg-card px-4 py-6 text-center text-xs text-muted-foreground">Catálogo e anúncios demonstrativos — preços sugeridos, sujeitos a alteração.</footer>
    </div>
  );
}

function ListingCard({ l }: { l: Listing }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card">
      <div className="relative">
        <Link to="/anuncio/$id" params={{ id: l.id }} aria-label={`Ver ${l.title}`}><img src={l.images[0]} alt={l.title} loading="lazy" width={1280} height={720} className="aspect-video w-full object-cover" /></Link>
        <span className="absolute left-3 top-3 rounded-md bg-ink/90 px-2 py-1 text-xs font-semibold text-ink-foreground">{l.category}</span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h2 className="font-bold leading-tight">{l.title}</h2>
        <p className="text-2xl font-extrabold">{brl(l.price)}</p>
        {l.kind === "catalog" ? <dl className="space-y-2 border-t border-border pt-3 text-xs">
          {[["Motor", l.motor], ["Potência", l.power], ["Câmbio", l.gear], ...(l.highlight ? [["Destaque", l.highlight]] : [])].map(([label, value]) => <div key={label} className="flex items-start justify-between gap-3"><dt className="text-muted-foreground">{label}</dt><dd className="text-right font-medium">{value}</dd></div>)}
        </dl> : <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{l.year}</span>
          <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" />{l.km.toLocaleString("pt-BR")} km</span>
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{l.city}</span>
        </div>}
        <Button asChild className="mt-auto w-full bg-highlight font-bold text-highlight-foreground hover:bg-highlight/80">
          <Link to="/anuncio/$id" params={{ id: l.id }}>Tenho interesse <ArrowUpRight /></Link>
        </Button>
      </div>
    </article>
  );
}

function StaticIndex() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-xs font-bold uppercase text-muted-foreground">Chevrolet Universe</p>
        <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">Escolha seu Chevrolet</h1>
        <p className="mt-3 text-sm text-muted-foreground">Onix, Onix Plus, Tracker, Spin, Equinox e S10.</p>
        {[["Catálogo · 6", "Catálogo demonstrativo · Preços sugeridos", catalogListings], ["Seminovos · 3", "Anúncios demonstrativos, apenas exemplos.", listings]].map(([title, note, items]) => (
          <section key={title as string} className="mt-10">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-2 border-b border-border pb-3">
              <h2 className="text-xl font-extrabold">{title as string}</h2>
              <p className="text-xs text-muted-foreground">{note as string}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(items as Listing[]).map((l) => <ListingCard key={l.id} l={l} />)}
            </div>
          </section>
        ))}
      </main>
      <footer className="border-t border-border bg-card px-4 py-6 text-center text-xs text-muted-foreground">Catálogo e anúncios demonstrativos — preços sugeridos, sujeitos a alteração.</footer>
    </div>
  );
}

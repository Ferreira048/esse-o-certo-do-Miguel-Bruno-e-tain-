import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { enviarInteresse } from "@/lib/interesses.functions";
import { ChevronLeft, ChevronRight, Heart, Share2, MapPin, ShieldCheck, Flag, MessageCircle, Phone, User } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getListing, allListings, brl } from "@/lib/listings";

export const Route = createFileRoute("/anuncio/$id")({
  loader: ({ params }) => {
    const listing = getListing(params.id);
    if (!listing) throw notFound();
    return { listing };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.listing.title} — ${brl(loaderData.listing.price)}` : "Anúncio";
    const d = loaderData ? `${loaderData.listing.year} · ${loaderData.listing.km.toLocaleString("pt-BR")} km · ${loaderData.listing.city}` : "Anúncio Chevrolet";
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  notFoundComponent: () => (
    <div className="p-10 text-center">Anúncio não encontrado. <Link to="/" className="text-primary underline">Voltar</Link></div>
  ),
  component: ListingPage,
});

function ListingPage() {
  const { listing: l } = Route.useLoaderData();
  const [img, setImg] = useState(0);
  const [fav, setFav] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [down, setDown] = useState(Math.round(l.price * 0.3));
  const [months, setMonths] = useState(48);
  const rate = 0.0189;
  const financed = Math.max(l.price - down, 0);
  const installment = financed > 0 ? (financed * rate) / (1 - Math.pow(1 + rate, -months)) : 0;
  const n = l.images.length;

  const specs = l.kind === "catalog" ? [["Categoria", l.category], ["Motor", l.motor], ["Potência", l.power], ["Câmbio", l.gear], ["Combustível", l.fuel]] : [
    ["Categoria", l.category], ["Ano", l.year], ["Quilometragem", `${l.km.toLocaleString("pt-BR")} km`],
    ["Combustível", l.fuel], ["Câmbio", l.gear], ["Cor", l.color], ["Portas", String(l.doors)],
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <nav className="mb-4 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Comprar veículos</Link> › {l.category} › {l.title}
        </nav>
        <p className="mb-4 text-xs text-muted-foreground">{l.kind === "catalog" ? "Catálogo demonstrativo — preço sugerido e disponibilidade não confirmada." : "Anúncio demonstrativo — veículo e vendedor de exemplo."}</p>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-xl bg-ink shadow-card">
              <div className="relative">
                <img data-foto src={l.images[img]} alt={l.title} width={1280} height={832} className="aspect-[16/10] w-full object-contain" />
                <button data-foto-anterior aria-label="Foto anterior" onClick={() => setImg((img - 1 + n) % n)} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-card/90 p-2 text-foreground transition hover:scale-110"><ChevronLeft /></button>
                <button data-foto-proxima aria-label="Próxima foto" onClick={() => setImg((img + 1) % n)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-card/90 p-2 text-foreground transition hover:scale-110"><ChevronRight /></button>
                <span data-foto-numero className="absolute bottom-3 right-3 rounded-full bg-ink/80 px-3 py-1 text-xs text-ink-foreground">{img + 1} / {n}</span>
              </div>
              <div className="flex gap-2 p-3">
                {l.images.map((src, i) => (
                  <button key={i} data-miniatura={src} onClick={() => setImg(i)} className={`overflow-hidden rounded-md border-2 transition ${i === img ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <img src={src} alt="" loading="lazy" width={1280} height={832} className="h-16 w-24 object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <section className="rounded-xl bg-card p-6 shadow-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold">{l.title}</h1>
                  <p className="mt-1 text-xs text-muted-foreground">Publicado {l.postedAt} · Cód. {l.id.toUpperCase()}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" aria-label="Favoritar" onClick={() => { setFav(!fav); toast(fav ? "Removido dos favoritos" : "Adicionado aos favoritos"); }}>
                    <Heart className={fav ? "fill-primary text-primary" : ""} />
                  </Button>
                  <Button variant="outline" size="icon" aria-label="Compartilhar" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast("Link copiado"); }}>
                    <Share2 />
                  </Button>
                </div>
              </div>
              <p className="mt-4 text-3xl font-extrabold lg:hidden">{brl(l.price)}</p>

              <h2 className="mt-6 font-bold">Descrição</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{l.description}</p>

              <h2 className="mt-6 font-bold">Detalhes</h2>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
                {specs.map(([k, v]) => (
                  <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>
                ))}
              </dl>

              {l.extras.length > 0 && <h2 className="mt-6 font-bold">Opcionais</h2>}
              <div className="mt-3 flex flex-wrap gap-2">
                {l.extras.map((e) => <span key={e} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">{e}</span>)}
              </div>

              {l.kind !== "catalog" && <><h2 className="mt-6 font-bold">Localização</h2>
              <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{l.city}</p></>}
            </section>

            <section className="rounded-xl bg-card p-6 shadow-card">
              <h2 className="font-bold">Simulação de financiamento</h2>
              <p className="text-xs text-muted-foreground">Valor estimado, apenas referência. Taxa de 1,89% a.m.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm">Entrada
                  <Input data-entrada data-preco={l.price} type="number" value={down} min={0} max={l.price} onChange={(e) => setDown(Number(e.target.value))} className="mt-1" />
                </label>
                <label className="text-sm">Parcelas
                  <div className="mt-1 flex gap-2">
                    {[24, 36, 48, 60].map((m) => (
                      <Button key={m} data-meses={m} type="button" size="sm" variant={months === m ? "default" : "outline"} onClick={() => setMonths(m)}>{m}x</Button>
                    ))}
                  </div>
                </label>
              </div>
              <p className="mt-4 text-sm"><span data-meses-texto>{months}</span>x de <span data-parcela className="text-xl font-extrabold text-primary">{brl(installment)}</span></p>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-xl bg-card p-6 shadow-card">
              <p className="hidden text-3xl font-extrabold lg:block">{brl(l.price)}</p>
              <p className="mt-2 text-xs text-muted-foreground">Sua mensagem fica registrada para o vendedor.</p>
              <ContactForm key={l.id} id={l.id} title={l.title} />
              <Button data-telefone variant="outline" className="mt-2 w-full" onClick={() => setShowPhone(true)}>
                <Phone /> {showPhone ? "(11) 9XXXX-XX12 (exemplo)" : "Ver telefone"}
              </Button>
            </div>

            <div className="rounded-xl bg-card p-6 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-red text-primary-foreground"><User /></div>
                <div>
                  <p className="font-bold">{l.seller.name}</p>
                  <p className="text-xs text-muted-foreground">{l.kind === "catalog" ? "Modelo demonstrativo" : `${l.seller.type} · Na plataforma desde ${l.seller.since}`}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{l.kind === "catalog" ? l.seller.responds : `Costuma responder ${l.seller.responds}`}</p>
            </div>

            <div className="rounded-xl bg-ink p-5 text-sm text-ink-foreground">
              <p className="flex items-center gap-2 font-bold text-highlight"><ShieldCheck className="h-4 w-4" />Dicas de segurança</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 opacity-80">
                <li>Nunca faça pagamentos antecipados.</li>
                <li>Veja o veículo pessoalmente antes de fechar.</li>
                <li>Confira a documentação no Detran.</li>
              </ul>
            </div>
             <button onClick={() => toast("Denúncia demonstrativa; nenhum registro foi enviado.")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
              <Flag className="h-3.5 w-3.5" /> Denunciar anúncio
            </button>
          </aside>
        </div>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold">Anúncios semelhantes</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {allListings.filter((o) => o.id !== l.id && o.kind === l.kind).slice(0, 2).map((o) => (
              <Link key={o.id} to="/anuncio/$id" params={{ id: o.id }} onClick={() => setImg(0)} className="flex gap-4 overflow-hidden rounded-xl bg-card shadow-card transition hover:-translate-y-0.5">
                <img src={o.images[0]} alt={o.title} loading="lazy" width={1280} height={832} className="h-28 w-40 object-cover" />
                <div className="py-3 pr-3">
                  <p className="text-sm font-semibold">{o.title}</p>
                  <p className="font-extrabold">{brl(o.price)}</p>
                  <p className="text-xs text-muted-foreground">{o.year} · {o.city}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function ContactForm({ id, title }: { id: string; title: string }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  if (sent) return <p className="mt-4 rounded-lg bg-muted p-4 text-sm font-medium">Mensagem enviada! Ela ficou registrada no sistema.</p>;
  return (
    <form
      data-interesse
      data-anuncio={id}
      className="mt-4 space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setSending(true);
        try {
          await enviarInteresse({ data: { anuncioId: id, nome: String(f.get("nome")), email: String(f.get("email")), mensagem: String(f.get("mensagem")) } });
          setSent(true);
          toast("Mensagem enviada");
        } catch {
          toast("Não foi possível enviar agora. Tente de novo.");
        } finally {
          setSending(false);
        }
      }}
    >
      <Input required name="nome" maxLength={100} placeholder="Seu nome" />
      <Input required name="email" type="email" maxLength={200} placeholder="Seu e-mail" />
      <Textarea required name="mensagem" maxLength={1000} rows={3} defaultValue={`Olá! Tenho interesse no ${title}. Ainda está disponível?`} />
      <Button type="submit" disabled={sending} className="w-full font-bold"><MessageCircle /> {sending ? "Enviando..." : "Enviar mensagem"}</Button>
    </form>
  );
}

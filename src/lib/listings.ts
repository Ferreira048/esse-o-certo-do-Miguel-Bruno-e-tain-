import onix from "@/assets/onix.jpg";
import s10 from "@/assets/s10.jpg";
import tracker from "@/assets/tracker.jpg";
import catalogOnix from "@/assets/catalogo/onix.asset.json";
import catalogOnixPlus from "@/assets/catalogo/onix-plus.asset.json";
import catalogTracker from "@/assets/catalogo/tracker.asset.json";
import catalogSpin from "@/assets/catalogo/spin.asset.json";
import catalogEquinox from "@/assets/catalogo/equinox.asset.json";
import catalogS10 from "@/assets/catalogo/s10.asset.json";

export type Listing = {
  id: string;
  title: string;
  price: number;
  year: string;
  km: number;
  fuel: string;
  gear: string;
  color: string;
  doors: number;
  category: string;
  city: string;
  postedAt: string;
  images: string[];
  description: string;
  extras: string[];
  seller: { name: string; since: string; type: string; responds: string };
  kind?: "catalog";
  motor?: string;
  power?: string;
  highlight?: string;
};

// Anúncios demonstrativos — exemplos, não são veículos reais à venda.
export const listings: Listing[] = [
  {
    id: "onix-premier-2023",
    title: "Chevrolet Onix 1.0 Turbo Premier",
    price: 94900,
    year: "2023/2023",
    km: 18400,
    fuel: "Flex",
    gear: "Automático",
    color: "Vermelho",
    doors: 4,
    category: "Hatch",
    city: "São Paulo, SP",
    postedAt: "Hoje, 14:20",
    images: [onix, tracker, s10],
    description:
      "Onix Premier único dono, revisões feitas na concessionária, manual e chave reserva. Pneus novos, sem detalhes de lataria.",
    extras: ["Wi-Fi nativo", "Câmera de ré", "Ar-condicionado digital", "Multimídia MyLink", "6 airbags", "Partida por botão"],
    seller: { name: "Ricardo M.", since: "2019", type: "Particular", responds: "em até 1 hora" },
  },
  {
    id: "s10-high-country-2022",
    title: "Chevrolet S10 2.8 High Country 4x4 Diesel",
    price: 219900,
    year: "2022/2022",
    km: 42100,
    fuel: "Diesel",
    gear: "Automático",
    color: "Preto",
    doors: 4,
    category: "Picape",
    city: "Goiânia, GO",
    postedAt: "Ontem, 09:05",
    images: [s10, onix, tracker],
    description:
      "S10 High Country com tração 4x4, bancos em couro, capota marítima e protetor de caçamba. Todas as revisões em dia.",
    extras: ["Tração 4x4", "Bancos em couro", "Controle de descida", "Sensor de estacionamento", "Capota marítima"],
    seller: { name: "Auto Center Goiás", since: "2015", type: "Loja", responds: "em até 30 minutos" },
  },
  {
    id: "tracker-rs-2024",
    title: "Chevrolet Tracker 1.2 Turbo RS",
    price: 139500,
    year: "2024/2024",
    km: 7600,
    fuel: "Flex",
    gear: "Automático",
    color: "Branco",
    doors: 4,
    category: "SUV",
    city: "Curitiba, PR",
    postedAt: "18 out, 17:40",
    images: [tracker, s10, onix],
    description:
      "Tracker RS praticamente zero, ainda na garantia de fábrica. Teto solar panorâmico e pacote de segurança completo.",
    extras: ["Teto solar panorâmico", "Alerta de ponto cego", "Frenagem autônoma", "Carregador por indução", "Rodas aro 17"],
    seller: { name: "Fernanda L.", since: "2021", type: "Particular", responds: "em até 2 horas" },
  },
];

const catalogModels = [
  { id: "catalogo-onix", name: "Onix", category: "Hatch", price: 89990, image: catalogOnix.url, motor: "1.0 Turbo Flex", power: "116 cv", gear: "Automático 6 marchas", highlight: "" },
  { id: "catalogo-onix-plus", name: "Onix Plus", category: "Sedan", price: 99990, image: catalogOnixPlus.url, motor: "1.0 Turbo Flex", power: "116 cv", gear: "Automático 6 marchas", highlight: "" },
  { id: "catalogo-tracker", name: "Tracker", category: "SUV", price: 129990, image: catalogTracker.url, motor: "1.2 Turbo Flex", power: "133 cv", gear: "Automático 6 marchas", highlight: "" },
  { id: "catalogo-spin", name: "Spin", category: "Minivan", price: 119990, image: catalogSpin.url, motor: "1.8 Flex", power: "111 cv", gear: "Automático 6 marchas", highlight: "7 lugares" },
  { id: "catalogo-equinox", name: "Equinox", category: "SUV", price: 219990, image: catalogEquinox.url, motor: "1.5 Turbo", power: "172 cv", gear: "Automático 8 marchas", highlight: "Tração AWD" },
  { id: "catalogo-s10", name: "S10", category: "Picape", price: 249990, image: catalogS10.url, motor: "2.8 Turbo Diesel", power: "207 cv", gear: "Automático 8 marchas", highlight: "Tração 4x4" },
];

export const catalogListings: Listing[] = catalogModels.map((model) => ({
  id: model.id, title: `Chevrolet ${model.name}`, price: model.price,
  kind: "catalog", category: model.category, images: [model.image],
  motor: model.motor, power: model.power, gear: model.gear, highlight: model.highlight,
  year: "Não informado", km: 0, fuel: model.motor.includes("Diesel") ? "Diesel" : model.motor.includes("Flex") ? "Flex" : "Não informado",
  color: "Não informado", doors: 4, city: "Localização não informada", postedAt: "Catálogo demonstrativo",
  description: `Modelo do catálogo Chevrolet. Motor ${model.motor}, potência de ${model.power} e câmbio ${model.gear.toLowerCase()}. Preço sugerido, sujeito a alteração. Disponibilidade não confirmada.`,
  extras: model.highlight ? [model.highlight] : [],
  seller: { name: "Catálogo Chevrolet", since: "—", type: "Demonstrativo", responds: "Não há vendedor vinculado" },
}));

export const categories = ["Todos", "Hatch", "Sedan", "SUV", "Picape", "Minivan"];
export const filterListings = (items: Listing[], category: string) => category === "Todos" ? items : items.filter((item) => item.category === category);
export const allListings = [...listings, ...catalogListings];
export const getListing = (id: string) => allListings.find((l) => l.id === id);

export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

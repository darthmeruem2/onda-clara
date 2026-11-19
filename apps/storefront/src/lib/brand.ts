const name = process.env.NEXT_PUBLIC_STORE_NAME?.trim() || "Casa da Reforma Iguaí"
const originalLogo = "/images/casa/logo-casa-da-reforma-iguai.webp"
const whatsapp = (process.env.NEXT_PUBLIC_STORE_WHATSAPP || "5511958061464").replace(/\D/g, "")

export const brand = {
  name,
  wordmark: name,
  logo: process.env.NEXT_PUBLIC_STORE_LOGO || originalLogo,
  originalLogo,
  tagline: "Locação de equipamentos e depósito de materiais de construção.",
  pageTitle: "Locação de equipamentos para obra em Santo André",
  description: "Catálogo de ferramentas e equipamentos para construção e reforma em Santo André, SP. Consulte disponibilidade, retirada e entrega pelo WhatsApp.",
  region: "Santo André, SP",
  email: process.env.NEXT_PUBLIC_STORE_EMAIL,
  whatsapp: whatsapp ? `https://wa.me/${whatsapp}` : undefined,
  phoneLabel: whatsapp === "5511958061464" ? "(11) 95806-1464" : undefined,
  instagram: process.env.NEXT_PUBLIC_STORE_INSTAGRAM || "https://www.instagram.com/casadareformaiguai_ofc/",
  rentalCatalog: process.env.NEXT_PUBLIC_STORE_MODE !== "retail",
  campaign: {
    collectionHandle: "equipamentos-para-locacao",
    headline: ["Equipamento", "para a sua obra."],
    description: "Da betoneira à lavadora, alugue o que sua obra precisa e combine os detalhes pelo WhatsApp.",
    image: "/images/casa/campanha/obra-betoneira.webp",
    imageAlt: "Trabalhador ao lado de uma betoneira em uma obra residencial",
    editorial: {
      heading: "Do solo ao acabamento.",
      description: "Prepare a base, misture o concreto e faça os cortes com o equipamento da sua etapa. O catálogo cobre também demolição, trabalho em altura e limpeza.",
      image: "/images/casa/campanha/andaime-obra.webp",
      imageAlt: "Andaimes metálicos instalados ao lado de uma parede de tijolos em construção",
      detailImage: "/images/casa/campanha/compactador-detalhe.webp",
      detailImageAlt: "Detalhe de um compactador de placa no solo de uma obra",
    },
    featuredHandles: [
      "escada-de-fibra-de-vidro",
      "betoneira",
      "compactador-de-solo",
      "martelo-demolidor-15-20-30-kg",
      "cortador-de-piso",
      "lavadora-de-alta-pressao",
    ],
  },
} as const

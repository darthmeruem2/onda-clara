const name = process.env.NEXT_PUBLIC_STORE_NAME?.trim() || "Casa da Reforma Iguaí"
const whatsapp = (process.env.NEXT_PUBLIC_STORE_WHATSAPP || "5511958061464").replace(/\D/g, "")

export const brand = {
  name,
  wordmark: name,
  logo: process.env.NEXT_PUBLIC_STORE_LOGO || "/images/casa/logo-casa-da-reforma-iguai.webp",
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
    headline: "Equipamentos para sua obra.",
    description: "Ferramentas e máquinas para construção, reforma e manutenção. Consulte disponibilidade e peça seu orçamento de locação em Santo André.",
    image: "/images/casa/betoneira.webp",
    imageAlt: "Betoneira para locação na Casa da Reforma Iguaí",
    productHandle: "betoneira",
    productTitle: "Betoneira",
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

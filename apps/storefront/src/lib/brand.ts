const name = process.env.NEXT_PUBLIC_STORE_NAME?.trim() || "Onda Clara"
const whatsapp = process.env.NEXT_PUBLIC_STORE_WHATSAPP?.replace(/\D/g, "")

export const brand = {
  name,
  wordmark: name,
  logo: process.env.NEXT_PUBLIC_STORE_LOGO,
  tagline: "Linho e alfaiataria para vestir no seu ritmo.",
  pageTitle: "Linho e alfaiataria feminina",
  description: `Moda feminina em linho e alfaiataria leve. Conheça as camisas, calças, vestidos e coletes da ${name}.`,
  email: process.env.NEXT_PUBLIC_STORE_EMAIL,
  whatsapp: whatsapp ? `https://wa.me/${whatsapp}` : undefined,
  instagram: process.env.NEXT_PUBLIC_STORE_INSTAGRAM,
  campaign: {
    title: "Entre Marés",
    collectionHandle: "entre-mares",
    headline: "Dias de linho, tempo de mar.",
    description: "Modelagens leves e tons que vieram do litoral.",
    image: "/images/campanha-entre-mares.webp",
    editorial: {
      title: "O linho em movimento",
      description:
        "Alças largas, decote quadrado e saia que acompanha o passo. Veja de perto o Vestido Maré em linho oliva.",
      image: "/images/editorial-vestido-mare.webp",
      imageAlt: "Modelo com o Vestido Maré em linho oliva junto a uma fachada de terracota",
      productHandle: "vestido-mare",
      productTitle: "Vestido Maré",
    },
  },
} as const

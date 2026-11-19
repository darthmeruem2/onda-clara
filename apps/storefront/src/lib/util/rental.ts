import { brand } from "@lib/brand"

export function rentalQuoteUrl(productTitle?: string) {
  if (!brand.whatsapp) return undefined

  const url = new URL(brand.whatsapp)
  url.searchParams.set("text", productTitle
    ? `Olá! Gostaria de consultar a disponibilidade e o valor da locação de ${productTitle}.`
    : "Olá! Gostaria de solicitar um orçamento de locação de equipamentos.")
  return url.toString()
}

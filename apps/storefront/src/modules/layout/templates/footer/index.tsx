import { brand } from "@lib/brand"
import { listCategories } from "@lib/data/categories"
import { rentalQuoteUrl } from "@lib/util/rental"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Wordmark from "@modules/layout/components/wordmark"

const helpLinks = [
  ["Atendimento", "/contact"],
  ["Entregas", "/shipping"],
  ["Trocas e devoluções", "/returns"],
  ["Privacidade", "/privacy"],
  ["Termos de uso", "/terms"],
]

const rentalLinks = [
  ["Como funciona", "/#como-funciona"],
  ["Atendimento", "/contact"],
  ["Condições da locação", "/terms"],
  ["Privacidade", "/privacy"],
]

export default async function Footer() {
  const categories = await listCategories({ fields: "id,name,handle,parent_category_id" })
  const { rentalCatalog, whatsapp, instagram } = brand
  const contactUrl = rentalCatalog ? rentalQuoteUrl() : whatsapp

  return (
    <footer className="oc-footer">
      <div className="content-container">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 py-10 md:grid-cols-[1.6fr_1fr_1fr] md:gap-8 md:py-14">
          <div className="col-span-2 md:col-span-1">
            <LocalizedClientLink href="/" className="oc-wordmark oc-footer-brand"><Wordmark /></LocalizedClientLink>
            <p className="mt-4 max-w-xs">{brand.tagline}</p>
            <LocalizedClientLink href="/sobre" className="mt-3 inline-block underline underline-offset-4">Sobre a empresa</LocalizedClientLink>
          </div>
          <div>
            <h2 className="mb-3 font-bold">Catálogo</h2>
            <ul className="grid gap-3">
              <li><LocalizedClientLink href="/store">{rentalCatalog ? "Todos os equipamentos" : "Todos os produtos"}</LocalizedClientLink></li>
              {categories.filter((category) => !category.parent_category_id).slice(0, 8).map((category) => (
                <li key={category.id}><LocalizedClientLink href={`/categories/${category.handle}`}>{category.name}</LocalizedClientLink></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 font-bold">Atendimento</h2>
            <ul className="grid gap-3">
              {(rentalCatalog ? rentalLinks : helpLinks).map(([label, href]) => <li key={href}><LocalizedClientLink href={href}>{label}</LocalizedClientLink></li>)}
              {contactUrl && <li><a href={contactUrl} target="_blank" rel="noreferrer">WhatsApp{brand.phoneLabel ? ` ${brand.phoneLabel}` : ""}</a></li>}
              {instagram && <li><a href={instagram} target="_blank" rel="noreferrer">Instagram</a></li>}
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-2 border-t border-current/20 py-5 text-sm">
          <p>© {new Date().getFullYear()} {brand.name}</p>
          <p>{rentalCatalog ? brand.region : "Brasil · BRL R$"}</p>
        </div>
      </div>
    </footer>
  )
}

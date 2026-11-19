import { brand } from "@lib/brand"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Wordmark from "@modules/layout/components/wordmark"

const helpLinks = [
  ["Atendimento", "/contact"],
  ["Entregas", "/shipping"],
  ["Trocas e devoluções", "/returns"],
  ["Privacidade", "/privacy"],
  ["Termos de uso", "/terms"],
]

export default async function Footer() {
  const [categories, { collections }] = await Promise.all([
    listCategories({ fields: "id,name,handle,parent_category_id" }),
    listCollections({ fields: "id,handle,title" }),
  ])
  const { whatsapp, instagram } = brand

  return (
    <footer className="oc-footer">
      <div className="content-container">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 py-12 md:grid-cols-[1.6fr_1fr_1fr] md:gap-8 md:py-16">
          <div className="col-span-2 md:col-span-1">
            <LocalizedClientLink href="/" className="oc-wordmark inline-block text-[2.5rem]"><Wordmark /></LocalizedClientLink>
            <p className="mt-3 max-w-xs">{brand.tagline}</p>
            <LocalizedClientLink href="/sobre" className="mt-5 inline-block underline underline-offset-4">Sobre a marca</LocalizedClientLink>
          </div>
          <div>
            <h2 className="mb-3 font-semibold">Explore</h2>
            <ul className="grid gap-3">
              <li><LocalizedClientLink href="/store">Todas as peças</LocalizedClientLink></li>
              {categories.filter((category) => !category.parent_category_id).slice(0, 5).map((category) => (
                <li key={category.id}><LocalizedClientLink href={`/categories/${category.handle}`}>{category.name}</LocalizedClientLink></li>
              ))}
              {collections.slice(0, 2).map((collection) => (
                <li key={collection.id}><LocalizedClientLink href={`/collections/${collection.handle}`}>{collection.title}</LocalizedClientLink></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 font-semibold">Precisa de ajuda?</h2>
            <ul className="grid gap-3">
              {helpLinks.map(([label, href]) => <li key={href}><LocalizedClientLink href={href}>{label}</LocalizedClientLink></li>)}
              {whatsapp && <li><a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></li>}
              {instagram && <li><a href={instagram} target="_blank" rel="noreferrer">Instagram</a></li>}
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-2 border-t border-current/20 py-5 text-xs">
          <p>© {new Date().getFullYear()} {brand.name}</p>
          <p>Brasil · BRL R$</p>
        </div>
      </div>
    </footer>
  )
}

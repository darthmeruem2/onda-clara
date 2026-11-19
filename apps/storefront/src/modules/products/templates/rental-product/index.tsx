import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { rentalQuoteUrl } from "@lib/util/rental"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

function textList(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []
}

export default function RentalProduct({ product }: { product: HttpTypes.StoreProduct }) {
  const category = product.categories?.[0]
  const metadata = product.metadata
  const image = product.thumbnail ?? product.images?.[0]?.url
  const alt = typeof metadata?.image_alt === "string" ? metadata.image_alt : product.title
  const applications = textList(metadata?.applications)
  const quoteDetails = textList(metadata?.quote_details)
  const quoteUrl = rentalQuoteUrl(product.title)

  return (
    <div className="content-container py-6 md:py-10" data-testid="rental-product">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[var(--brand-muted)]" aria-label="Localização no catálogo">
        <LocalizedClientLink className="underline underline-offset-4" href="/store">Equipamentos</LocalizedClientLink>
        {category && (
          <>
            <span aria-hidden="true">/</span>
            <LocalizedClientLink className="underline underline-offset-4" href={`/categories/${category.handle}`}>{category.name}</LocalizedClientLink>
          </>
        )}
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.title}</span>
      </nav>
      <div className="grid items-center gap-6 md:grid-cols-2 md:gap-12">
        {image && (
          <figure>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-ui-border-base bg-[var(--brand-sand)]">
              <Image src={image} alt={alt} fill preload className="object-contain p-2 md:p-4" sizes="(max-width: 767px) 96vw, 46vw" />
            </div>
            <figcaption className="mt-2 text-sm text-[var(--brand-muted)]">Imagem ilustrativa</figcaption>
          </figure>
        )}
        <div className="min-w-0">
          {category && <p className="mb-2 font-semibold text-[var(--brand-blue,#075bc3)]">{category.name}</p>}
          <h1 className="oc-display text-4xl text-[var(--brand-ink)] md:text-6xl" data-testid="product-title">{product.title}</h1>
          <p className="my-5 max-w-prose leading-relaxed text-[var(--brand-muted)]" data-testid="product-description">{product.description}</p>
          <p className="mb-4 text-sm font-semibold">Valores e disponibilidade sob consulta.</p>
          {quoteUrl ? (
            <a className="oc-primary rounded-md" href={quoteUrl} target="_blank" rel="noreferrer" data-testid="rental-quote">
              Solicitar orçamento pelo WhatsApp
            </a>
          ) : (
            <LocalizedClientLink className="oc-primary rounded-md" href="/contact">Fale com a loja</LocalizedClientLink>
          )}
        </div>
      </div>
      {(applications.length > 0 || quoteDetails.length > 0) && (
        <div className="mt-8 grid gap-4 md:mt-12 md:grid-cols-2">
          {[
            { title: "Onde usar", items: applications },
            { title: "O que informar no orçamento", items: quoteDetails },
          ].filter(({ items }) => items.length > 0).map(({ title, items }) => (
            <section key={title} className="rounded-lg bg-[var(--brand-sand)] p-5 md:p-7">
              <h2 className="oc-display text-2xl text-[var(--brand-ink)]">{title}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                {items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

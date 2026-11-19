import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

const pageSize = 24
type QueryValue = string | string[] | undefined
export type RentalSearch = { q?: QueryValue; categoria?: QueryValue; page?: QueryValue }

function readParam(value: QueryValue) {
  return (Array.isArray(value) ? value[0] : value)?.trim().slice(0, 160) ?? ""
}

export default async function RentalCatalog({
  countryCode,
  region,
  search,
  categoryHandle,
  collectionId,
  collectionHandle,
  title,
  description,
}: {
  countryCode: string
  region: HttpTypes.StoreRegion
  search: RentalSearch
  categoryHandle?: string
  collectionId?: string
  collectionHandle?: string
  title?: string
  description?: string
}) {
  const q = readParam(search.q)
  const category = categoryHandle ?? readParam(search.categoria)
  const page = Math.max(1, Number.parseInt(readParam(search.page), 10) || 1)
  const categories = (await listCategories({ fields: "id,name,handle,parent_category_id", limit: 100 }))
    .filter((item) => !item.parent_category_id)
  const selected = categories.find(({ handle }) => handle === category)
  const { response, nextPage } = await listProducts({
    countryCode,
    pageParam: page,
    queryParams: {
      limit: pageSize,
      ...(q ? { q } : {}),
      ...(selected ? { category_id: [selected.id] } : {}),
      ...(collectionId ? { collection_id: [collectionId] } : {}),
    },
  })
  const path = categoryHandle
    ? `/categories/${categoryHandle}`
    : collectionHandle ? `/collections/${collectionHandle}` : "/store"

  function link(filter?: string, pageNumber = 1, target = "/store") {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (filter) params.set("categoria", filter)
    if (pageNumber > 1) params.set("page", String(pageNumber))
    return params.size ? `${target}?${params}` : target
  }

  return (
    <section className="content-container py-9 md:py-14" aria-labelledby="catalogo-titulo">
      <h1 id="catalogo-titulo" className="oc-display text-4xl text-[var(--brand-ink)] md:text-6xl">
        {title ?? "Equipamentos para locação"}
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--brand-muted)]">
        {description ?? "Encontre o equipamento para sua obra e consulte disponibilidade e valores pelo WhatsApp."}
      </p>
      <form className="mt-6 flex w-full max-w-xl gap-2" action={`/${countryCode}${path}`} method="get" role="search">
        {selected && <input type="hidden" name="categoria" value={selected.handle} />}
        <label htmlFor="equipamento-q" className="sr-only">Buscar equipamentos</label>
        <input className="min-w-0 flex-1 rounded-md border border-ui-border-base px-3" id="equipamento-q" name="q" type="search" defaultValue={q} placeholder="Buscar equipamento" />
        <button className="oc-primary rounded-md" type="submit">Buscar</button>
      </form>
      <nav className="mt-5 flex flex-wrap gap-2" aria-label="Filtrar por categoria">
        {[{ id: "all", name: "Todos", handle: "" }, ...categories].map(({ id, name, handle }) => (
          <LocalizedClientLink
            key={id}
            href={link(handle, 1, collectionHandle ? path : "/store")}
            aria-current={(selected?.handle ?? "") === handle ? "page" : undefined}
            className="flex min-h-11 items-center rounded-md border border-ui-border-base px-3 text-sm text-[var(--brand-ink)] aria-[current=page]:border-current aria-[current=page]:bg-[var(--brand-sand)]"
          >
            {name}
          </LocalizedClientLink>
        ))}
      </nav>
      <p className="my-5 text-sm text-[var(--brand-muted)]">
        {response.count === 1 ? "1 equipamento" : `${response.count} equipamentos`}
      </p>
      {response.products.length ? (
        <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-5 md:grid-cols-3 xl:grid-cols-4" data-testid="rental-catalog">
          {response.products.map((product) => (
            <li key={product.id}><ProductPreview product={product} region={region} /></li>
          ))}
        </ul>
      ) : (
        <p className="py-8">Nenhum equipamento encontrado. Tente outro termo ou <LocalizedClientLink href="/store" className="underline">veja todo o catálogo</LocalizedClientLink>.</p>
      )}
      {(page > 1 || nextPage) && (
        <nav className="mt-7 flex gap-3" aria-label="Paginação">
          {page > 1 && <LocalizedClientLink className="underline" href={link(categoryHandle ? undefined : selected?.handle, page - 1, path)}>Página anterior</LocalizedClientLink>}
          {nextPage && <LocalizedClientLink className="underline" href={link(categoryHandle ? undefined : selected?.handle, nextPage, path)}>Próxima página</LocalizedClientLink>}
        </nav>
      )}
    </section>
  )
}

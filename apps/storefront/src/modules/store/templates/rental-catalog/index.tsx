import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { ArrowRightMini, MagnifyingGlass } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import styles from "./catalog.module.css"

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
  const requestedPage = Number.parseInt(readParam(search.page), 10)
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
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
    <section className={styles.catalog} aria-labelledby="catalogo-titulo">
      <header className={styles.heading}>
        <h1 id="catalogo-titulo">{title ?? "Equipamentos para locação"}</h1>
        <p>{description ?? "Escolha a categoria da sua obra ou busque pelo nome do equipamento. Consulte valores e disponibilidade pelo WhatsApp."}</p>
      </header>

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <h2 className={styles.categoryTitle}>Categorias</h2>
          <nav className={styles.filters} aria-label="Filtrar por categoria">
            {[{ id: "all", name: "Todos", handle: "" }, ...categories].map(({ id, name, handle }) => {
              const active = (selected?.handle ?? "") === handle
              return (
                <LocalizedClientLink
                  key={id}
                  href={link(handle, 1, collectionHandle ? path : "/store")}
                  aria-current={active ? "page" : undefined}
                  className={styles.filter}
                >
                  {name}
                  {active && <ArrowRightMini aria-hidden="true" />}
                </LocalizedClientLink>
              )
            })}
          </nav>
        </aside>

        <div className={styles.main}>
          <form className={styles.form} action={`/${countryCode}${path}`} method="get" role="search">
            {selected && <input type="hidden" name="categoria" value={selected.handle} />}
            <label htmlFor="equipamento-q" className={styles.search}>
              <MagnifyingGlass aria-hidden="true" />
              <span className="sr-only">Buscar equipamentos</span>
              <input id="equipamento-q" name="q" type="search" defaultValue={q} placeholder="Ex.: betoneira" />
            </label>
            <button className="oc-primary" type="submit">Buscar</button>
          </form>
          <div className={styles.results}>
            <p>{response.count === 1 ? "1 equipamento" : `${response.count} equipamentos`}</p>
            {(q || selected) && <LocalizedClientLink href="/store" className={styles.clear}>Limpar filtros</LocalizedClientLink>}
          </div>
          {response.products.length ? (
            <ul className={styles.products} data-testid="rental-catalog">
              {response.products.map((product) => (
                <li key={product.id}><ProductPreview product={product} region={region} /></li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>Nenhum equipamento encontrado. Tente outro termo ou <LocalizedClientLink href="/store" className="underline">veja todo o catálogo</LocalizedClientLink>.</p>
          )}
          {(page > 1 || nextPage) && (
            <nav className={styles.pagination} aria-label="Paginação">
              {page > 1 && <LocalizedClientLink href={link(categoryHandle ? undefined : selected?.handle, page - 1, path)}>Página anterior</LocalizedClientLink>}
              {nextPage && <LocalizedClientLink href={link(categoryHandle ? undefined : selected?.handle, nextPage, path)}>Próxima página</LocalizedClientLink>}
            </nav>
          )}
        </div>
      </div>
    </section>
  )
}

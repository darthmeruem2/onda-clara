import { Suspense } from "react"
import { MagnifyingGlass, ShoppingBag, User } from "@medusajs/icons"
import { showroom } from "@lib/showroom/catalog"
import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import Wordmark from "@modules/layout/components/wordmark"

export default async function Nav() {
  const categories = (await listCategories({ fields: "id,name,handle,parent_category_id" }))
    .filter((category) => !category.parent_category_id)
    .slice(0, 4)

  return (
    <header className="oc-header sticky top-0 z-40">
      <div className="oc-header-message">{showroom ? "Vitrine demonstrativa · compras indisponíveis" : "Envios para todo o Brasil"}</div>
      <nav className="oc-nav" aria-label="Navegação principal">
        <div className="min-w-0">
          <div className="md:hidden"><SideMenu categories={categories} demo={showroom} /></div>
          <div className="hidden items-center gap-5 md:flex xl:gap-7">
            <LocalizedClientLink href="/store" className="oc-nav-link">Loja</LocalizedClientLink>
            {categories.slice(0, 3).map((category) => (
              <LocalizedClientLink key={category.id} href={`/categories/${category.handle}`} className="oc-nav-link">
                {category.name}
              </LocalizedClientLink>
            ))}
          </div>
        </div>
        <LocalizedClientLink href="/" className="oc-wordmark" data-testid="nav-store-link">
          <Wordmark />
        </LocalizedClientLink>
        <div className="flex items-center justify-end gap-0 sm:gap-2">
          <LocalizedClientLink href="/search" aria-label="Buscar produtos" className="oc-icon-button" data-testid="nav-search-button">
            <MagnifyingGlass aria-hidden="true" />
          </LocalizedClientLink>
          {!showroom && <><div className="hidden md:block">
            <LocalizedClientLink href="/account" aria-label="Minha conta" className="oc-icon-button" data-testid="nav-account-link">
              <User aria-hidden="true" />
            </LocalizedClientLink>
          </div>
          <Suspense fallback={<LocalizedClientLink href="/cart" aria-label="Sacola" className="oc-icon-button"><ShoppingBag /></LocalizedClientLink>}>
            <CartButton />
          </Suspense></>}
        </div>
      </nav>
    </header>
  )
}

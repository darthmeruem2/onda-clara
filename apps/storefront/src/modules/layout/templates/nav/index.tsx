import { Suspense } from "react"
import { ChatBubble, MagnifyingGlass, ShoppingBag, User } from "@medusajs/icons"
import { brand } from "@lib/brand"
import { listCategories } from "@lib/data/categories"
import { showroom } from "@lib/showroom/catalog"
import { rentalQuoteUrl } from "@lib/util/rental"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import Wordmark from "@modules/layout/components/wordmark"

export default async function Nav() {
  const categories = (await listCategories({ fields: "id,name,handle,parent_category_id" }))
    .filter((category) => !category.parent_category_id)
    .slice(0, 8)
  const quote = brand.rentalCatalog ? rentalQuoteUrl() : undefined
  const showCommerce = !showroom && !brand.rentalCatalog
  const catalogLabel = brand.rentalCatalog ? "Equipamentos" : "Loja"

  return (
    <header className="oc-header sticky top-0 z-40">
      <div className="oc-header-message">
        {brand.rentalCatalog ? "Locação de equipamentos em Santo André, SP" : showroom ? "Vitrine demonstrativa" : brand.tagline}
      </div>
      <nav className="oc-nav" aria-label="Navegação principal">
        <div className="oc-nav-menu">
          <div className="md:hidden">
            <SideMenu categories={categories} showAccount={showCommerce} rental={brand.rentalCatalog} quote={quote} />
          </div>
          <div className="hidden items-center gap-5 md:flex xl:gap-8">
            <LocalizedClientLink href="/store" className="oc-nav-link">{catalogLabel}</LocalizedClientLink>
            {brand.rentalCatalog && <LocalizedClientLink href="/#como-funciona" className="oc-nav-link">Como funciona</LocalizedClientLink>}
            <LocalizedClientLink href="/sobre" className="oc-nav-link">Sobre</LocalizedClientLink>
          </div>
        </div>
        <LocalizedClientLink href="/" className="oc-wordmark oc-nav-brand" data-testid="nav-store-link">
          <Wordmark />
        </LocalizedClientLink>
        <div className="oc-nav-actions flex items-center justify-end sm:gap-2">
          <LocalizedClientLink href="/search" aria-label={`Buscar ${catalogLabel.toLowerCase()}`} className="oc-icon-button" data-testid="nav-search-button">
            <MagnifyingGlass aria-hidden="true" />
          </LocalizedClientLink>
          {quote && (
            <a href={quote} target="_blank" rel="noreferrer" className="oc-nav-quote" aria-label="Pedir orçamento no WhatsApp">
              <ChatBubble aria-hidden="true" />
              <span className="hidden lg:inline">Pedir orçamento</span>
            </a>
          )}
          {showCommerce && <><div className="hidden md:block">
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

import { Suspense } from "react"
import { showroom } from "@lib/showroom/catalog"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ImageGallery from "@modules/products/components/image-gallery"
import VariantImageGallery from "@modules/products/components/image-gallery/variant-image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductPrice from "@modules/products/components/product-price"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

export default function ProductTemplate({ product, region, countryCode }: ProductTemplateProps) {
  if (!product?.id) notFound()

  return (
    <>
      <div className="content-container py-5 md:py-8" data-testid="product-container">
        <nav aria-label="Localização na loja" className="mb-5 flex flex-wrap gap-2 text-sm text-ui-fg-subtle">
          <LocalizedClientLink href="/store" className="underline underline-offset-4">Loja</LocalizedClientLink>
          <span aria-hidden="true">/</span>
          <span>{product.title}</span>
        </nav>
        <div className="grid items-start gap-7 md:grid-cols-[1.35fr_1fr] lg:gap-16">
          <Suspense fallback={<ImageGallery images={product.images ?? []} title={product.title} />}>
            <VariantImageGallery product={product} />
          </Suspense>
          <div className="grid gap-5 md:sticky md:top-28">
            <ProductInfo product={product} />
            {showroom ? <div className="grid gap-2"><ProductPrice product={product} /><p className="text-sm text-ui-fg-subtle">Compras indisponíveis nesta vitrine.</p></div> : <ProductActions product={product} region={region} />}
            <ProductTabs product={product} />
          </div>
        </div>
      </div>
      <div className="content-container my-14 md:my-24" data-testid="related-products-container">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

import { brand } from "@lib/brand"
import { Text } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const price = brand.rentalCatalog ? undefined : getProductPrice({ product }).cheapestPrice

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group block">
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          alt={typeof product.metadata?.image_alt === "string" ? product.metadata.image_alt : product.title}
          size="full"
          isFeatured={isFeatured}
          contain={brand.rentalCatalog}
        />
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 text-sm">
          <Text className="font-medium text-[var(--brand-ink)]" data-testid="product-title">
            {product.title}
          </Text>
          <div className="flex items-center gap-x-2">
            {brand.rentalCatalog
              ? <span className="text-xs text-[var(--brand-muted)]">Sob consulta</span>
              : price && <PreviewPrice price={price} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

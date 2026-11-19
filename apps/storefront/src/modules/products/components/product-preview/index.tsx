import { ArrowUpRightMini } from "@medusajs/icons"
import { brand } from "@lib/brand"
import { Text } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import styles from "./preview.module.css"

export default function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const href = `/products/${product.handle}`
  const imageAlt = typeof product.metadata?.image_alt === "string" ? product.metadata.image_alt : product.title
  const category = product.categories?.[0]?.name

  if (brand.rentalCatalog) {
    return (
      <LocalizedClientLink href={href} className={`group ${styles.rentalCard}`}>
        <div data-testid="product-wrapper">
          <Thumbnail thumbnail={product.thumbnail} images={product.images} alt={imageAlt} size="full" contain className={styles.photo} />
          <div className={styles.summary}>
            {category && <span className={styles.category}>{category}</span>}
            <p className={styles.title} data-testid="product-title">{product.title}</p>
            <span className={styles.details}>Sob consulta <ArrowUpRightMini aria-hidden="true" /></span>
          </div>
        </div>
      </LocalizedClientLink>
    )
  }

  const price = getProductPrice({ product }).cheapestPrice

  return (
    <LocalizedClientLink href={href} className="group block">
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          alt={imageAlt}
          size="full"
          isFeatured={isFeatured}
        />
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 text-sm">
          <Text className="font-medium text-[var(--brand-ink)]" data-testid="product-title">
            {product.title}
          </Text>
          <div className="flex items-center gap-x-2">
            {price && <PreviewPrice price={price} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

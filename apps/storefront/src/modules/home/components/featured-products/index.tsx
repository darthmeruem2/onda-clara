import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import styles from "../../home.module.css"

export default async function FeaturedProducts({
  collection,
  region,
}: {
  collection?: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      ...(collection ? { collection_id: collection.id } : {}),
      limit: 4,
      fields: "*variants.calculated_price,*images",
    },
  })

  if (!products.length) {
    return null
  }

  return (
    <section className={styles.featured} aria-labelledby="featured-title">
      <div className={styles.sectionHeading}>
        <h2 id="featured-title">Peças da estação</h2>
        <LocalizedClientLink href="/store" className={styles.textLink}>
          Ver todas as peças
        </LocalizedClientLink>
      </div>
      <ul className={styles.productGrid}>
        {products.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
    </section>
  )
}

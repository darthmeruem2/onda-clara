import { brand } from "@lib/brand"
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
  const featuredHandles = brand.campaign.featuredHandles
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      ...(collection ? { collection_id: collection.id } : {}),
      ...(brand.rentalCatalog ? { handle: [...featuredHandles] } : {}),
      limit: featuredHandles.length,
      fields: "*variants.calculated_price,*images,+metadata",
    },
  })

  const featured = brand.rentalCatalog
    ? featuredHandles.flatMap((handle) => products.filter((product) => product.handle === handle))
    : products

  if (!featured.length) {
    return null
  }

  return (
    <section className={styles.featured} aria-labelledby="featured-title">
      <div className={styles.sectionHeading}>
        <h2 id="featured-title">Equipamentos em destaque</h2>
        <LocalizedClientLink href="/store" className={styles.textLink}>
          Ver catálogo completo
        </LocalizedClientLink>
      </div>
      <ul className={styles.productGrid}>
        {featured.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
    </section>
  )
}

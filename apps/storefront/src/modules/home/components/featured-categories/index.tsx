import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import styles from "../../home.module.css"

export default function FeaturedCategories({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[]
}) {
  if (!categories.length) {
    return null
  }

  return (
    <section className={styles.categories} aria-labelledby="category-title">
      <h2 id="category-title">Compre por categoria</h2>
      <ul>
        {categories.map(({ id, name, handle }) => (
          <li key={id}>
            <LocalizedClientLink href={`/categories/${handle}`}>
              {name}
            </LocalizedClientLink>
          </li>
        ))}
      </ul>
    </section>
  )
}

import { brand } from "@lib/brand"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // edit this function to define your related products logic
  const queryParams: HttpTypes.StoreProductListParams = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (brand.rentalCatalog && product.categories?.[0]) {
    queryParams.category_id = [product.categories[0].id]
  } else if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  if (!brand.rentalCatalog && product.tags) {
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[]
  }
  queryParams.is_giftcard = false

  const products = await listProducts({
    queryParams: { ...queryParams, limit: brand.rentalCatalog ? 5 : 12 },
    countryCode,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    ).slice(0, brand.rentalCatalog ? 4 : 12)
  })

  if (!products.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <h2 className="oc-display mb-7 text-4xl md:text-5xl">{brand.rentalCatalog ? "Outros equipamentos da categoria" : "Combine com"}</h2>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {products.map((product) => (
          <li key={product.id}>
            <Product region={region} product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}

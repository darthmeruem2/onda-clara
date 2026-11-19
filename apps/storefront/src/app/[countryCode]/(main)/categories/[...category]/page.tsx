import { brand } from "@lib/brand"
import { getRegion } from "@lib/data/regions"
import RentalCatalog from "@modules/store/templates/rental-catalog"
import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle } from "@lib/data/categories"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { parseOptionValueIds } from "@lib/util/product-option-filters"
import { getSiteOrigin } from "@lib/util/site"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<
    Record<string, string | string[] | undefined> & {
      sortBy?: SortOptions
      page?: string
      optionValueIds?: string | string[]
    }
  >
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { category, countryCode } = await props.params
  const [productCategory, origin] = await Promise.all([
    getCategoryByHandle(category),
    getSiteOrigin(),
  ])

  if (!productCategory) {
    notFound()
  }

  return {
    title: productCategory.name,
    description: productCategory.description || `Veja as peças de ${productCategory.name.toLowerCase()} da loja.`,
    alternates: {
      canonical: `${origin}/${countryCode}/categories/${category.join("/")}`,
    },
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams
  const optionValueIds = parseOptionValueIds(searchParams)

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  if (brand.rentalCatalog) {
    const region = await getRegion(params.countryCode)
    if (!region) notFound()
    return <RentalCatalog countryCode={params.countryCode} region={region} search={searchParams} categoryHandle={productCategory.handle} title={productCategory.name} description={productCategory.description ?? undefined} />
  }

  return (
    <CategoryTemplate
      category={productCategory}
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      optionValueIds={optionValueIds}
    />
  )
}

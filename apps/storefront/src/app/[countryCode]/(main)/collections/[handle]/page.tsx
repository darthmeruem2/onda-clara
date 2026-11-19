import { brand } from "@lib/brand"
import { getRegion } from "@lib/data/regions"
import RentalCatalog from "@modules/store/templates/rental-catalog"
import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCollectionByHandle } from "@lib/data/collections"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { parseOptionValueIds } from "@lib/util/product-option-filters"

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<
    Record<string, string | string[] | undefined> & {
      page?: string
      sortBy?: SortOptions
      optionValueIds?: string | string[]
    }
  >
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const collection = await getCollectionByHandle(params.handle)

  if (!collection || (brand.rentalCatalog && collection.handle === "entre-mares")) {
    notFound()
  }

  const metadata = {
    title: collection.title,
    description: `Conheça a coleção ${collection.title}.`,
    alternates: { canonical: `/${params.countryCode}/collections/${collection.handle}` },
  } as Metadata

  return metadata
}

export default async function CollectionPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams
  const optionValueIds = parseOptionValueIds(searchParams)

  const collection = await getCollectionByHandle(params.handle).then(
    (collection) => collection,
  )

  if (!collection || (brand.rentalCatalog && collection.handle === "entre-mares")) {
    notFound()
  }

  if (brand.rentalCatalog) {
    const region = await getRegion(params.countryCode)
    if (!region) notFound()
    return <RentalCatalog countryCode={params.countryCode} region={region} search={searchParams} collectionId={collection.id} collectionHandle={collection.handle} title={collection.title} />
  }

  return (
    <CollectionTemplate
      collection={collection}
      page={page}
      sortBy={sortBy}
      countryCode={params.countryCode}
      optionValueIds={optionValueIds}
    />
  )
}

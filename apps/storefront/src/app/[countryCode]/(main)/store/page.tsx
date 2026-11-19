import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getRegion } from "@lib/data/regions"
import { showroom } from "@lib/showroom/catalog"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Todas as peças",
  description: "Explore a coleção de linho e alfaiataria.",
}

export default async function StorePage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  if (showroom) {
    return (
      <section className="content-container py-10 md:py-16">
        <h1 className="oc-display mb-8 text-5xl">Todas as peças</h1>
        <PaginatedProducts sortBy="created_at" page={1} countryCode={countryCode} />
      </section>
    )
  }

  return <StoreTemplate currencyCode={region.currency_code} />
}

import { Metadata } from "next"
import { brand } from "@lib/brand"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import { toJsonLd } from "@lib/util/product-structured-data"
import { getSiteOrigin } from "@lib/util/site"
import { buildRegionsReturnPolicies } from "@lib/util/store-policies"
import RentalProcess from "@modules/home/components/rental-process"
import FeaturedCategories from "@modules/home/components/featured-categories"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import styles from "@modules/home/home.module.css"

export const dynamic = "force-static"
export const revalidate = 60

export async function generateMetadata(props: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await props.params
  const origin = await getSiteOrigin()
  const canonical = `${origin}/${countryCode}`
  const title = `${brand.name} | ${brand.pageTitle}`

  return {
    title: { absolute: title },
    description: brand.description,
    alternates: { canonical, languages: { "pt-BR": `${origin}/br` } },
    openGraph: {
      title,
      description: brand.description,
      locale: "pt_BR",
      type: "website",
      url: canonical,
      siteName: brand.name,
    },
    twitter: { card: "summary_large_image", title, description: brand.description },
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const [region, { collections }, categories, origin, regions, featuredResult] =
    await Promise.all([
      getRegion(countryCode),
      listCollections({ fields: "id,handle,title" }),
      listCategories({ fields: "id,name,handle,parent_category_id" }),
      getSiteOrigin(),
      listRegions(),
      listProducts({
        countryCode,
        queryParams: {
          handle: brand.campaign.productHandle,
          fields: "id,handle",
          limit: 1,
        },
      }),
    ])

  const collection = collections.find(({ handle }) => handle === brand.campaign.collectionHandle)
  const primaryCategories = categories.filter(({ parent_category_id }) => !parent_category_id).slice(0, 8)
  const [featuredProduct] = featuredResult.response.products
  const homeUrl = `${origin}/${countryCode}`
  const returnPolicies = brand.rentalCatalog ? [] : buildRegionsReturnPolicies(regions)
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: brand.name,
      url: origin,
      logo: new URL(brand.logo, origin).toString(),
      ...(brand.instagram ? { sameAs: [brand.instagram] } : {}),
      ...(returnPolicies.length ? { hasMerchantReturnPolicy: returnPolicies } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: brand.name,
      url: homeUrl,
      inLanguage: "pt-BR",
    },
  ]

  return (
    <div className={styles.home}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(structuredData) }}
      />
      <Hero hasFeaturedProduct={Boolean(featuredProduct)} />
      <FeaturedCategories categories={primaryCategories} />
      {region && <FeaturedProducts collection={collection} region={region} />}
      <RentalProcess />
    </div>
  )
}

import { getSiteOrigin } from "@lib/util/site"
import { showroom } from "@lib/showroom/catalog"
import type { MetadataRoute } from "next"

export default async function robots(): Promise<MetadataRoute.Robots> {
  if (showroom) return { rules: { userAgent: "*", disallow: "/" } }

  const origin = await getSiteOrigin()

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/*/cart",
        "/*/checkout",
        "/*/account",
        "/*/order/",
        "/buy/",
      ],
    },
    sitemap: `${origin}/sitemap.xml`,
  }
}

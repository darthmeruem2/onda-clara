import "server-only"

import { HttpTypes } from "@medusajs/types"
import data from "./catalog.json"

export const showroom = process.env.OC_SHOWROOM === "1"

export const showroomCatalog = data as unknown as {
  regions: HttpTypes.StoreRegion[]
  categories: HttpTypes.StoreProductCategory[]
  collections: HttpTypes.StoreCollection[]
  products: HttpTypes.StoreProduct[]
}

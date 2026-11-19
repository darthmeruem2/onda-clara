import { writeFile } from "node:fs/promises"

const backend = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"
const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
if (!key) throw new Error("Defina NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY.")

const request = async (path, query = {}) => {
  const response = await fetch(`${backend}/store/${path}?${new URLSearchParams(query)}`, {
    headers: { "x-publishable-api-key": key },
    signal: AbortSignal.timeout(15_000),
  })
  if (!response.ok) throw new Error(`Medusa retornou ${response.status} em ${path}.`)
  return response.json()
}

const { regions } = await request("regions")
const region = regions.find(({ countries }) => countries.some(({ iso_2 }) => iso_2 === "br"))
if (!region) throw new Error("A região Brasil precisa existir no Medusa.")
const [{ product_categories: categories }, { collections }, { products }] = await Promise.all([
  request("product-categories", { limit: "100", fields: "*category_children,*parent_category" }),
  request("collections", { limit: "100" }),
  request("products", {
    region_id: region.id,
    limit: "100",
    fields: "*categories,*collection,*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+tags,+material",
  }),
])
if (!products.length) throw new Error("Cadastre o catálogo da demonstração no Medusa primeiro.")

const storefront = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:8000"
const storefrontOrigin = new URL(storefront).origin
const portable = (value) => {
  if (Array.isArray(value)) return value.map(portable)
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, portable(item)]))
  }
  if (typeof value === "string" && value.startsWith(`${storefrontOrigin}/images/`)) {
    return value.slice(storefrontOrigin.length)
  }
  return value
}

const file = new URL("../apps/storefront/src/lib/showroom/catalog.json", import.meta.url)
await writeFile(file, JSON.stringify(portable({ regions: [region], categories, collections, products }), null, 2) + "\n")
console.log(`Vitrine exportada com ${products.length} produtos.`)

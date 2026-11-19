import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, MedusaError, ProductStatus } from "@medusajs/framework/utils"
import {
  createCollectionsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  updateCollectionsWorkflow,
  updateProductCategoriesWorkflow,
  updateProductsWorkflow,
  updatePromotionsWorkflow,
  updateRegionsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

import catalog from "../data/casa-reforma-catalog.json"

const storeName = "Casa da Reforma Iguaí"
const collectionHandle = "equipamentos-para-locacao"
const oldHandles = ["camisa-brisa", "calca-duna", "vestido-mare", "colete-sal"]
const oldCategories = ["camisas", "calcas", "vestidos", "alfaiataria"]

type CatalogProduct = {
  title: string
  handle: string
  category: string
  subtitle: string
  description: string
  image: string
  imageAlt: string
  keywords: string[]
  specs: { name: string; value: string }[]
  applications: string[]
  quoteDetails: string[]
  sourceUrl: string
  models?: string[]
}

async function archiveOndaClaraDemo(container: ExecArgs["container"], store: { id: string; name: string }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const [{ data: collections }, { data: categories }, { data: promotions }, { data: regions }] = await Promise.all([
    query.graph({ entity: "product_collection", fields: ["id", "metadata", "products.id", "products.handle", "products.status", "products.metadata"], filters: { handle: "entre-mares" } }),
    query.graph({ entity: "product_category", fields: ["id", "is_active", "products.handle"], filters: { handle: oldCategories } }),
    query.graph({ entity: "promotion", fields: ["id", "status"], filters: { code: "ONDA10" } }),
    query.graph({ entity: "region", fields: ["id", "payment_providers.id"], filters: { name: "Brasil" } }),
  ])
  const collection = collections[0]
  if (store.name === "Onda Clara" && !collection) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "A coleção demonstrativa Entre Marés não foi localizada.")
  }

  const products = (collection?.products ?? []).filter((product) => product && oldHandles.includes(product.handle))
  const legacyProducts = products.flatMap((product) => (
    product && (product.status !== ProductStatus.DRAFT || !product.metadata?.legacy_demo)
      ? [{ id: product.id, status: ProductStatus.DRAFT, metadata: { ...product.metadata, legacy_demo: true } }]
      : []
  ))
  if (legacyProducts.length) {
    await updateProductsWorkflow(container).run({ input: { products: legacyProducts } })
  }

  for (const category of categories) {
    if (category.is_active && (category.products ?? []).every((product) => product && oldHandles.includes(product.handle))) {
      await updateProductCategoriesWorkflow(container).run({
        input: { selector: { id: category.id }, update: { is_active: false, is_internal: true } },
      })
    }
  }

  if (collection && !collection.metadata?.legacy_demo &&
      (collection.products ?? []).every((product) => product && oldHandles.includes(product.handle))) {
    await updateCollectionsWorkflow(container).run({
      input: { selector: { id: collection.id }, update: { metadata: { ...collection.metadata, legacy_demo: true } } },
    })
  }

  const promotion = promotions[0]
  if (promotion && promotion.status !== "inactive") {
    await updatePromotionsWorkflow(container).run({
      input: { promotionsData: [{ id: promotion.id, status: "inactive" }] },
    })
  }

  const region = regions[0]
  const paymentProviders = (region?.payment_providers ?? []).flatMap((provider) => provider ? [provider.id] : [])
  if (region && paymentProviders.includes("pp_system_default")) {
    await updateRegionsWorkflow(container).run({
      input: {
        selector: { id: region.id },
        update: { payment_providers: paymentProviders.filter((id) => id !== "pp_system_default") },
      },
    })
  }

  if (store.name === "Onda Clara") {
    await updateStoresWorkflow(container).run({
      input: { selector: { id: store.id }, update: { name: storeName } },
    })
  }
}

export default async function seedCasaReforma({ container }: ExecArgs) {
  const replaceDemo = process.env.MEDUSA_REPLACE_ONDA_CLARA_DEMO === "true"
  const products: CatalogProduct[] = catalog.products
  const categories = catalog.categories
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const [{ data: stores }, { data: profiles }, { data: collections }, { data: currentCategories }, { data: currentProducts }] = await Promise.all([
    query.graph({ entity: "store", fields: ["id", "name", "default_sales_channel_id"] }),
    query.graph({ entity: "shipping_profile", fields: ["id"], filters: { type: "default" } }),
    query.graph({ entity: "product_collection", fields: ["id"], filters: { handle: collectionHandle } }),
    query.graph({ entity: "product_category", fields: ["id", "handle"], filters: { handle: categories.map(({ handle }) => handle) } }),
    query.graph({ entity: "product", fields: ["id", "handle"], filters: { handle: products.map(({ handle }) => handle) } }),
  ])
  const store = stores[0]
  const profile = profiles[0]
  const salesChannelId = store?.default_sales_channel_id
  if (!salesChannelId || !profile) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Aplique as migrations iniciais antes de importar o catálogo.")
  }

  if (replaceDemo && store.name !== "Onda Clara" && store.name !== storeName) {
    throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "A substituição é exclusiva da base demonstrativa da Onda Clara.")
  }

  const collection = collections[0] ?? (await createCollectionsWorkflow(container).run({
    input: {
      collections: [{
        title: "Equipamentos para locação",
        handle: collectionHandle,
        metadata: { rental_catalog: true, source_url: catalog.source },
      }],
    },
  })).result[0]

  const categoryIds = new Map(currentCategories.map(({ handle, id }) => [handle, id]))
  const missingCategories = categories.filter(({ handle }) => !categoryIds.has(handle))
  if (missingCategories.length) {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: { product_categories: missingCategories.map((category) => ({ ...category, is_active: true })) },
    })
    for (const { handle, id } of result) categoryIds.set(handle, id)
  }

  const assetBase = process.env.STOREFRONT_PUBLIC_URL || "http://localhost:8000"
  const existingHandles = new Set(currentProducts.map(({ handle }) => handle))
  const newProducts = products.filter(({ handle }) => !existingHandles.has(handle))
  if (newProducts.length) {
    await createProductsWorkflow(container).run({
      input: {
        products: newProducts.map((product) => {
          const image = new URL(product.image, assetBase).href
          const categoryId = categoryIds.get(product.category)
          if (!categoryId) {
            throw new MedusaError(MedusaError.Types.INVALID_DATA, `Categoria inválida para ${product.handle}.`)
          }
          return {
            title: product.title,
            handle: product.handle,
            subtitle: product.subtitle,
            description: product.description,
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: profile.id,
            collection_id: collection.id,
            category_ids: [categoryId],
            sales_channels: [{ id: salesChannelId }],
            thumbnail: image,
            images: [{ url: image }],
            options: [{ title: "Locação", values: ["Sob consulta"] }],
            variants: [{
              title: "Sob consulta",
              options: { Locação: "Sob consulta" },
              prices: [],
              manage_inventory: false,
            }],
            metadata: {
              quote_only: true,
              source_url: product.sourceUrl,
              image_alt: product.imageAlt,
              keywords: product.keywords,
              specifications: product.specs,
              applications: product.applications,
              quote_details: product.quoteDetails,
              ...(product.models?.length ? { models: product.models } : {}),
            },
          }
        }),
      },
    })
  }

  if (replaceDemo) {
    await archiveOndaClaraDemo(container, store)
  }
  logger.info(`Catálogo de locação: ${newProducts.length} equipamentos novos, ${currentProducts.length} já cadastrados.`)
}

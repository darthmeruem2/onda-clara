import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, MedusaError, Modules, ProductStatus } from "@medusajs/framework/utils"
import {
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createPromotionsWorkflow,
} from "@medusajs/medusa/core-flows"

const categories = [
  { name: "Camisas", handle: "camisas" },
  { name: "Calças", handle: "calcas" },
  { name: "Vestidos", handle: "vestidos" },
  { name: "Alfaiataria", handle: "alfaiataria" },
]

const catalog = [
  {
    title: "Camisa Brisa",
    handle: "camisa-brisa",
    category: "camisas",
    price: 249,
    weight: 220,
    colors: ["Off-white", "Areia"],
    subtitle: "Camisa de linho",
    description: "Modelagem ampla, mangas longas e abotoamento frontal. O tecido de linho leve cria um caimento solto para vestir por dentro, por fora ou aberto sobre outra peça.",
  },
  {
    title: "Calça Duna",
    handle: "calca-duna",
    category: "calcas",
    price: 329,
    weight: 380,
    colors: ["Areia", "Oliva"],
    subtitle: "Pantalona de linho",
    description: "Pantalona de cintura alta com pernas amplas e pregas frontais. O linho de toque macio acompanha o movimento e deixa a silhueta alongada.",
  },
  {
    title: "Vestido Maré",
    handle: "vestido-mare",
    category: "vestidos",
    price: 419,
    weight: 420,
    colors: ["Oliva", "Preto"],
    subtitle: "Vestido midi de linho",
    description: "Vestido midi com alças largas e caimento fluido. O decote reto e a textura do linho dão acabamento à peça.",
  },
  {
    title: "Colete Sal",
    handle: "colete-sal",
    category: "alfaiataria",
    price: 279,
    weight: 270,
    colors: ["Marfim", "Areia"],
    subtitle: "Colete de alfaiataria",
    description: "Colete de linho com botões frontais e recortes de alfaiataria. Pode ser usado sozinho ou aberto sobre uma camisa leve.",
  },
]

const sizes = ["P", "M", "G", "GG"]

export default async function seedOndaClara({ container }: ExecArgs) {
  if (process.env.MEDUSA_DEMO_MODE !== "true") {
    throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "Ative MEDUSA_DEMO_MODE em uma base de demonstração para cadastrar este catálogo.")
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const [stores, profiles, currentCollections, currentCategories, currentProducts] = await Promise.all([
    query.graph({ entity: "store", fields: ["default_sales_channel_id", "default_location_id"] }),
    query.graph({ entity: "shipping_profile", fields: ["id"], filters: { type: "default" } }),
    query.graph({ entity: "product_collection", fields: ["id"], filters: { handle: "entre-mares" } }),
    query.graph({ entity: "product_category", fields: ["id", "handle"], filters: { handle: categories.map(({ handle }) => handle) } }),
    query.graph({ entity: "product", fields: ["id", "handle"], filters: { handle: catalog.map(({ handle }) => handle) } }),
  ])
  const store = stores.data[0]
  const profile = profiles.data[0]
  if (!store?.default_sales_channel_id || !store.default_location_id || !profile) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Aplique as migrations iniciais antes de cadastrar o catálogo demonstrativo.")
  }

  const collection = currentCollections.data[0] ?? (await createCollectionsWorkflow(container).run({
    input: { collections: [{ title: "Entre Marés", handle: "entre-mares" }] },
  })).result[0]

  const missingCategories = categories.filter(({ handle }) => !currentCategories.data.some((category) => category.handle === handle))
  const insertedCategories = missingCategories.length
    ? (await createProductCategoriesWorkflow(container).run({
      input: { product_categories: missingCategories.map((category) => ({ ...category, is_active: true })) },
    })).result
    : []
  const categoryIds = new Map([...currentCategories.data, ...insertedCategories].map(({ handle, id }) => [handle, id]))

  const assetBase = (process.env.STOREFRONT_PUBLIC_URL || "http://localhost:8000").replace(/\/$/, "")
  const missingProducts = catalog.filter(({ handle }) => !currentProducts.data.some((product) => product.handle === handle))
  if (missingProducts.length) {
    await createProductsWorkflow(container).run({
      input: {
        products: missingProducts.map((product) => {
          const image = `${assetBase}/images/products/${product.handle}.webp`
          return {
            title: product.title,
            subtitle: product.subtitle,
            handle: product.handle,
            description: product.description,
            weight: product.weight,
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: profile.id,
            collection_id: collection.id,
            category_ids: [categoryIds.get(product.category)!],
            sales_channels: [{ id: store.default_sales_channel_id! }],
            thumbnail: image,
            images: [{ url: image }, { url: `${assetBase}/images/products/${product.handle}-detail.webp` }],
            options: [{ title: "Tamanho", values: sizes }, { title: "Cor", values: product.colors }],
            variants: product.colors.flatMap((color, index) => sizes.map((size) => ({
              title: `${size} / ${color}`,
              sku: `${product.handle.toUpperCase()}-${index + 1}-${size}`,
              manage_inventory: true,
              weight: product.weight,
              length: 28,
              width: 22,
              height: 5,
              options: { Tamanho: size, Cor: color },
              prices: [{ currency_code: "brl", amount: product.price }],
            }))),
          }
        }),
      },
    })
  }

  const inventory = container.resolve(Modules.INVENTORY)
  const inventoryItems = await inventory.listInventoryItems({
    sku: catalog.flatMap(({ handle, colors }) => colors.flatMap((_, index) => sizes.map((size) => `${handle.toUpperCase()}-${index + 1}-${size}`))),
  })
  const levels = await inventory.listInventoryLevels({
    inventory_item_id: inventoryItems.map(({ id }) => id),
    location_id: store.default_location_id,
  })
  const missingLevels = inventoryItems.filter(({ id }) => !levels.some(({ inventory_item_id }) => id === inventory_item_id))
  if (missingLevels.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: missingLevels.map(({ id }, index) => ({
          inventory_item_id: id,
          location_id: store.default_location_id!,
          stocked_quantity: index === 7 ? 0 : 12,
        })),
      },
    })
  }

  const { data: promotions } = await query.graph({ entity: "promotion", fields: ["id"], filters: { code: "ONDA10" } })
  if (!promotions.length) {
    await createPromotionsWorkflow(container).run({
      input: {
        promotionsData: [{
          code: "ONDA10",
          type: "standard",
          status: "active",
          application_method: { type: "percentage", target_type: "items", allocation: "across", value: 10 },
        }],
      },
    })
  }
}

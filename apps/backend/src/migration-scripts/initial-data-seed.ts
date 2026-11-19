import type { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows"
import { DEFAULT_REGION_STORE_POLICIES } from "../lib/region-store-policies"
import seedCasaReforma from "../scripts/seed-casa-reforma"
import seedOndaClara from "../scripts/seed-onda-clara"

export default async function initialDataSeed({ container }: { container: MedusaContainer }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const fulfillment = container.resolve(Modules.FULFILLMENT)
  const importRentalCatalog = process.env.MEDUSA_IMPORT_CASA_CATALOG === "true"
  const demo = !importRentalCatalog && process.env.MEDUSA_DEMO_MODE === "true"
  const mercadoPagoEnabled = !importRentalCatalog && ["test", "production"].includes(process.env.MERCADO_PAGO_MODE ?? "")
  const paymentProviders = mercadoPagoEnabled ? ["pp_mercadopago_br"] : demo ? ["pp_system_default"] : []
  const { result: [channel] } = await createSalesChannelsWorkflow(container).run({
    input: { salesChannelsData: [{ name: "Loja online" }] },
  })
  const { result: [key] } = await createApiKeysWorkflow(container).run({
    input: { api_keys: [{ title: "Loja online", type: "publishable", created_by: "" }] },
  })
  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: key.id, add: [channel.id] },
  })

  const { result: [location] } = await createStockLocationsWorkflow(container).run({
    input: {
      locations: [{
        name: "Estoque principal",
        address: {
          address_1: "",
          country_code: "br",
          ...(demo ? { city: "São Paulo", province: "SP", postal_code: "01001-000" } : {}),
        },
      }],
    },
  })
  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: location.id, add: [channel.id] },
  })
  await createStoresWorkflow(container).run({
    input: {
      stores: [{
        name: process.env.STORE_NAME || "Casa da Reforma Iguaí",
        supported_currencies: [{ currency_code: "brl", is_default: true }],
        default_sales_channel_id: channel.id,
        default_location_id: location.id,
      }],
    },
  })

  await createRegionsWorkflow(container).run({
    input: {
      regions: [{
        name: "Brasil",
        currency_code: "brl",
        countries: ["br"],
        payment_providers: paymentProviders,
        ...(demo ? { metadata: DEFAULT_REGION_STORE_POLICIES } : {}),
      }],
    },
  })
  await createTaxRegionsWorkflow(container).run({
    input: [{ country_code: "br", provider_id: "tp_system" }],
  })

  const { data: [profile] } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
    filters: { type: "default" },
  })
  const set = await fulfillment.createFulfillmentSets({
    name: "Entregas no Brasil",
    type: "shipping",
    service_zones: [{
      name: "Brasil",
      geo_zones: [{ country_code: "br", type: "country" }],
    }],
  })
  await link.create([
    {
      [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
      [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
    },
    {
      [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: set.id },
    },
  ])

  if (demo) {
    await createShippingOptionsWorkflow(container).run({
      input: [{
        name: "Entrega padrão",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: set.service_zones[0].id,
        shipping_profile_id: profile.id,
        type: { label: "Padrão", description: "De 4 a 8 dias úteis após o envio.", code: "standard" },
        prices: [{ currency_code: "brl", amount: DEFAULT_REGION_STORE_POLICIES.shipping_rate }],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      }, {
        name: "Entrega expressa",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: set.service_zones[0].id,
        shipping_profile_id: profile.id,
        type: { label: "Expressa", description: "De 2 a 4 dias úteis após o envio.", code: "express" },
        prices: [{ currency_code: "brl", amount: 39.9 }],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      }],
    })
    await seedOndaClara({ container, args: [] })
  }

  if (importRentalCatalog) {
    await seedCasaReforma({ container, args: [] })
  }
}

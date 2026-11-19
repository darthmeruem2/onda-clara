import type { CalculateShippingOptionPriceContext } from "@medusajs/framework/types"
import MelhorEnvioProviderService from "../service"

const provider = new MelhorEnvioProviderService({}, {
  token: "unit-test",
  mode: "sandbox",
  userAgent: "Onda Clara (loja@example.test)",
  services: "1,2",
})

const option = { id: "melhor-envio-2" }
const context = {
  shipping_address: { country_code: "br", postal_code: "20040-020" },
  from_location: { address: { postal_code: "01001-000" } },
  items: [{
    requires_shipping: true,
    unit_price: 249,
    quantity: 2,
    variant: { id: "variant_shirt", weight: 220, length: 28, width: 22, height: 5 },
  }],
} as CalculateShippingOptionPriceContext

afterEach(() => jest.restoreAllMocks())

it("quotes the configured service with normalized CEPs and weight in kilograms", async () => {
  const fetch = jest.spyOn(globalThis, "fetch").mockResolvedValue(
    Response.json([{ id: 2, price: "23.40" }])
  )
  await expect(provider.calculatePrice(option, {}, context)).resolves.toEqual({
    calculated_amount: 23.4,
    is_calculated_price_tax_inclusive: false,
  })
  const [url, request] = fetch.mock.calls[0]
  expect(url).toBe("https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate")
  expect(JSON.parse(String(request?.body))).toEqual({
    from: { postal_code: "01001000" },
    to: { postal_code: "20040020" },
    products: [{ id: "variant_shirt", weight: 0.22, length: 28, width: 22, height: 5, insurance_value: 249, quantity: 2 }],
    services: "2",
  })
})

it("does not quote without a valid Brazilian shipping CEP", async () => {
  const fetch = jest.spyOn(globalThis, "fetch")
  await expect(provider.calculatePrice(option, {}, { ...context, shipping_address: undefined }))
    .rejects.toThrow("CEP brasileiro")
  expect(fetch).not.toHaveBeenCalled()
})

it("rejects rates that the carrier cannot offer", async () => {
  jest.spyOn(globalThis, "fetch").mockResolvedValue(
    Response.json([{ id: 2, error: "Serviço indisponível" }])
  )
  await expect(provider.calculatePrice(option, {}, context)).rejects.toThrow("não atende")
})

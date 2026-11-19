import type { CalculateShippingOptionPriceContext } from "@medusajs/framework/types"
import { AbstractFulfillmentProviderService, MedusaError } from "@medusajs/framework/utils"
import { z } from "@medusajs/framework/zod"

type Options = {
  token: string
  mode: "sandbox" | "production"
  userAgent: string
  services: string
}

const productSchema = z.object({
  id: z.string(),
  weight: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
  length: z.number().positive(),
  insurance_value: z.number().nonnegative(),
  quantity: z.number().int().positive(),
})

const quoteSchema = z.array(z.object({
  id: z.coerce.string(),
  price: z.coerce.number().positive().optional(),
  error: z.string().optional(),
}))

const serviceId = (option: Record<string, unknown>) => {
  const match = typeof option.id === "string" && /^melhor-envio-([1-9]\d*)$/.exec(option.id)
  return match ? match[1] : undefined
}

const cep = (value: string | null | undefined) => value?.replace(/\D/g, "")

function quoteError(message: string) {
  return new MedusaError(MedusaError.Types.INVALID_DATA, message)
}

export default class MelhorEnvioProviderService extends AbstractFulfillmentProviderService {
  static identifier = "melhor-envio"
  private readonly services: string[]
  private readonly endpoint: string

  constructor(_container: Record<string, unknown>, private readonly options: Options) {
    super()
    if (!options.token?.trim() || !options.userAgent?.trim()) {
      throw quoteError("Configure o token e o identificador de contato do Melhor Envio.")
    }

    this.services = [...new Set(options.services.split(",").map((value) => value.trim()))]
    if (!this.services.every((id) => /^[1-9]\d*$/.test(id))) {
      throw quoteError("Informe IDs numéricos de serviços do Melhor Envio separados por vírgula.")
    }
    const host = options.mode === "production" ? "melhorenvio.com.br" : "sandbox.melhorenvio.com.br"
    this.endpoint = `https://${host}/api/v2/me/shipment/calculate`
  }

  async getFulfillmentOptions() {
    return this.services.map((id) => ({ id: `melhor-envio-${id}`, service_id: id }))
  }

  async validateOption(data: Record<string, unknown>) {
    return this.services.includes(serviceId(data) ?? "")
  }

  async canCalculate() {
    return true
  }

  async validateFulfillmentData(option: Record<string, unknown>) {
    const service = serviceId(option)
    if (!service || !this.services.includes(service)) {
      throw quoteError("A modalidade de frete selecionada está indisponível.")
    }
    return { service_id: service }
  }

  async calculatePrice(option: Record<string, unknown>, _data: Record<string, unknown>, context: CalculateShippingOptionPriceContext) {
    const { service_id } = await this.validateFulfillmentData(option)
    const from = cep(context.from_location?.address?.postal_code)
    const to = cep(context.shipping_address?.postal_code)

    if (context.shipping_address?.country_code?.toLowerCase() !== "br" || from?.length !== 8 || to?.length !== 8) {
      throw quoteError("Informe um CEP brasileiro válido para calcular o frete.")
    }

    const products = z.array(productSchema).min(1).safeParse(context.items
      .filter((item) => item.requires_shipping !== false)
      .map(({ variant, unit_price, quantity }) => ({
        id: variant?.id,
        weight: Number(variant?.weight) / 1000,
        width: variant?.width,
        height: variant?.height,
        length: variant?.length,
        insurance_value: Number(unit_price),
        quantity,
      })))

    if (!products.success) {
      throw quoteError("Os produtos do carrinho precisam ter peso e medidas para cotação.")
    }

    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.options.token}`,
        "User-Agent": this.options.userAgent,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: { postal_code: from },
        to: { postal_code: to },
        products: products.data,
        services: service_id,
      }),
      signal: AbortSignal.timeout(6000),
    }).catch(() => null)

    if (!response?.ok) {
      throw quoteError("Não foi possível consultar o frete. Tente novamente em instantes.")
    }

    const parsed = quoteSchema.safeParse(await response.json().catch(() => null))
    const quote = parsed.success ? parsed.data.find((entry) => entry.id === service_id) : undefined
    if (!quote?.price || quote.error) {
      throw quoteError("A modalidade selecionada não atende a este CEP ou carrinho.")
    }

    return { calculated_amount: quote.price, is_calculated_price_tax_inclusive: false }
  }

  async createFulfillment(data: Record<string, unknown>) {
    return { data: { service_id: data.service_id }, labels: [] }
  }

  async cancelFulfillment() {
    return {}
  }
}

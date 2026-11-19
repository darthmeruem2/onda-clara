import type {
  AuthorizePaymentInput,
  CancelPaymentInput,
  CapturePaymentInput,
  DeletePaymentInput,
  GetPaymentStatusInput,
  InitiatePaymentInput,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RetrievePaymentInput,
  UpdatePaymentInput,
  WebhookActionResult,
} from "@medusajs/framework/types"
import { AbstractPaymentProvider, PaymentActions, PaymentSessionStatus } from "@medusajs/framework/utils"
import {
  getCheckoutState,
  idempotencyKey,
  matchesOrder,
  MEDUSA_SESSION_ID,
  MercadoPagoClient,
  type MercadoPagoOrder,
  toBRL,
  validCheckoutUrl,
} from "./client"

type Options = {
  accessToken?: string
  webhookSecret?: string
  storefrontUrl?: string
  sandbox: boolean
  installments?: string
}

type CheckoutData = {
  session_id: string
  amount: string
  mp_order_id: string | null
  checkout_url: string | null
}

function sessionData(data?: Record<string, unknown>): CheckoutData {
  if (
    typeof data?.session_id !== "string" ||
    !MEDUSA_SESSION_ID.test(data.session_id) ||
    typeof data.amount !== "string"
  ) {
    throw new Error("Sessão do Mercado Pago inválida.")
  }

  return {
    session_id: data.session_id,
    amount: data.amount,
    mp_order_id: typeof data.mp_order_id === "string" ? data.mp_order_id : null,
    checkout_url: validCheckoutUrl(data.checkout_url) ? data.checkout_url : null,
  }
}

export default class MercadoPagoProvider extends AbstractPaymentProvider<Options> {
  static identifier = "mercadopago"
  private readonly api: MercadoPagoClient
  private readonly returnUrl: string

  static validateOptions(options: Options) {
    if (!options.accessToken?.trim() || !options.webhookSecret?.trim() || !options.storefrontUrl) {
      throw new Error("Configure o token, o segredo do webhook e a URL da loja para ativar o Mercado Pago.")
    }

    const url = new URL(options.storefrontUrl)
    if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
      throw new Error("Informe a origem HTTPS da loja nas configurações do Mercado Pago.")
    }

    if (options.installments && !/^(?:[1-9]|1[0-2])$/.test(options.installments)) {
      throw new Error("O limite de parcelas do Mercado Pago deve estar entre 1 e 12.")
    }
  }

  constructor(container: Record<string, unknown>, private readonly options: Options) {
    super(container, options)
    MercadoPagoProvider.validateOptions(options)
    this.api = new MercadoPagoClient(options.accessToken!)
    this.returnUrl = new URL("/api/mercado-pago-return", options.storefrontUrl).href
  }

  async initiatePayment(input: InitiatePaymentInput) {
    if (input.currency_code.toLowerCase() !== "brl" || typeof input.data?.session_id !== "string") {
      throw new Error("O Mercado Pago está disponível somente em reais.")
    }

    const data = {
      session_id: input.data.session_id,
      amount: toBRL(input.amount),
      mp_order_id: null,
      checkout_url: null,
    }

    return { id: data.session_id, data, status: PaymentSessionStatus.PENDING }
  }

  async updatePayment(input: UpdatePaymentInput) {
    const data = sessionData(input.data)
    const amount = toBRL(input.amount)

    if (input.currency_code.toLowerCase() !== "brl" || (data.mp_order_id && data.amount !== amount)) {
      throw new Error("A sessão do Mercado Pago já está vinculada ao valor do pedido.")
    }

    return { data: { ...data, amount } }
  }

  async authorizePayment(input: AuthorizePaymentInput) {
    const data = sessionData(input.data)

    if (!data.mp_order_id) {
      const order = await this.api.request<MercadoPagoOrder>("/v1/orders", {
        type: "online",
        processing_mode: "manual",
        capture_mode: "automatic_async",
        total_amount: data.amount,
        external_reference: data.session_id,
        expiration_time: "P1D",
        items: [{ title: "Compra online", quantity: 1, unit_price: data.amount }],
        config: {
          online: {
            success_url: this.returnUrl,
            failure_url: this.returnUrl,
            pending_url: this.returnUrl,
            auto_return: "approved",
          },
          ...(this.options.installments
            ? { payment_method: { max_installments: Number(this.options.installments) } }
            : {}),
        },
      }, idempotencyKey("create-order", data.session_id))

      if (!matchesOrder(order, { sessionId: data.session_id, amount: data.amount, sandbox: this.options.sandbox }) ||
        !validCheckoutUrl(order.checkout_url)) {
        throw new Error("O Mercado Pago retornou uma cobrança incompatível com o pedido.")
      }

      return {
        status: PaymentSessionStatus.PENDING_AUTHORIZATION,
        data: { ...data, mp_order_id: order.id, checkout_url: order.checkout_url },
      }
    }

    return this.getPaymentStatus(input)
  }

  async getPaymentStatus(input: GetPaymentStatusInput) {
    const data = sessionData(input.data)
    if (!data.mp_order_id) {
      return { data, status: PaymentSessionStatus.PENDING }
    }

    const state = getCheckoutState(await this.loadOrder(data))
    const status = state === "paid" ? PaymentSessionStatus.CAPTURED : PaymentSessionStatus.PENDING_AUTHORIZATION
    return { data, status }
  }

  async capturePayment(input: CapturePaymentInput) {
    const data = sessionData(input.data)
    if (getCheckoutState(await this.loadOrder(data)) !== "paid") {
      throw new Error("A captura ainda não foi confirmada pelo Mercado Pago.")
    }

    return { data }
  }

  async cancelPayment(input: CancelPaymentInput) {
    const data = sessionData(input.data)
    if (!data.mp_order_id) {
      return { data }
    }

    const state = getCheckoutState(await this.loadOrder(data))
    if (state === "paid") {
      throw new Error("Reembolse o pagamento capturado antes de cancelar o pedido.")
    }

    if (state === "ready" || state === "pending") {
      await this.api.request(
        `/v1/orders/${data.mp_order_id}/cancel`,
        undefined,
        idempotencyKey("cancel-order", data.mp_order_id)
      )
    }
    return { data }
  }

  async deletePayment(input: DeletePaymentInput) {
    if (!input.data?.mp_order_id) {
      return {}
    }
    return this.cancelPayment(input)
  }

  async refundPayment(input: RefundPaymentInput) {
    const data = sessionData(input.data)
    if (!data.mp_order_id || !input.context?.idempotency_key) {
      throw new Error("O estorno exige uma cobrança e uma chave de idempotência.")
    }

    const order = await this.loadOrder(data)
    const amount = toBRL(input.amount)
    const body = Number(amount) === Number(data.amount) && order.status_detail !== "partially_refunded"
      ? undefined
      : { transactions: await this.refundTransactions(data.mp_order_id, amount) }

    await this.api.request(
      `/v1/orders/${data.mp_order_id}/refund`,
      body,
      idempotencyKey("refund-order", data.mp_order_id, input.context.idempotency_key)
    )
    return { data }
  }

  async retrievePayment(input: RetrievePaymentInput) {
    return { data: sessionData(input.data) }
  }

  async getWebhookActionAndData(_payload: ProviderWebhookPayload["payload"]): Promise<WebhookActionResult> {
    // The native listener omits the query parameter signed by Mercado Pago.
    return { action: PaymentActions.NOT_SUPPORTED }
  }

  private async loadOrder(data: CheckoutData) {
    if (!data.mp_order_id) {
      throw new Error("Cobrança do Mercado Pago ainda não criada.")
    }

    const order = await this.api.getOrder(data.mp_order_id)
    if (!matchesOrder(order, {
      orderId: data.mp_order_id,
      sessionId: data.session_id,
      amount: data.amount,
      sandbox: this.options.sandbox,
    })) {
      throw new Error("Cobrança do Mercado Pago incompatível com a sessão.")
    }

    return order
  }

  private async refundTransactions(orderId: string, amount: string) {
    const order = await this.api.request<{ transactions?: { payments?: { id: string }[] } }>(
      `/v1/orders/${orderId}`
    )
    const payments = order.transactions?.payments
    if (payments?.length !== 1) {
      throw new Error("O estorno parcial exige um pagamento único no Mercado Pago.")
    }

    return [{ id: payments[0].id, amount }]
  }
}

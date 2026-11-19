import { createHash, createHmac, timingSafeEqual } from "node:crypto"

export const MERCADO_PAGO_PROVIDER = "pp_mercadopago_br"
export const MERCADO_PAGO_ORDER_ID = /^ORD(?:TST)?[A-Z0-9]{10,60}$/i
export const MEDUSA_SESSION_ID = /^payses_[A-Za-z0-9]{10,64}$/

export type MercadoPagoOrder = {
  id: string
  type: string
  external_reference: string
  currency: string
  total_amount: string
  total_paid_amount?: string
  status: string
  status_detail: string
  checkout_url?: string
}

export type CheckoutState = "paid" | "pending" | "ready" | "failed" | "closed"

export function getCheckoutState(order: MercadoPagoOrder): CheckoutState {
  if (order.status === "processed" && order.status_detail === "accredited") {
    return "paid"
  }

  if (["failed", "canceled", "expired"].includes(order.status)) {
    return "failed"
  }

  if (["refunded", "charged_back", "processed"].includes(order.status)) {
    return "closed"
  }

  return order.status === "created" ? "ready" : "pending"
}

export function toBRL(amount: unknown): string {
  const value = Number(amount)
  const cents = Math.round(value * 100)

  if (!Number.isFinite(value) || value <= 0 || !Number.isSafeInteger(cents) || cents === 0) {
    throw new Error("Valor inválido para o Mercado Pago.")
  }

  return (cents / 100).toFixed(2)
}

export function validCheckoutUrl(value: unknown): value is string {
  if (typeof value !== "string") {
    return false
  }

  try {
    const url = new URL(value)
    return url.origin === "https://www.mercadopago.com.br" &&
      url.pathname.startsWith("/checkout/") && !url.username && !url.password
  } catch {
    return false
  }
}

export function matchesOrder(
  order: MercadoPagoOrder,
  expected: { orderId?: string; sessionId: string; amount: string; sandbox: boolean }
): boolean {
  return typeof order.id === "string" &&
    MERCADO_PAGO_ORDER_ID.test(order.id) &&
    order.id.toUpperCase().startsWith("ORDTST") === expected.sandbox &&
    (!expected.orderId || order.id === expected.orderId) &&
    order.type === "online" &&
    order.external_reference === expected.sessionId &&
    order.currency === "BRL" &&
    Number(order.total_amount) === Number(expected.amount) &&
    (getCheckoutState(order) !== "paid" || Number(order.total_paid_amount) === Number(expected.amount))
}

export function idempotencyKey(...parts: string[]): string {
  const hash = createHash("sha256").update(JSON.stringify(parts)).digest("hex")
  return [hash.slice(0, 8), hash.slice(8, 12), `4${hash.slice(13, 16)}`, `8${hash.slice(17, 20)}`, hash.slice(20, 32)].join("-")
}

export function verifyNotification(
  signature: string | undefined,
  requestId: string | undefined,
  resourceId: string,
  secret: string,
  now = Date.now()
): boolean {
  if (!signature || !requestId || !secret || !MERCADO_PAGO_ORDER_ID.test(resourceId)) {
    return false
  }

  const parts = new Map<string, string>()

  for (const entry of signature.split(",")) {
    const [key, value] = entry.trim().split("=")
    if (parts.has(key) || !value) {
      return false
    }
    parts.set(key, value)
  }

  const timestamp = parts.get("ts")
  const digest = parts.get("v1")

  if (!timestamp || !/^\d{10,13}$/.test(timestamp) || !digest || !/^[a-f0-9]{64}$/i.test(digest)) {
    return false
  }

  const timestampMs = timestamp.length === 13 ? Number(timestamp) : Number(timestamp) * 1000
  if (Math.abs(now - timestampMs) > 5 * 60 * 1000) {
    return false
  }

  const manifest = `id:${resourceId.toLowerCase()};request-id:${requestId};ts:${timestamp};`
  const expected = createHmac("sha256", secret).update(manifest).digest()
  return timingSafeEqual(expected, Buffer.from(digest, "hex"))
}

export class MercadoPagoClient {
  constructor(private readonly accessToken: string) {}

  getOrder(id: string): Promise<MercadoPagoOrder> {
    if (!MERCADO_PAGO_ORDER_ID.test(id)) {
      throw new Error("Identificador inválido de transação do Mercado Pago.")
    }

    return this.request(`/v1/orders/${encodeURIComponent(id)}`)
  }

  async request<T>(path: string, body?: unknown, key?: string): Promise<T> {
    const response = await fetch(`https://api.mercadopago.com${path}`, {
      method: key ? "POST" : "GET",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: "application/json",
        ...(key ? { "X-Idempotency-Key": key, "Content-Type": "application/json" } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(7000),
      redirect: "error",
    })

    if (!response.ok) {
      throw new Error(`O Mercado Pago retornou HTTP ${response.status}.`)
    }

    return await response.json() as T
  }
}

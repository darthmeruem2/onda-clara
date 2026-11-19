import { createHmac } from "node:crypto"
import {
  getCheckoutState,
  idempotencyKey,
  matchesOrder,
  type MercadoPagoOrder,
  validCheckoutUrl,
  verifyNotification,
} from "../client"

const now = 1782108161000
const orderId = "ORDTST01KS5AJ6HTK2HRQ3XJ3C2JCKP9"
const sessionId = "payses_01KS5AJ6HTK2HRQ3XJ3C2JCKP9"

function makeHeader(timestamp: number, resourceId = orderId) {
  const message = `id:${resourceId.toLowerCase()};request-id:test-request;ts:${timestamp};`
  const digest = createHmac("sha256", "unit-test-secret").update(message).digest("hex")
  return `ts=${timestamp},v1=${digest}`
}

const credited: MercadoPagoOrder = {
  id: orderId,
  type: "online",
  currency: "BRL",
  external_reference: sessionId,
  status: "processed",
  status_detail: "accredited",
  total_amount: "175.90",
  total_paid_amount: "175.9",
}

describe("Mercado Pago Orders", () => {
  it("verifies the official HMAC manifest with numeric timestamps in seconds and milliseconds", () => {
    for (const timestamp of [now, now / 1000]) {
      expect(verifyNotification(makeHeader(timestamp), "test-request", orderId, "unit-test-secret", now)).toBe(true)
    }
  })

  it("rejects altered identifiers, stale deliveries, duplicate digests and missing request ids", () => {
    const header = makeHeader(now)
    expect(verifyNotification(header, "test-request", orderId + "1", "unit-test-secret", now)).toBe(false)
    expect(verifyNotification(header, "test-request", orderId, "unit-test-secret", now + 301000)).toBe(false)
    expect(verifyNotification(header + ",v1=duplicate", "test-request", orderId, "unit-test-secret", now)).toBe(false)
    expect(verifyNotification(header, undefined, orderId, "unit-test-secret", now)).toBe(false)
  })

  it("requires the expected order, session, amount, currency and environment", () => {
    const expected = { orderId, sessionId, amount: "175.90", sandbox: true }
    expect(matchesOrder(credited, expected)).toBe(true)
    expect(matchesOrder({ ...credited, total_paid_amount: "174.90" }, expected)).toBe(false)
    expect(matchesOrder({ ...credited, currency: "USD" }, expected)).toBe(false)
    expect(matchesOrder({ ...credited, external_reference: sessionId + "1" }, expected)).toBe(false)
    expect(matchesOrder(credited, { ...expected, sandbox: false })).toBe(false)
  })

  it("distinguishes credited, pending, declined and refunded orders", () => {
    expect(getCheckoutState(credited)).toBe("paid")
    expect(getCheckoutState({ ...credited, status: "action_required", status_detail: "waiting_payment" })).toBe("pending")
    expect(getCheckoutState({ ...credited, status: "failed", status_detail: "rejected" })).toBe("failed")
    expect(getCheckoutState({ ...credited, status: "processed", status_detail: "partially_refunded" })).toBe("closed")
  })

  it("keeps retry keys stable and isolates independent operations", () => {
    const key = idempotencyKey("create-order", sessionId)
    expect(key).toMatch(/^[0-9a-f-]{36}$/)
    expect(idempotencyKey("create-order", sessionId)).toBe(key)
    expect(idempotencyKey("refund-order", sessionId)).not.toBe(key)
  })

  it("returns customers only to the Brazilian HTTPS checkout", () => {
    expect(validCheckoutUrl("https://www.mercadopago.com.br/checkout/v1/redirect?order_id=1")).toBe(true)
    expect(validCheckoutUrl("https://www.mercadopago.com.br.example.com/checkout/v1/redirect")).toBe(false)
    expect(validCheckoutUrl("http://www.mercadopago.com.br/checkout/v1/redirect")).toBe(false)
  })
})

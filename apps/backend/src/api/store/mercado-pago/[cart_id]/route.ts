import type { MedusaStoreRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  getCheckoutState,
  matchesOrder,
  MERCADO_PAGO_PROVIDER,
  MercadoPagoClient,
  toBRL,
  validCheckoutUrl,
} from "../../../../modules/mercado-pago/client"

export const GET = async (req: MedusaStoreRequest, res: MedusaResponse) => {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN
  const mode = process.env.MERCADO_PAGO_MODE
  const cartId = req.params.cart_id

  res.set("Cache-Control", "no-store")

  if (
    (mode !== "test" && mode !== "production") ||
    !accessToken ||
    !/^cart_[A-Za-z0-9]{10,64}$/.test(cartId)
  ) {
    return res.sendStatus(404)
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: [link] } = await query.graph({
    entity: "cart_payment_collection",
    fields: ["payment_collection_id", "cart.sales_channel_id", "cart.completed_at"],
    filters: { cart_id: cartId },
  })
  const salesChannels = req.publishable_key_context?.sales_channel_ids ?? []

  if (!link?.cart?.completed_at || !salesChannels.includes(link.cart.sales_channel_id ?? "")) {
    return res.sendStatus(404)
  }

  const payment = req.scope.resolve(Modules.PAYMENT)
  const [session] = await payment.listPaymentSessions({
    payment_collection_id: link.payment_collection_id,
    provider_id: MERCADO_PAGO_PROVIDER,
  }, { relations: ["payment"] })
  const orderId = session?.data?.mp_order_id

  if (typeof orderId !== "string") {
    return res.sendStatus(404)
  }

  try {
    const order = await new MercadoPagoClient(accessToken).getOrder(orderId)
    if (!matchesOrder(order, {
      orderId,
      sessionId: session.id,
      amount: toBRL(session.amount),
      sandbox: mode === "test",
    })) {
      return res.sendStatus(404)
    }

    const state = getCheckoutState(order)

    return res.json({
      state: state === "paid" && !session.payment?.captured_at ? "pending" : state,
      checkout_url: state === "ready" && validCheckoutUrl(session.data?.checkout_url)
        ? session.data.checkout_url
        : null,
    })
  } catch {
    return res.sendStatus(503)
  }
}

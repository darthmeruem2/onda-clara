import { ContainerRegistrationKeys, Modules, PaymentActions } from "@medusajs/framework/utils"
import { createStep, createWorkflow, StepResponse, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { cancelOrderWorkflow, processPaymentWorkflow } from "@medusajs/medusa/core-flows"
import {
  getCheckoutState,
  matchesOrder,
  MEDUSA_SESSION_ID,
  MERCADO_PAGO_PROVIDER,
  MercadoPagoClient,
  toBRL,
} from "../modules/mercado-pago/client"

const reconcileMercadoPagoOrder = createStep(
  "reconcile-mercado-pago-order",
  async (input: { orderId: string }, { container }) => {
    const client = new MercadoPagoClient(process.env.MERCADO_PAGO_ACCESS_TOKEN!)
    const order = await client.getOrder(input.orderId)

    const state = getCheckoutState(order)
    const expiredOrCanceled = order.status === "canceled" || order.status === "expired" ||
      (order.status === "failed" && order.status_detail === "expired")

    if (
      !MEDUSA_SESSION_ID.test(order.external_reference) ||
      (state !== "paid" && !expiredOrCanceled)
    ) {
      return new StepResponse()
    }

    const locking = container.resolve(Modules.LOCKING)
    const payments = container.resolve(Modules.PAYMENT)

    await locking.execute(`mercado-pago:${order.external_reference}`, async () => {
      const [session] = await payments.listPaymentSessions(
        { id: order.external_reference, provider_id: MERCADO_PAGO_PROVIDER },
        { relations: ["payment"] }
      )

      if (
        !session ||
        session.data?.mp_order_id !== input.orderId ||
        session.currency_code !== "brl" ||
        !matchesOrder(order, {
          orderId: input.orderId,
          sessionId: session.id,
          amount: toBRL(session.amount),
          sandbox: process.env.MERCADO_PAGO_MODE === "test",
        })
      ) {
        return
      }

      const query = container.resolve(ContainerRegistrationKeys.QUERY)
      const { data: [link] } = await query.graph({
        entity: "order_payment_collection",
        fields: ["order_id", "order.status"],
        filters: { payment_collection_id: session.payment_collection_id },
      })

      if (!link?.order) {
        throw new Error("O pedido ainda não foi registrado no Medusa.")
      }

      if (session.payment?.captured_at) {
        return
      }

      if (link.order.status === "canceled") {
        if (state === "paid") {
          throw new Error("O pedido já foi cancelado. Revise a cobrança no Mercado Pago.")
        }
        return
      }

      if (expiredOrCanceled) {
        await cancelOrderWorkflow(container).run({ input: { order_id: link.order_id } })
        return
      }

      await processPaymentWorkflow(container).run({
        input: {
          action: PaymentActions.SUCCESSFUL,
          data: { session_id: session.id, amount: session.amount },
        },
      })

      const fresh = await payments.retrievePaymentSession(session.id, { relations: ["payment"] })
      if (!fresh.payment?.captured_at) {
        throw new Error("O Medusa ainda não confirmou a captura.")
      }
    }, { timeout: 8 })

    return new StepResponse()
  }
)

export const reconcileMercadoPagoWebhook = createWorkflow(
  "reconcile-mercado-pago-webhook",
  function (input: { orderId: string }) {
    return new WorkflowResponse(reconcileMercadoPagoOrder(input))
  }
)

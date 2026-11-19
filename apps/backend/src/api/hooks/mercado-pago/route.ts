import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { verifyNotification } from "../../../modules/mercado-pago/client"
import { reconcileMercadoPagoWebhook } from "../../../workflows/mercado-pago-webhook"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const mode = process.env.MERCADO_PAGO_MODE
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET

  if ((mode !== "test" && mode !== "production") || !secret) {
    return res.sendStatus(404)
  }

  const orderId = req.query["data.id"]
  if (
    typeof orderId !== "string" ||
    !verifyNotification(req.get("x-signature"), req.get("x-request-id"), orderId, secret)
  ) {
    return res.sendStatus(401)
  }

  try {
    await reconcileMercadoPagoWebhook(req.scope).run({ input: { orderId: orderId.toUpperCase() } })
    return res.sendStatus(200)
  } catch {
    req.scope.resolve(ContainerRegistrationKeys.LOGGER).warn(
      `Não foi possível conciliar a cobrança do Mercado Pago ${orderId}.`
    )

    // A non-success response lets Mercado Pago retry an authenticated event.
    return res.sendStatus(503)
  }
}

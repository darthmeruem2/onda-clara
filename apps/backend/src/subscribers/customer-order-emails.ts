import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, FulfillmentWorkflowEvents, Modules, OrderWorkflowEvents, PaymentEvents } from "@medusajs/framework/utils"

const orderPlaced = OrderWorkflowEvents.PLACED
const paymentCaptured = PaymentEvents.CAPTURED
const shipmentCreated = FulfillmentWorkflowEvents.SHIPMENT_CREATED

function escapeHtml(text: string) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;")
}

export default async function sendOrderEmail({
  event: { name, data },
  container,
}: SubscriberArgs<{ id: string; no_notification?: boolean }>) {
  if (data.no_notification || !process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM) {
    return
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const isShipment = name === shipmentCreated
  const shipment = isShipment
    ? (await query.graph({
      entity: "fulfillment",
      fields: ["order.id", "labels.tracking_number"],
      filters: { id: data.id },
    })).data[0]
    : undefined
  const isCapture = name === paymentCaptured
  const payment = isCapture
    ? (await query.graph({
      entity: "payment",
      fields: ["payment_collection.order.id"],
      filters: { id: data.id },
    })).data[0]
    : undefined
  const orderId = isShipment ? shipment?.order?.id : isCapture ? payment?.payment_collection?.order?.id : data.id
  if (!orderId) return

  const { data: [order] } = await query.graph({
    entity: "order",
    fields: ["id", "display_id", "email", "customer_id"],
    filters: { id: orderId },
  })
  if (!order?.email) return

  const storeName = process.env.STORE_NAME || "Casa da Reforma Iguaí"
  const displayId = String(order.display_id ?? "")
  const accountUrl = new URL("/br/account/orders", process.env.STOREFRONT_PUBLIC_URL || "http://localhost:8000").href
  const trackingNumbers = shipment?.labels
    ?.map((label: { tracking_number?: string | null }) => label.tracking_number)
    .filter(Boolean) as string[] | undefined
  const template = isShipment
    ? process.env.SENDGRID_SHIPMENT_TEMPLATE
    : isCapture ? process.env.SENDGRID_PAYMENT_CAPTURED_TEMPLATE : process.env.SENDGRID_ORDER_PLACED_TEMPLATE
  const subject = isShipment
    ? `Seu pedido #${displayId} foi enviado`
    : isCapture ? `Pagamento confirmado para o pedido #${displayId}` : `Recebemos seu pedido #${displayId}`
  const tracking = trackingNumbers?.length
    ? `<p>Rastreamento: ${escapeHtml(trackingNumbers.join(", "))}</p>`
    : ""
  const html = `<h1>${escapeHtml(subject)}</h1><p>${escapeHtml(storeName)}</p>${tracking}<p><a href="${escapeHtml(accountUrl)}">Acompanhar pedido</a></p>`

  const notification = container.resolve(Modules.NOTIFICATION)
  await notification.createNotifications({
    to: order.email,
    channel: "email",
    trigger_type: name,
    resource_id: order.id,
    resource_type: "order",
    receiver_id: order.customer_id,
    idempotency_key: `${name}:${data.id}`,
    ...(template ? {
      template,
      data: { storeName, displayId, accountUrl, trackingNumbers },
    } : { content: { subject, html } }),
  })
}

export const config: SubscriberConfig = {
  event: [orderPlaced, paymentCaptured, shipmentCreated],
}

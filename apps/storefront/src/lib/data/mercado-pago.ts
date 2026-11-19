"use server"

import { sdk } from "@lib/config"
import { cookies } from "next/headers"
import { revalidateTag } from "next/cache"
import { getAuthHeaders, getCacheTag, getCartId, removeCartId } from "./cookies"

type Checkout = {
  state: "paid" | "pending" | "ready" | "failed" | "closed"
  checkout_url: string | null
}

const receiptCookie = "_medusa_mercado_pago"
const paymentPage = "/br/pagamento"

async function retrieveCheckout(cartId: string) {
  return sdk.client.fetch<Checkout>(`/store/mercado-pago/${cartId}`, {
    method: "GET",
    headers: await getAuthHeaders(),
    cache: "no-store",
  }).catch(() => null)
}

function safeCheckoutUrl(value: string | null | undefined) {
  if (!value) {
    return null
  }

  try {
    const url = new URL(value)
    return url.origin === "https://www.mercadopago.com.br" &&
      url.pathname.startsWith("/checkout/") && !url.username && !url.password
      ? url.href
      : null
  } catch {
    return null
  }
}

export async function startMercadoPagoCheckout() {
  const cartId = await getCartId()
  if (!cartId) {
    return { url: paymentPage }
  }

  const headers = await getAuthHeaders()
  const { cart } = await sdk.client.fetch<{ cart: {
    payment_collection?: { payment_sessions?: { provider_id: string }[] }
  } }>(
    `/store/carts/${cartId}`,
    {
      method: "GET",
      query: { fields: "*payment_collection.payment_sessions" },
      headers,
      cache: "no-store",
    }
  )

  if (!cart.payment_collection?.payment_sessions?.some(({ provider_id }) => provider_id === "pp_mercadopago_br")) {
    throw new Error("Selecione Mercado Pago antes de continuar.")
  }

  const completed = await sdk.store.cart.complete(cartId, {}, headers)
  if (completed.type !== "order") {
    throw new Error("Confira os dados de entrega para continuar com o pagamento.")
  }

  const jar = await cookies()
  jar.set(receiptCookie, JSON.stringify({ cart: cartId, order: completed.order.id }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  await removeCartId()

  for (const group of ["carts", "orders"]) {
    const tag = await getCacheTag(group)
    if (tag) revalidateTag(tag, { expire: 0 })
  }

  const checkout = await retrieveCheckout(cartId)
  return { url: safeCheckoutUrl(checkout?.checkout_url) ?? paymentPage }
}

export async function getMercadoPagoReceipt(): Promise<{
  orderId: string
  state: Checkout["state"] | "unavailable"
  url: string | null
} | null> {
  const jar = await cookies()
  const raw = jar.get(receiptCookie)?.value
  if (!raw) {
    return null
  }

  try {
    const receipt = JSON.parse(raw) as { cart: string; order: string }
    if (!/^cart_[A-Za-z0-9]{10,64}$/.test(receipt.cart) || !/^order_[A-Za-z0-9]{10,64}$/.test(receipt.order)) {
      return null
    }

    const checkout = await retrieveCheckout(receipt.cart)
    return {
      orderId: receipt.order,
      state: checkout?.state ?? "unavailable",
      url: safeCheckoutUrl(checkout?.checkout_url),
    }
  } catch {
    return null
  }
}

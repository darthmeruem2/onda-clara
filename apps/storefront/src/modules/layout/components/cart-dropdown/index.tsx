"use client"

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { retrieveCart } from "@lib/data/cart"
import { CART_UPDATED_EVENT } from "@lib/util/cart-events"
import { convertToLocale } from "@lib/util/money"
import { ShoppingBag, XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function CartDropdown({ cart: serverCart }: { cart?: HttpTypes.StoreCart | null }) {
  const [cart, setCart] = useState(serverCart)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    let alive = true
    setCart(serverCart)

    const refresh = () => retrieveCart().then((updated) => {
      if (alive) setCart(updated)
    }).catch(() => {})
    const handleUpdate = () => {
      void refresh()
      if (!pathname.includes("/cart")) setOpen(true)
    }

    if (!serverCart) void refresh()
    window.addEventListener(CART_UPDATED_EVENT, handleUpdate)
    return () => {
      alive = false
      window.removeEventListener(CART_UPDATED_EVENT, handleUpdate)
    }
  }, [pathname, serverCart])

  const items = cart?.items ?? []
  const quantity = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="oc-icon-button" aria-label={`Sacola, ${quantity} itens`} data-testid="nav-cart-link">
        <ShoppingBag aria-hidden="true" />
        <span className="text-xs tabular-nums" aria-live="polite">{quantity}</span>
      </button>
      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <div aria-hidden="true" className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex">
          <DialogPanel transition className="oc-drawer ml-auto flex w-full max-w-md flex-col p-6 data-[closed]:translate-x-full motion-safe:transition-transform motion-safe:duration-200" data-testid="nav-cart-dropdown">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <DialogTitle className="oc-display text-4xl">Sua sacola</DialogTitle>
              <button type="button" onClick={() => setOpen(false)} className="oc-icon-button" aria-label="Fechar sacola"><XMark /></button>
            </div>
            {cart && items.length > 0 ? (
              <>
                <ul className="flex-1 divide-y divide-black/10 overflow-y-auto">
                  {items.map((item) => (
                    <li key={item.id} className="grid grid-cols-[5rem_1fr_auto] gap-3 py-4" data-testid="cart-item">
                      <LocalizedClientLink href={`/products/${item.product_handle}`} onClick={() => setOpen(false)} aria-label={item.title}>
                        <Thumbnail thumbnail={item.thumbnail} images={item.variant?.product?.images} size="square" />
                      </LocalizedClientLink>
                      <div className="min-w-0">
                        <LocalizedClientLink className="block truncate font-medium" href={`/products/${item.product_handle}`} onClick={() => setOpen(false)}>{item.title}</LocalizedClientLink>
                        <LineItemOptions variant={item.variant} />
                        <p className="text-sm">Quantidade {item.quantity}</p>
                        <DeleteButton id={item.id} className="mt-2" data-testid="cart-item-remove-button">Remover</DeleteButton>
                      </div>
                      <LineItemPrice item={item} style="tight" currencyCode={cart.currency_code} />
                    </li>
                  ))}
                </ul>
                <div className="grid gap-3 border-t border-black/10 pt-4 text-sm">
                  <div className="flex justify-between font-semibold">
                    <span>Subtotal</span>
                    <span data-testid="cart-subtotal">{convertToLocale({ amount: cart.subtotal ?? 0, currency_code: cart.currency_code })}</span>
                  </div>
                  <p>O frete é calculado na finalização.</p>
                  <LocalizedClientLink href="/cart" onClick={() => setOpen(false)} className="oc-primary" data-testid="go-to-cart-button">Ver minha sacola</LocalizedClientLink>
                  <button type="button" onClick={() => setOpen(false)} className="min-h-11 underline underline-offset-4">Continuar comprando</button>
                </div>
              </>
            ) : (
              <div className="mt-10 grid justify-items-start gap-4">
                <p>Sua sacola está vazia.</p>
                <LocalizedClientLink href="/store" onClick={() => setOpen(false)} className="oc-primary">Explorar as peças</LocalizedClientLink>
              </div>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}

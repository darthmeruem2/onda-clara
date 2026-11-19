"use client"

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { BarsThree, XMark } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useState } from "react"

type MenuCategory = { id: string; name: string; handle: string }

export default function SideMenu({
  categories,
  showAccount,
  rental,
  quote,
}: {
  categories: MenuCategory[]
  showAccount: boolean
  rental: boolean
  quote?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className="oc-icon-button" onClick={() => setOpen(true)} type="button" aria-label="Abrir menu" data-testid="nav-menu-button">
        <BarsThree aria-hidden="true" />
      </button>
      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <div aria-hidden="true" className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex">
          <DialogPanel transition className="oc-drawer mr-auto w-full max-w-sm p-6 data-[closed]:-translate-x-full motion-safe:transition-transform motion-safe:duration-200">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <DialogTitle className="oc-display text-3xl">Menu</DialogTitle>
              <button type="button" onClick={() => setOpen(false)} className="oc-icon-button" aria-label="Fechar menu"><XMark /></button>
            </div>
            <ul className="mt-5 grid gap-1">
              {[
                { id: "store", name: rental ? "Todos os equipamentos" : "Todos os produtos", href: "/store" },
                ...categories.map((category) => ({ ...category, href: `/categories/${category.handle}` })),
                ...(showAccount ? [{ id: "account", name: "Minha conta", href: "/account" }] : []),
                ...(rental ? [{ id: "how", name: "Como funciona", href: "/#como-funciona" }] : []),
                { id: "about", name: "Sobre", href: "/sobre" },
              ].map(({ id, name, href }) => (
                <li key={id}><LocalizedClientLink href={href} onClick={() => setOpen(false)} className="block min-h-11 py-3">{name}</LocalizedClientLink></li>
              ))}
            </ul>
            {quote && <a href={quote} className="oc-primary mt-4" target="_blank" rel="noreferrer">Pedir orçamento no WhatsApp</a>}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}

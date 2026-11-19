import { Metadata } from "next"

import InteractiveLink from "@modules/common/components/interactive-link"

export const metadata: Metadata = {
  title: "404",
  description: "Página não encontrada",
}

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="oc-display text-5xl text-ui-fg-base">Página não encontrada</h1>
      <p className="text-small-regular text-ui-fg-base">
        A página pode ter mudado de endereço.
      </p>
      <InteractiveLink href="/">Voltar para o início</InteractiveLink>
    </div>
  )
}

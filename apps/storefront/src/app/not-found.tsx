import { ArrowUpRightMini } from "@medusajs/icons"
import { Text } from "@modules/common/components/ui"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404",
  description: "Página não encontrada",
}

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="oc-display text-5xl text-ui-fg-base">Página não encontrada</h1>
      <p className="text-small-regular text-ui-fg-base">
        A página pode ter mudado de endereço.
      </p>
      <Link className="flex gap-x-1 items-center group" href="/">
        <Text className="text-ui-fg-interactive">Voltar para o início</Text>
        <ArrowUpRightMini
          className="group-hover:rotate-45 ease-in-out duration-150"
          color="var(--fg-interactive)"
        />
      </Link>
    </main>
  )
}

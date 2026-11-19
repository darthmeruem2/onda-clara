import { getMercadoPagoReceipt } from "@lib/data/mercado-pago"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Situação do pagamento",
  robots: { index: false, follow: false },
}

const statusText = {
  paid: {
    title: "Pagamento confirmado",
    description: "Seu pedido foi pago. Você já pode consultar os detalhes da compra.",
  },
  pending: {
    title: "Aguardando pagamento",
    description: "A confirmação pode levar alguns minutos. Atualize esta página para consultar a situação do seu pedido.",
  },
  ready: {
    title: "Seu pedido aguarda pagamento",
    description: "Continue no Mercado Pago para escolher Pix ou cartão de crédito.",
  },
  failed: {
    title: "Seu pagamento não foi concluído",
    description: "A cobrança foi recusada, cancelada ou expirou. Se o valor aparecer na sua conta, fale com a loja antes de fazer um novo pedido.",
  },
  closed: {
    title: "Cobrança encerrada",
    description: "Consulte seu pedido ou entre em contato com a loja para saber mais.",
  },
  unavailable: {
    title: "Pagamento em verificação",
    description: "A situação do pagamento está temporariamente indisponível. Atualize esta página em alguns instantes.",
  },
  missing: {
    title: "Consulte seus pedidos",
    description: "Entre na sua conta para encontrar a compra e acompanhar o pagamento.",
  },
}

const primary =
  "inline-flex min-h-11 items-center justify-center bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"

export default async function MercadoPagoStatusPage() {
  const receipt = await getMercadoPagoReceipt()
  const state = receipt?.state ?? "missing"
  const copy = statusText[state]

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col gap-5 px-6 py-20 text-center">
      <h1 className="text-3xl font-semibold">{copy.title}</h1>
      <p className="text-sm leading-relaxed text-zinc-700">{copy.description}</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        {state === "paid" && receipt && (
          <Link className={primary} href={`/br/order/${receipt.orderId}/confirmed`}>
            Ver meu pedido
          </Link>
        )}
        {state === "ready" && receipt?.url && (
          <a className={primary} href={receipt.url}>Continuar para o Mercado Pago</a>
        )}
        {(state === "pending" || state === "unavailable") && (
          <form method="get">
            <button className={primary} type="submit">Atualizar situação</button>
          </form>
        )}
        {(state === "missing" || state === "closed") && (
          <Link className={primary} href="/br/account/orders">Meus pedidos</Link>
        )}
        {state === "failed" && (
          <Link className={primary} href="/br/store">Voltar para a loja</Link>
        )}
      </div>
    </section>
  )
}

import { brand } from "@lib/brand"
import { rentalQuoteUrl } from "@lib/util/rental"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata = {
  title: `Sobre a ${brand.name}`,
  description: "Locação de equipamentos e materiais para construção e reforma em Santo André, SP.",
}

export default function AboutPage() {
  const quote = rentalQuoteUrl()

  return (
    <article className="content-container max-w-3xl py-12 md:py-20">
      <p className="mb-3 font-bold text-[var(--brand-action)]">{brand.region}</p>
      <h1 className="oc-display text-4xl md:text-6xl">Sobre a {brand.name}</h1>
      <p className="my-6 text-lg leading-relaxed">
        A {brand.name} reúne locação de ferramentas e máquinas e depósito de materiais de construção. O catálogo cobre etapas como concretagem, demolição, corte e limpeza pós-obra.
      </p>
      <p className="mb-7 text-lg leading-relaxed">
        Para planejar sua locação, informe à equipe o equipamento, as datas e o local da obra. Consulte pelo WhatsApp a disponibilidade, o endereço de retirada e as opções de entrega.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <LocalizedClientLink href="/store" className="oc-primary">Ver equipamentos</LocalizedClientLink>
        {quote && <a href={quote} target="_blank" rel="noreferrer" className="font-bold underline underline-offset-4">Pedir orçamento</a>}
      </div>
    </article>
  )
}

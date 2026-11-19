import { brand } from "@lib/brand"
import { policyCopy, rentalPolicyCopy } from "@lib/policy-copy"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Metadata } from "next"

import { getPolicyParagraphs, getStorePolicies } from "@lib/data/store-policies"
import { PoliciesUnavailable, PolicyPage } from "@modules/policies/templates"

export const dynamic = "force-static"
export const revalidate = 60

export const metadata: Metadata = {
  title: brand.rentalCatalog ? "Devolução dos equipamentos" : "Trocas e devoluções",
  description: brand.rentalCatalog ? "Como combinar a devolução de um equipamento alugado." : "Como solicitar uma troca ou devolução.",
}

export default async function ReturnsPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  if (brand.rentalCatalog) {
    return (
      <PolicyPage title="Devolução dos equipamentos">
        {rentalPolicyCopy.returns.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <LocalizedClientLink href="/contact" className="underline underline-offset-4">Falar com o atendimento</LocalizedClientLink>
      </PolicyPage>
    )
  }

  const { countryCode } = await props.params
  const [{ current }, paragraphs] = await Promise.all([
    getStorePolicies(countryCode),
    getPolicyParagraphs(countryCode, "returns_copy", policyCopy.returns),
  ])

  return (
    <PolicyPage title="Trocas e devoluções">
      {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {current ? (
        <>
          <p>
            Solicite a devolução em até {current.returnWindowDays} dias após receber o pedido. O envio da peça é feito por postagem.
          </p>
          <p>
            {current.freeReturns
              ? "A postagem de devolução é gratuita."
              : "Consulte o atendimento para confirmar como será feita a postagem."}
          </p>
        </>
      ) : (
        <PoliciesUnavailable />
      )}
      <LocalizedClientLink href="/contact" className="underline underline-offset-4">Falar com o atendimento</LocalizedClientLink>
    </PolicyPage>
  )
}

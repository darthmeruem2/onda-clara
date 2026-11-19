import { brand } from "@lib/brand"
import { rentalPolicyCopy } from "@lib/policy-copy"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Metadata } from "next"

import { getStorePolicies } from "@lib/data/store-policies"
import {
  PoliciesUnavailable,
  PolicyPage,
  ShippingSummary,
} from "@modules/policies/templates"

export const dynamic = "force-static"
export const revalidate = 60

export const metadata: Metadata = {
  title: brand.rentalCatalog ? "Retirada e entrega" : "Entregas",
  description: brand.rentalCatalog ? "Como combinar retirada ou entrega de equipamentos." : "Consulte as opções de frete e os prazos de entrega.",
}

export default async function ShippingPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  if (brand.rentalCatalog) {
    return (
      <PolicyPage title="Retirada e entrega">
        {rentalPolicyCopy.shipping.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <LocalizedClientLink href="/contact" className="underline underline-offset-4">Consultar o atendimento</LocalizedClientLink>
      </PolicyPage>
    )
  }

  const { countryCode } = await props.params
  const { current, currencyCode } = await getStorePolicies(countryCode)

  return (
    <PolicyPage title="Entregas">
      {current ? (
        <>
          <p>
            Confira as condições de referência para entregas no Brasil.
          </p>
          <ShippingSummary policies={current} currencyCode={currencyCode} />
          <p className="text-ui-fg-subtle">
            As opções disponíveis para o seu CEP e o valor final aparecem na finalização da compra.
          </p>
        </>
      ) : (
        <PoliciesUnavailable />
      )}
    </PolicyPage>
  )
}

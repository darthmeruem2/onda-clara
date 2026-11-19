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
  title: "Entregas",
  description: "Consulte as opções de frete e os prazos de entrega.",
}

export default async function ShippingPage(props: {
  params: Promise<{ countryCode: string }>
}) {
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

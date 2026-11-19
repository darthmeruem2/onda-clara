import { policyCopy } from "@lib/policy-copy"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PolicyPage } from "@modules/policies/templates"

export const metadata = { title: "Política de privacidade", description: "Como a loja usa os dados de cadastro e compra." }

export default function Page() {
  return (
    <PolicyPage title="Política de privacidade">
      {policyCopy.privacy.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <LocalizedClientLink href="/contact" className="underline underline-offset-4">Canais de atendimento</LocalizedClientLink>
    </PolicyPage>
  )
}

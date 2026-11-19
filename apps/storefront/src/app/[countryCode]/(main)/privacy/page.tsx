import { getPolicyParagraphs } from "@lib/data/store-policies"
import { policyCopy } from "@lib/policy-copy"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PolicyPage } from "@modules/policies/templates"

export const metadata = { title: "Política de privacidade", description: "Como a loja usa os dados de cadastro e compra." }

export default async function Page({ params }: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await params
  const paragraphs = await getPolicyParagraphs(countryCode, "privacy_copy", policyCopy.privacy)

  return (
    <PolicyPage title="Política de privacidade">
      {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <LocalizedClientLink href="/contact" className="underline underline-offset-4">Canais de atendimento</LocalizedClientLink>
    </PolicyPage>
  )
}

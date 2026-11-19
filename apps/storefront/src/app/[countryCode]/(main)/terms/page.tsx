import { getPolicyParagraphs } from "@lib/data/store-policies"
import { policyCopy } from "@lib/policy-copy"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PolicyPage } from "@modules/policies/templates"

export const metadata = { title: "Termos de uso", description: "Condições para comprar na loja." }

export default async function Page({ params }: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await params
  const paragraphs = await getPolicyParagraphs(countryCode, "terms_copy", policyCopy.terms)

  return (
    <PolicyPage title="Termos de uso">
      {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <LocalizedClientLink href="/contact" className="underline underline-offset-4">Canais de atendimento</LocalizedClientLink>
    </PolicyPage>
  )
}

import { brand } from "@lib/brand"
import { getPolicyParagraphs } from "@lib/data/store-policies"
import { policyCopy, rentalPolicyCopy } from "@lib/policy-copy"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PolicyPage } from "@modules/policies/templates"

export const metadata = { title: brand.rentalCatalog ? "Condições da locação" : "Termos de uso", description: brand.rentalCatalog ? "Como consultar e combinar uma locação." : "Condições para comprar na loja." }

export default async function Page({ params }: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await params
  const paragraphs = await getPolicyParagraphs(countryCode, "terms_copy", brand.rentalCatalog ? rentalPolicyCopy.terms : policyCopy.terms)

  return (
    <PolicyPage title={metadata.title}>
      {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <LocalizedClientLink href="/contact" className="underline underline-offset-4">Canais de atendimento</LocalizedClientLink>
    </PolicyPage>
  )
}

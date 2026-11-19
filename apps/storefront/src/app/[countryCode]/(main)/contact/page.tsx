import { brand } from "@lib/brand"
import { rentalQuoteUrl } from "@lib/util/rental"
import { PolicyPage } from "@modules/policies/templates"

export const metadata = {
  title: "Atendimento",
  description: `Canais de contato da ${brand.name}.`,
}

export default function ContactPage() {
  const whatsapp = brand.rentalCatalog ? rentalQuoteUrl() : brand.whatsapp

  return (
    <PolicyPage title="Atendimento">
      {brand.rentalCatalog
        ? <>
            <p className="font-bold text-[var(--brand-action)]">{brand.region}</p>
            <p>Informe o equipamento, o período desejado e o local da obra. A equipe confirma disponibilidade, valor, retirada e entrega pelo WhatsApp.</p>
          </>
        : <p>Para receber ajuda com um pedido, tenha o número da compra em mãos.</p>}
      {whatsapp && (
        <div><a href={whatsapp} target="_blank" rel="noreferrer" className="oc-primary">Conversar no WhatsApp{brand.phoneLabel ? ` ${brand.phoneLabel}` : ""}</a></div>
      )}
      {brand.instagram && <div><a href={brand.instagram} target="_blank" rel="noreferrer" className="underline underline-offset-4">Acompanhar no Instagram</a></div>}
      {brand.email && <a href={`mailto:${brand.email}`} className="underline underline-offset-4">{brand.email}</a>}
      {!brand.email && !whatsapp && <p>Os canais de atendimento serão publicados quando a loja abrir.</p>}
    </PolicyPage>
  )
}

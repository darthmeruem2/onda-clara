import { brand } from "@lib/brand"
import { PolicyPage } from "@modules/policies/templates"

export const metadata = {
  title: "Atendimento",
  description: `Canais de contato da ${brand.name}.`,
}

export default function ContactPage() {
  return (
    <PolicyPage title="Atendimento">
      <p>Para receber ajuda com um pedido, tenha o número da compra em mãos.</p>
      {brand.whatsapp && (
        <div><a href={brand.whatsapp} target="_blank" rel="noreferrer" className="oc-primary">Conversar no WhatsApp</a></div>
      )}
      {brand.email && <a href={`mailto:${brand.email}`} className="underline underline-offset-4">{brand.email}</a>}
      {!brand.email && !brand.whatsapp && <p>Os canais de atendimento serão publicados quando a loja abrir.</p>}
    </PolicyPage>
  )
}

import { brand } from "@lib/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata = { title: `Sobre a ${brand.name}` }

export default function AboutPage() {
  return (
    <article className="content-container max-w-3xl py-16 md:py-28">
      <h1 className="oc-display text-5xl md:text-7xl">Sobre a {brand.name}</h1>
      <p className="my-7 text-lg leading-relaxed">A {brand.name} nasce do jeito de vestir de quem mora perto do mar. Camisas soltas, cortes que deixam o corpo se mover e texturas que aparecem de perto.</p>
      <p className="mb-8 text-lg leading-relaxed">Na coleção Entre Marés, o linho encontra a alfaiataria em peças que passam da manhã ao fim da tarde.</p>
      <LocalizedClientLink href="/store" className="oc-primary">Conhecer as peças</LocalizedClientLink>
    </article>
  )
}

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function ProductTabs({ product }: { product: HttpTypes.StoreProduct }) {
  return (
    <div className="divide-y divide-black/10 border-y border-black/10 text-sm">
      {product.material && (
        <details>
          <summary className="cursor-pointer py-4 font-medium">Composição</summary>
          <p className="pb-4">{product.material}</p>
        </details>
      )}
      <details>
        <summary className="cursor-pointer py-4 font-medium">Entregas e trocas</summary>
        <div className="grid gap-3 pb-5">
          <p>Consulte o frete na finalização da compra.</p>
          <LocalizedClientLink href="/returns" className="underline underline-offset-4">Ver condições de troca e devolução</LocalizedClientLink>
        </div>
      </details>
    </div>
  )
}

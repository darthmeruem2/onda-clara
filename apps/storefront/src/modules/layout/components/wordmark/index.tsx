import Image from "next/image"
import { brand } from "@lib/brand"

export default function Wordmark() {
  if (brand.logo === brand.originalLogo && brand.name === "Casa da Reforma Iguaí") {
    return (
      <span className="oc-brand-lockup" translate="no">
        <span className="oc-brand-symbol" aria-hidden="true">
          <Image src={brand.logo} alt="" width={440} height={330} />
        </span>
        <span className="oc-brand-lettering">
          Casa da Reforma <strong>Iguaí</strong>
        </span>
      </span>
    )
  }

  return brand.logo ? (
    <Image
      src={brand.logo}
      alt={brand.name}
      width={160}
      height={120}
      className="h-16 w-auto max-w-32 object-contain md:h-[72px] md:max-w-40"
    />
  ) : (
    <span translate="no">{brand.wordmark}</span>
  )
}

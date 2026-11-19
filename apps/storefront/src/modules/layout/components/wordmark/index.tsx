import Image from "next/image"
import { brand } from "@lib/brand"

export default function Wordmark() {
  return brand.logo ? (
    <Image
      src={brand.logo}
      alt={brand.name}
      width={180}
      height={48}
      className="h-9 w-auto max-w-36 object-contain sm:h-11 sm:max-w-44"
    />
  ) : (
    <span translate="no">{brand.wordmark}</span>
  )
}

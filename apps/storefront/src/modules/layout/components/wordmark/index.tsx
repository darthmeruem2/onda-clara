import Image from "next/image"
import { brand } from "@lib/brand"

export default function Wordmark() {
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

import { getBaseURL } from "@lib/util/env"
import { showroom } from "@lib/showroom/catalog"
import { brand } from "@lib/brand"
import { Metadata } from "next"
import "styles/globals.css"
import "styles/brand.css"
import "styles/storefront.css"

export const metadata: Metadata = {
  title: { default: brand.name, template: `%s | ${brand.name}` },
  description: brand.description,
  ...(showroom ? { robots: { index: false, follow: false } } : {}),
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-mode="light">
      <head>
        <link rel="ucp" href="/.well-known/ucp" />
        <link rel="preload" href="/fonts/instrument-serif.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <div className="relative">{props.children}</div>
      </body>
    </html>
  )
}

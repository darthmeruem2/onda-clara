import Image from "next/image"
import { brand } from "@lib/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import styles from "../../home.module.css"

export default function CampaignEditorial({ href }: { href: string }) {
  const { campaign } = brand

  return (
    <section className={styles.editorial} aria-labelledby="editorial-title">
      <div className={styles.editorialImage}>
        <Image
          src={campaign.editorial.image}
          alt={campaign.editorial.imageAlt}
          fill
          sizes="(max-width: 767px) 100vw, 56vw"
        />
      </div>
      <div className={styles.editorialContent}>
        <h2 id="editorial-title">{campaign.editorial.title}</h2>
        <p>{campaign.editorial.description}</p>
        <LocalizedClientLink href={href} className={styles.textLink}>
          Ver {campaign.editorial.productTitle}
        </LocalizedClientLink>
      </div>
    </section>
  )
}

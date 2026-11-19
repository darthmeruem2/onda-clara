import Image from "next/image"
import { ArrowUpRightMini, ChatBubble, MapPin } from "@medusajs/icons"
import { brand } from "@lib/brand"
import { rentalQuoteUrl } from "@lib/util/rental"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import styles from "../../home.module.css"

export default function Hero({ hasFeaturedProduct }: { hasFeaturedProduct: boolean }) {
  const { campaign } = brand
  const quote = rentalQuoteUrl()

  return (
    <section className={styles.hero} aria-labelledby="campaign-title">
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <p className={styles.heroLocation}><MapPin aria-hidden="true" /> {brand.region}</p>
          <h1 id="campaign-title">{campaign.headline}</h1>
          <p className={styles.heroDescription}>{campaign.description}</p>
          <div className={styles.heroActions}>
            <LocalizedClientLink href="/store" className={styles.heroButton}>
              Ver equipamentos
            </LocalizedClientLink>
            {quote && (
              <a href={quote} className={styles.heroSecondary} target="_blank" rel="noreferrer">
                <ChatBubble aria-hidden="true" /> Pedir orçamento
              </a>
            )}
          </div>
        </div>
        {hasFeaturedProduct && (
          <figure className={styles.heroFigure}>
            <div className={styles.heroMedia}>
              <Image
                src={campaign.image}
                alt={campaign.imageAlt}
                fill
                preload
                sizes="(max-width: 767px) 90vw, 40vw"
                className={styles.heroImage}
              />
            </div>
            <figcaption>
              <LocalizedClientLink href={`/products/${campaign.productHandle}`}>
                <span>{campaign.productTitle}</span><ArrowUpRightMini aria-hidden="true" />
              </LocalizedClientLink>
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  )
}

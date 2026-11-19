import Image from "next/image"
import { ArrowUpRightMini, ChatBubble, MapPin } from "@medusajs/icons"
import { brand } from "@lib/brand"
import { rentalQuoteUrl } from "@lib/util/rental"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import styles from "../../home.module.css"

export default function Hero() {
  const quote = rentalQuoteUrl()

  return (
    <section className={styles.hero} aria-labelledby="campaign-title">
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <p className={styles.heroLocation} data-intro-copy>
            <MapPin aria-hidden="true" /> Locação em {brand.region}
          </p>
          <h1 id="campaign-title">
            {brand.campaign.headline.map((line) => (
              <span key={line} className={styles.titleLine}><span data-intro-line>{line}</span>{" "}</span>
            ))}
          </h1>
          <p className={styles.heroDescription} data-intro-copy>{brand.campaign.description}</p>
          <div className={styles.heroActions} data-intro-copy>
            <LocalizedClientLink href="/store" className={styles.heroButton}>
              Ver equipamentos <ArrowUpRightMini aria-hidden="true" />
            </LocalizedClientLink>
            {quote && (
              <a href={quote} className={styles.heroSecondary} target="_blank" rel="noreferrer">
                <ChatBubble aria-hidden="true" /> Pedir orçamento
              </a>
            )}
          </div>
        </div>
        <div className={styles.heroMedia} data-intro-photo>
          <Image
            src={brand.campaign.image}
            alt={brand.campaign.imageAlt}
            fill
            preload
            sizes="(max-width: 767px) 94vw, 43vw"
            className={styles.heroImage}
          />
        </div>
      </div>
    </section>
  )
}

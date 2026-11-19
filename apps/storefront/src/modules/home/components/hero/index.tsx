import Image from "next/image"
import { brand } from "@lib/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import styles from "../../home.module.css"

export default function Hero({ href }: { href: string }) {
  const { campaign } = brand

  return (
    <section className={styles.hero} aria-labelledby="campaign-title">
      <Image
        src={campaign.image}
        alt=""
        fill
        preload
        sizes="100vw"
        className={styles.heroImage}
      />
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <p className={styles.heroCollection}>Coleção {campaign.title}</p>
          <h1 id="campaign-title">{campaign.headline}</h1>
          <p className={styles.heroDescription}>{campaign.description}</p>
          <LocalizedClientLink href={href} className={styles.heroButton}>
            Explorar coleção
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

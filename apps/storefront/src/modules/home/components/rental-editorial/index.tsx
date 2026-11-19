import Image from "next/image"
import { ArrowUpRightMini } from "@medusajs/icons"
import { brand } from "@lib/brand"
import { rentalQuoteUrl } from "@lib/util/rental"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import styles from "../../home.module.css"

export default function RentalEditorial() {
  const { editorial } = brand.campaign
  const quote = rentalQuoteUrl()

  return (
    <section className={styles.editorial} aria-labelledby="editorial-title" data-editorial>
      <h2 id="editorial-title" data-editorial-title>{editorial.heading}</h2>
      <div className={styles.editorialGrid}>
        <figure className={styles.editorialLarge}>
          <Image src={editorial.image} alt={editorial.imageAlt} fill sizes="(max-width: 767px) 90vw, 46vw" data-editorial-photo />
        </figure>
        <div className={styles.editorialText}>
          <p>{editorial.description}</p>
          <LocalizedClientLink href="/store" className={styles.editorialLink}>
            Explorar catálogo <ArrowUpRightMini aria-hidden="true" />
          </LocalizedClientLink>
        </div>
        <div className={styles.editorialAside}>
          <figure className={styles.editorialSmall}>
            <Image src={editorial.detailImage} alt={editorial.detailImageAlt} fill sizes="(max-width: 767px) 48vw, 23vw" data-editorial-photo />
          </figure>
          <div>
            <h3>Combine a locação</h3>
            <p>Informe o equipamento, as datas e o bairro da obra. A equipe confirma a disponibilidade e orienta sobre retirada ou entrega.</p>
            {quote && (
              <a href={quote} className={styles.editorialLink} target="_blank" rel="noreferrer">
                Falar no WhatsApp <ArrowUpRightMini aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

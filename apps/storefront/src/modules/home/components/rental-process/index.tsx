import { ChatBubble, MagnifyingGlass, TruckFast } from "@medusajs/icons"
import { rentalQuoteUrl } from "@lib/util/rental"
import styles from "../../home.module.css"

const steps = [
  { title: "Escolha o equipamento", description: "Explore o catálogo por categoria e abra a ficha do item que você precisa.", Icon: MagnifyingGlass },
  { title: "Consulte a locação", description: "Informe pelo WhatsApp o equipamento, o período e o local da obra para receber um orçamento.", Icon: ChatBubble },
  { title: "Combine a logística", description: "Confirme a disponibilidade e combine retirada ou entrega com a equipe.", Icon: TruckFast },
]

export default function RentalProcess() {
  const quote = rentalQuoteUrl()

  return (
    <section id="como-funciona" className={styles.process} aria-labelledby="rental-process">
      <div className={styles.sectionWidth}>
        <div className={styles.sectionHeading}>
          <h2 id="rental-process">Como funciona a locação</h2>
          {quote && <a href={quote} target="_blank" rel="noreferrer" className={styles.textLink}>Falar no WhatsApp</a>}
        </div>
        <ol className={styles.processGrid}>
          {steps.map(({ title, description, Icon }, index) => (
            <li key={title}>
              <span className={styles.stepIcon}>
                <Icon aria-hidden="true" />
                <span aria-hidden="true">{index + 1}</span>
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

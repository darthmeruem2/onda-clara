import { convertToLocale } from "@lib/util/money"
import { formatDayRange, StorePolicies } from "@lib/util/store-policies"

export const formatShippingRate = (rate: number, currencyCode: string) =>
  rate === 0 ? "Grátis" : convertToLocale({ amount: rate, currency_code: currencyCode })

export const PolicyPage = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className="content-container py-12 max-w-3xl" data-testid="policy-page">
    <h1 className="oc-display mb-8 text-5xl">{title}</h1>
    <div className="flex flex-col gap-6 text-base-regular text-ui-fg-base">
      {children}
    </div>
  </div>
)

export const PoliciesUnavailable = () => (
  <p className="text-ui-fg-subtle">
    As condições de entrega e devolução estão em atualização.
  </p>
)

export const ShippingSummary = ({
  policies,
  currencyCode,
}: {
  policies: StorePolicies
  currencyCode: string
}) => (
  <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
    <dt className="text-ui-fg-subtle">Frete de referência</dt>
    <dd>{formatShippingRate(policies.shippingRate, currencyCode)}</dd>
    <dt className="text-ui-fg-subtle">Prazo de preparação</dt>
    <dd>{formatDayRange(policies.handlingDays)} dias úteis</dd>
    <dt className="text-ui-fg-subtle">Prazo de entrega</dt>
    <dd>{formatDayRange(policies.transitDays)} dias úteis após a postagem</dd>
  </dl>
)

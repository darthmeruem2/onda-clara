import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const fulfillmentStatus: Record<string, string> = {
  not_fulfilled: "Em preparação",
  partially_fulfilled: "Em separação",
  fulfilled: "Separado",
  partially_shipped: "Enviado parcialmente",
  shipped: "Enviado",
  partially_delivered: "Entregue parcialmente",
  delivered: "Entregue",
  canceled: "Cancelado",
}

const paymentStatus: Record<string, string> = {
  not_paid: "Aguardando pagamento",
  awaiting: "Aguardando confirmação",
  authorized: "Autorizado",
  partially_authorized: "Autorizado parcialmente",
  captured: "Pago",
  partially_captured: "Pago parcialmente",
  partially_refunded: "Reembolsado parcialmente",
  refunded: "Reembolsado",
  canceled: "Cancelado",
  requires_action: "Ação necessária",
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  return (
    <div>
      <Text>
        E-mail vinculado ao pedido:{" "}
        <span
          className="text-ui-fg-medium-plus font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>
      <Text className="mt-2">
        Data do pedido:{" "}
        <span data-testid="order-date">
          {new Date(order.created_at).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}
        </span>
      </Text>
      <Text className="mt-2 text-ui-fg-interactive">
        Número do pedido: <span data-testid="order-id">{order.display_id}</span>
      </Text>

      <div className="flex items-center text-compact-small gap-x-4 mt-4">
        {showStatus && (
          <>
            <Text>
              Situação da entrega:{" "}
              <span className="text-ui-fg-subtle " data-testid="order-status">
                {fulfillmentStatus[order.fulfillment_status] ?? "Em atualização"}
              </span>
            </Text>
            <Text>
              Situação do pagamento:{" "}
              <span
                className="text-ui-fg-subtle "
                data-testid="order-payment-status"
              >
                {paymentStatus[order.payment_status] ?? "Em atualização"}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails

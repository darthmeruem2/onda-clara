import { Badge } from "@modules/common/components/ui"

const PaymentTest = ({ className }: { className?: string }) => {
  return (
    <Badge color="orange" className={className}>
      <span className="font-semibold">Ambiente de demonstração.</span> Este pedido não gera cobrança.
    </Badge>
  )
}

export default PaymentTest

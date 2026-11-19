# Mercado Pago no checkout brasileiro

A loja integra o Checkout Pro por meio da Orders API. O cliente revisa o pedido no site e escolhe Pix ou cartão no checkout hospedado pelo Mercado Pago. Parcelas e juros seguem a conta do vendedor e os meios de pagamento disponíveis para o comprador. O Medusa armazena apenas a referência da cobrança e continua responsável por estoque, pedidos, cancelamento e reembolsos iniciados no painel.

Foram avaliados os plugins `@hewsos/medusa-pay-mpago` 0.1.4 e `nicogorga/mercadopago`. O primeiro implementa Checkout Transparente com SDK no navegador, configurações adicionais no painel e conexão própria ao PostgreSQL. O segundo declara testes de cartão no Uruguai. A integração hospedada usa a Orders API e os workflows de pagamento do próprio Medusa. [Plugin Hewsos](https://github.com/Hewsos/medusa-pay-mpago) · [Plugin Nico Gorga](https://github.com/NicolasGorga/medusa-payment-mercadopago) · [Checkout Pro](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-orders/create-order)

## Testar

1. Crie ou selecione uma aplicação Checkout Pro com Orders. Abra **Credenciais de teste** e **Contas de teste** no painel do desenvolvedor Mercado Pago. Use uma conta Comprador do Brasil. [Teste de integração](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-orders/integration-test/introduction)
2. No serviço do backend, defina `MERCADO_PAGO_MODE=test`, `MERCADO_PAGO_ACCESS_TOKEN` com o Access Token de teste e `MERCADO_PAGO_STOREFRONT_URL` com a origem HTTPS da loja de teste. Opcionalmente, defina `MERCADO_PAGO_MAX_INSTALLMENTS` entre 1 e 12.
3. No Mercado Pago, vá a **Webhooks**, cadastre `https://<backend>/hooks/mercado-pago` e selecione o evento de **Orders** (`orders_v2`). Configure `MERCADO_PAGO_WEBHOOK_SECRET` no backend com a assinatura secreta da aplicação. Backend e loja devem ficar acessíveis via HTTPS. [Notificações Checkout Pro](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-orders/notifications)
4. Reinicie o backend e ative `pp_mercadopago_br` na região Brasil em **Configurações → Regiões** do Medusa Admin.
5. Valide cartão aprovado, parcelado e recusado. Teste Pix com a conta de comprador para observar a transição de aguardando pagamento para pago. Verifique o pedido no Admin e a entrega do webhook. Reentregue uma notificação aprovada e confira se o pedido manteve uma única captura. Teste reembolso integral e parcial no Admin com pagamentos de teste.

A loja cria o pedido com pagamento aguardando autorização antes de abrir o checkout, reservando os itens. O retorno ao site consulta a situação autenticada na API do Mercado Pago. A confirmação exige que o valor em reais, o identificador e a referência da sessão coincidam. O recebimento do webhook exige HMAC válido e é conciliado com bloqueio por sessão. Notificações repetidas de um pagamento capturado não geram outra captura. Notificações de expiração ou cancelamento de cobrança sem captura liberam a reserva quando entregues.

## Ativar após homologação

Use um backend separado para produção com Redis compartilhado e uma aplicação Mercado Pago com credenciais de produção. Configure a URL e a assinatura do webhook de produção, defina `MERCADO_PAGO_MODE=production` e associe o provedor à região Brasil. Retire o provedor **Pagamento de demonstração** da região antes de abrir a loja. O modo de demonstração funciona com `MERCADO_PAGO_MODE` vazio.

No Admin, envie produtos apenas quando o pagamento estiver capturado. Para cancelar um pedido ainda aguardando pagamento, encerre a cobrança no Mercado Pago primeiro e confirme o cancelamento do pedido no Medusa. Verifique cobranças abandonadas que continuarem pendentes depois de 24 horas, caso a plataforma não envie a notificação de expiração. Reembolsos iniciados no Medusa chamam a Orders API. Concilie estornos e contestações iniciados diretamente no Mercado Pago no processo administrativo da loja.

Em caso de webhook com erro temporário, a plataforma pode reenviar o evento. Antes de repetir uma tentativa de cobrança ou de envio, compare a referência e o valor no pedido Medusa e na atividade do Mercado Pago.

# Onda Clara

## Entrega

- [Vitrine na Vercel](https://onda-clara-vitrine.vercel.app/)
- [Pull request no GitHub](https://github.com/darthmeruem2/onda-clara/pull/1)
- Capturas [celular](docs/screenshots/loja-celular.jpg), [computador](docs/screenshots/loja-computador.jpg) e [painel](docs/screenshots/admin.png).

## Base e decisões

- Medusa DTC Starter oficial em `44f2979627d8b9dac3336ee039a99a433f4c3123`, Medusa 2.22.7, Next.js e pnpm 10.11.1. Painel Medusa preservado.
- Onda Clara é uma marca fictícia criada para a apresentação. Catálogo de linho com quatro peças, 32 variações, oito imagens de produto, preços em BRL, categorias, coleção e estoque. Identidade, campanhas e canais de contato configuráveis.
- A loja operacional usa o Medusa para catálogo, busca, conta, promoções, reserva de estoque, checkout e pedidos. A vitrine da Vercel usa um recorte do catálogo fictício em modo somente leitura.
- Backend local com PostgreSQL e Redis. Implantação preparada para servidor Node persistente, com Railway e PostgreSQL do Supabase como opções descritas no guia. Nenhum serviço pago contratado.
- 21 skills versionadas com fontes e revisões fixadas. Instruções oficiais no AGENTS.md preservadas.

## Validação

- Migrações aplicadas em PostgreSQL local. Verificados login administrativo, catálogo, variações, cupom ONDA10, fretes fixos, conclusão do pedido sem cobrança, repetição da conclusão e consulta administrativa do pedido.
- Mercado Pago Checkout Pro via Orders API. Testes com provedor simulado em Medusa, PostgreSQL e Redis verificaram pendência, recusa, expiração, assinatura inválida, valor divergente e dois webhooks concorrentes. O pagamento aprovado produziu uma captura.
- O checkout completo passou no Chromium móvel, com sacola lateral, variação, cupom, CEP, entrega e confirmação de pedido sem cobrança. A interface do provedor de pagamento também foi verificada até a confirmação com API simulada.
- O build de produção do Medusa e do painel executou no Cloud e respondeu no health check. O build da imagem Docker esgotou o armazenamento local durante a instalação. A inicialização pelo artefato compilado passou. O build remoto pelo Railway continua por validar.
- A vitrine compilou e foi publicada na Vercel. O domínio de produção respondeu HTTP 200 sem credenciais. Chromium móvel verificou homepage, catálogo, coleção, categoria, busca, produto e bloqueio de checkout. Cadastro e histórico autenticado também passaram no ambiente local. A proteção de autenticação do projeto continuou ativa. A busca instantânea do catálogo conectado ao Medusa passou com o índice refeito em BRL.

## Pendências e continuidade

O painel e o checkout operacional estão validados no ambiente local. A URL da Vercel publica apenas o catálogo fictício, sem pedidos nem cadastro. Nenhum PostgreSQL, Redis, armazenamento ou backend pago foi provisionado. A cotação Melhor Envio passou em teste simulado. Mercado Pago, Melhor Envio e envio real via SendGrid dependem de credenciais e homologação externa.

1. [Configuração da loja](docs/CONFIGURACAO-DA-LOJA.md) — marca, conteúdo, política e Vercel.
2. [Implantação](docs/implantacao.md) — PostgreSQL, Redis, Admin, armazenamento, e-mail e frete.
3. [Mercado Pago](docs/mercado-pago.md) — configuração de teste e critérios para ativação.
4. Para comercializar, disponibilize um backend HTTPS persistente e configure PostgreSQL, Redis, armazenamento de imagens e e-mail. Homologue Mercado Pago e o frete com as credenciais do lojista. Revise os textos e informe os canais oficiais de atendimento.

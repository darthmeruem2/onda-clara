# Operação e implantação

## Catálogo local e painel

Use Node 24, Corepack e Docker Compose no diretório do repositório.

1. Execute `docker compose up -d --wait` e `corepack pnpm install --frozen-lockfile`.
2. Copie `apps/backend/.env.template` para `apps/backend/.env`. Gere segredos independentes com `openssl rand -hex 32` para `JWT_SECRET` e `COOKIE_SECRET`. Defina `MEDUSA_IMPORT_CASA_CATALOG=true` antes da primeira migration para carregar o catálogo publicado. Mantenha `MEDUSA_DEMO_MODE=false` para a locação.
3. Em `apps/backend`, execute `corepack pnpm exec medusa db:migrate`, depois `corepack pnpm exec medusa user -e SEU_EMAIL -p SUA_SENHA` e `corepack pnpm run dev`. Use uma senha exclusiva. O painel abre em `http://localhost:9000/app`.
4. No painel, abra **Configurações → Chaves de API publicáveis → Loja online**. Copie `apps/storefront/.env.template` para `apps/storefront/.env.local` e preencha `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` com a chave publicável. Rode `corepack pnpm run dev` em `apps/storefront` e abra `http://localhost:8000`.
5. Confira um equipamento em **Produtos**, abra a página correspondente na vitrine e verifique o texto de orçamento pelo WhatsApp.

Em uma base já migrada, execute `corepack pnpm exec medusa exec ./src/scripts/seed-casa-reforma.ts` dentro de `apps/backend`. O script usa os fluxos nativos do Medusa e cadastra os itens faltantes. Itens existentes pelo mesmo handle mantêm as edições do painel. As fotos usam `STOREFRONT_PUBLIC_URL` como origem.

Para substituir o catálogo fictício anterior, execute a importação uma vez com `MEDUSA_REPLACE_ONDA_CLARA_DEMO=true`. Despublica os produtos conhecidos da coleção Entre Marés, inativa as categorias demonstrativas e o cupom ONDA10, e retira o pagamento manual da região Brasil. Pedidos e produtos permanecem disponíveis no painel para consulta.

Se o índice de busca de uma base antiga precisar ser atualizado, use a API administrativa autenticada `POST /admin/search-indexes/product/reindex` com `{"strategy":"swap"}`. O Medusa prepara o novo índice antes de trocar a versão ativa.

## Operação da locação

- Use **Produtos**, **Categorias** e **Coleções** para editar fotos, descrições e organização do catálogo.
- Os equipamentos foram cadastrados para cotação. Os valores, a disponibilidade, a retirada e a entrega são combinados pelo WhatsApp com a equipe da Casa da Reforma Iguaí.
- O painel oferece **Português (Brasil)** nas preferências de idioma da conta. Cada administrador pode escolher o idioma.

## Produção com Railway, Supabase e Vercel

Escolha uma região próxima para a API, o Redis e o PostgreSQL. Configure um serviço Node persistente no Railway usando a raiz do monorepo, `apps/backend/Dockerfile` e o caminho de configuração `/apps/backend/railway.toml`. A configuração executa migrations antes do serviço começar a receber tráfego. O endpoint de saúde da API é `/health`.

Use `MEDUSA_WORKER_MODE=shared` para uma instância inicial que serve API, painel e jobs. A opção de expansão é um serviço `server` e outro `worker` com os mesmos serviços de dados e segredos. Mantenha migrations e o health check HTTP no servidor. Configure `MEDUSA_BACKEND_URL` antes do build do painel e ajuste `STORE_CORS`, `ADMIN_CORS` e `AUTH_CORS` com as origens HTTPS reais. Preserve a mesma JWT secret e cookie secret entre réplicas e deploys.

Use `REDIS_URL` do Redis privado, com persistência configurada. O Medusa usa Redis para sessões, locks, eventos, cache e workflows. Pode-se isolar cache e locks via `CACHE_REDIS_URL` e `LOCKING_REDIS_URL`. Evite uma política de eviction para a instância que guarda workflows e eventos.

No Supabase, use um projeto dedicado ao comércio, PostgreSQL recente e uma conexão direta com TLS. Se o host da API usar IPv4, use o **Supavisor Session Pooler** (porta 5432). Configure o certificado raiz via `DATABASE_SSL_CA` para validação da conexão. Desative a Data API no projeto dedicado antes das migrations. Cadastros, pedidos e demais dados passam pela API autenticada do Medusa. Use backups adequados ao volume de vendas. [Conexão PostgreSQL](https://supabase.com/docs/guides/database/connecting-to-postgres) · [Proteção da Data API](https://supabase.com/docs/guides/api/securing-your-api)

Para fotos, crie um bucket público dedicado a mídias de produto no Supabase Storage. Configure o endpoint S3, região, bucket e par de chaves no backend. Em `S3_FILE_URL` use a URL pública `https://<projeto>.supabase.co/storage/v1/object/public/<bucket>` e defina `S3_FORCE_PATH_STYLE=true` e `S3_DISABLE_ACL=true`. Configure `MEDUSA_CLOUD_S3_HOSTNAME=<projeto>.supabase.co` e `MEDUSA_CLOUD_S3_PATHNAME=/storage/v1/object/public/<bucket>/**` no storefront. [Medusa S3](https://docs.medusajs.com/resources/infrastructure-modules/file/s3) · [Supabase S3](https://supabase.com/docs/guides/storage/s3/authentication)

Na Vercel, vincule o repositório e configure **Root Directory** como `apps/storefront`. Informe a URL pública do backend, a chave publicável, o domínio final e o país `br`. Para conectar a vitrine de locação diretamente ao painel, remova `OC_SHOWROOM` e informe a origem pública da vitrine em `STOREFRONT_PUBLIC_URL` no backend. Crie a conta administrativa primeiro no painel ou execute o comando `medusa user` no ambiente da API com o build e os segredos de produção disponíveis.

O Railway Free anuncia 512 MB de RAM por serviço e US$ 1 de crédito mensal, enquanto o Medusa recomenda pelo menos 2 GB para operação. O Railway Hobby tem mínimo de US$ 5 e cobra o uso adicional. O Medusa Cloud oferece infraestrutura gerenciada, com Develop a partir de US$ 29/mês e Launch a partir de US$ 99/mês. O Supabase Free tem limites de uso e pausa por inatividade. O Vercel Hobby é destinado a uso pessoal e não comercial. Confirme custos e limites em vigor antes da ativação. [Railway](https://railway.com/pricing) · [Medusa Cloud](https://medusajs.com/pricing) · [Guia Medusa](https://docs.medusajs.com/learn/deployment/general) · [Supabase](https://supabase.com/pricing) · [Vercel Hobby](https://vercel.com/docs/plans/hobby)

## Notificações por e-mail para uma futura operação de vendas

Configure `SENDGRID_API_KEY` com permissão de envio e `SENDGRID_FROM` com um remetente verificado. Valide o domínio no provedor e teste em uma caixa real. O Medusa usa o provedor SendGrid nativo para e-mails em português de pedido recebido, pagamento capturado e expedição. O conteúdo padrão está pronto. IDs opcionais de templates dinâmicos permitem alterar o conteúdo pelo SendGrid. As variáveis de template são `storeName`, `displayId`, `accountUrl` e `trackingNumbers`. [Medusa SendGrid](https://docs.medusajs.com/resources/infrastructure-modules/notification/sendgrid)

## Frete para uma futura operação de vendas

Sem Melhor Envio, cadastre tarifas fixas reais em **Configurações → Locais e envio**, com as regras e regiões da loja. O Medusa inclui o frete selecionado no total do pedido.

Para cotar por CEP, cadastre o aplicativo no sandbox do Melhor Envio e configure `MELHOR_ENVIO_MODE=sandbox`, `MELHOR_ENVIO_TOKEN`, `MELHOR_ENVIO_USER_AGENT` com o nome da loja e e-mail de suporte, e os IDs em `MELHOR_ENVIO_SERVICES`. No painel, abra **Configurações → Locais e envio → Estoque principal**. Cadastre o CEP de origem, habilite o provedor **melhor-envio_br** e crie opções de preço calculado na zona Brasil, escolhendo uma modalidade habilitada por opção. Faça um pedido de teste com o CEP de destino e os pesos e medidas já cadastrados. Se usar token OAuth com validade, renove-o no provedor e atualize o segredo antes da expiração. Para produção, use credenciais do ambiente de produção e `MELHOR_ENVIO_MODE=production`.

A cotação retorna o valor da modalidade escolhida no checkout. O lojista compra a etiqueta no painel do Melhor Envio e lança o código e o link de rastreamento na expedição do Medusa. [API Melhor Envio](https://docs.melhorenvio.com.br/reference/introducao-api-melhor-envio) · [Cotação](https://docs.melhorenvio.com.br/docs/cotacao-de-fretes)

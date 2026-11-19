# Configuração da loja

## Identidade e catálogo

A identidade da Onda Clara é demonstrativa. Use as variáveis em `apps/storefront/.env.template` para substituir o nome, o logotipo, o WhatsApp, o e-mail e o Instagram. A paleta e as fontes estão em `apps/storefront/src/styles/brand.css`. Edite a campanha em `apps/storefront/src/lib/brand.ts` e substitua as imagens em `apps/storefront/public/images`. Configure `NEXT_PUBLIC_BASE_URL` com o domínio final.

No Medusa Admin, a seção Produtos permite editar fotos, descrições, preços, variações e estoque, além de organizar coleções e categorias. Use Pedidos para confirmar expedições e cadastrar rastreio e Promoções para configurar descontos. A chave usada na Vercel deve estar ligada ao canal de vendas da loja.

## Políticas e atendimento

Revise os textos institucionais em `apps/storefront/src/lib/policy-copy.ts` antes de vender. Confira razão social, CNPJ, canais de contato, prazos e conteúdo com o lojista. As páginas de entrega e devolução consultam os dados da região Brasil pelo Medusa. Mantenha esses dados alinhados com as opções de frete e as regras vigentes da loja.

## Vercel

Importe o repositório como um projeto Next.js e defina o diretório raiz como `apps/storefront`, com acesso aos arquivos da raiz do monorepo. Use Node.js 24. Para operar com o Medusa, defina `NEXT_PUBLIC_MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, `NEXT_PUBLIC_BASE_URL` e `NEXT_PUBLIC_DEFAULT_REGION=br` na Vercel. Configure a origem do frontend no backend.

A vitrine de apresentação usa `OC_SHOWROOM=1` e o catálogo fictício exportado do Medusa. Para exportar de novo, execute `node --env-file=apps/storefront/.env.local scripts/export-showroom.mjs` na raiz. Use este modo exclusivamente com um catálogo fictício sem dados de clientes. Para a loja operacional, remova `OC_SHOWROOM`.

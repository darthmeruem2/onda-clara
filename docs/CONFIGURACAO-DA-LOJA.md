# Configuração da Casa da Reforma Iguaí

## Catálogo e atendimento

A vitrine usa a logo, as cores e as informações do [site da Casa da Reforma Iguaí](https://feat-identidade-visual-20261.casa-da-reforma-iguai.pages.dev/). O catálogo inclui 20 equipamentos em seis categorias. A descrição, as aplicações e as informações úteis para o orçamento estão nas páginas de cada item.

O modo `NEXT_PUBLIC_STORE_MODE=rental` direciona as consultas ao WhatsApp publicado pelo cliente. O link de cada equipamento abre uma mensagem com o nome do item preenchido. Preços, disponibilidade, retirada e entrega são combinados no atendimento. Mude os contatos pelo arquivo de ambiente ou pelas variáveis do projeto na Vercel.

- **Identidade e textos** em `apps/storefront/src/lib/brand.ts` e `apps/storefront/src/styles/brand.css`.
- **Logo e fotos** em `apps/storefront/public/images/casa/`. A logo PNG original está junto da versão WebP usada na página.
- **Dados usados na importação** em `apps/backend/src/data/casa-reforma-catalog.json`. Use o [guia de implantação](implantacao.md) para carregar os equipamentos no Medusa.
- **Edição do catálogo** pelo menu **Produtos** do Medusa Admin. Em **Categorias** e **Coleções**, é possível reorganizar os equipamentos.

## Publicação na Vercel

A vitrine publicada lê uma exportação dos produtos do Medusa. Depois de editar o catálogo no painel, execute `node --env-file=apps/storefront/.env.local scripts/export-showroom.mjs` na raiz e publique a exportação atualizada. O script inclui os equipamentos marcados como `quote_only` nos metadados e usa apenas informações públicas do catálogo.

Para que as edições no painel apareçam diretamente na vitrine, hospede a API do Medusa e configure `NEXT_PUBLIC_MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, `NEXT_PUBLIC_BASE_URL` e `NEXT_PUBLIC_DEFAULT_REGION=br` na Vercel. Remova `OC_SHOWROOM` e mantenha `NEXT_PUBLIC_STORE_MODE=rental`.

No painel Medusa, use **Configurações → Regiões → Brasil → Metadados** para personalizar `privacy_copy`, `terms_copy` e `returns_copy`. Use uma linha em branco entre parágrafos e confirme os textos com o lojista.

# Identidade visual da Casa da Reforma Iguaí

A vitrine usa a logo da empresa, a família tipográfica Barlow e a paleta publicada no site de referência. O azul-marinho e o amarelo destacam o acesso ao catálogo. O azul intenso identifica ações e links. As fotografias dos equipamentos vieram das respectivas páginas do catálogo.

## Origem dos arquivos

- Logo original `apps/storefront/public/images/casa/logo-casa-da-reforma-iguai.png`. A versão WebP exibe a mesma arte com menor tamanho. O favicon usa o símbolo da casa recortado da logo.
- Fotos de catálogo `apps/storefront/public/images/casa/`. O nome de cada arquivo corresponde ao identificador do equipamento.
- Fontes Barlow em `apps/storefront/public/fonts/`, com a licença SIL Open Font License. [Projeto Barlow](https://github.com/jpt/barlow)
- [Site de referência fornecido para o projeto](https://feat-identidade-visual-20261.casa-da-reforma-iguai.pages.dev/)

## Como atualizar a marca

Configure `NEXT_PUBLIC_STORE_NAME`, `NEXT_PUBLIC_STORE_LOGO`, `NEXT_PUBLIC_STORE_WHATSAPP`, `NEXT_PUBLIC_STORE_INSTAGRAM` e `NEXT_PUBLIC_STORE_EMAIL` para substituir os dados públicos. O WhatsApp recebe DDI, DDD e número. Textos institucionais, informações da campanha e região de atendimento ficam em `apps/storefront/src/lib/brand.ts`, nas páginas Sobre e Atendimento e em `apps/storefront/src/lib/policy-copy.ts`. As cores e fontes ficam em `apps/storefront/src/styles/brand.css`.

O favicon e as imagens sociais ficam em `apps/storefront/src/app/icon.png`, `opengraph-image.jpg` e `twitter-image.jpg`. O diretório `public/images/casa/` contém a logo e as fotos locais que alimentam a vitrine estática.

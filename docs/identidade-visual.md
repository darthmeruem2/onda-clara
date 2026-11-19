# Identidade visual da Casa da Reforma Iguaí

A vitrine usa o símbolo da empresa, a família tipográfica Barlow e as cores da marca. O azul-marinho destaca títulos e navegação. O azul intenso identifica ações e links. As fotografias dos equipamentos vieram das respectivas páginas do catálogo.

As duas primeiras seções da página inicial se inspiram na tipografia, nos espaços e na composição das fotografias dos primeiros scrolls de `Pinterest.mp4`. Os textos apresentam o serviço de locação em Santo André, as aplicações dos equipamentos e como combinar o orçamento pelo WhatsApp. GSAP anima a entrada e o enquadramento das fotos nessas seções, com tratamento para a preferência de movimento reduzido.

## Origem dos arquivos

- Logo original `apps/storefront/public/images/casa/logo-casa-da-reforma-iguai.png`. O cabeçalho e o rodapé exibem o símbolo recortado da versão WebP e o nome em texto. O favicon usa o mesmo símbolo. A variável `NEXT_PUBLIC_STORE_LOGO` permite exibir outra arte completa.
- Fotos de catálogo `apps/storefront/public/images/casa/`. O nome de cada arquivo corresponde ao identificador do equipamento.
- Três imagens ilustrativas de campanha em `apps/storefront/public/images/casa/campanha/`, geradas para a página inicial e otimizadas em WebP.
- Fontes Barlow em `apps/storefront/public/fonts/`, com a licença SIL Open Font License. [Projeto Barlow](https://github.com/jpt/barlow)
- [Site de referência fornecido para o projeto](https://feat-identidade-visual-20261.casa-da-reforma-iguai.pages.dev/)

## Como atualizar a marca

Configure `NEXT_PUBLIC_STORE_NAME`, `NEXT_PUBLIC_STORE_LOGO`, `NEXT_PUBLIC_STORE_WHATSAPP`, `NEXT_PUBLIC_STORE_INSTAGRAM` e `NEXT_PUBLIC_STORE_EMAIL` para substituir os dados públicos. O WhatsApp recebe DDI, DDD e número. Textos institucionais, informações da campanha e região de atendimento ficam em `apps/storefront/src/lib/brand.ts`, nas páginas Sobre e Atendimento e em `apps/storefront/src/lib/policy-copy.ts`. As cores e fontes ficam em `apps/storefront/src/styles/brand.css`.

O favicon e as imagens sociais ficam em `apps/storefront/src/app/icon.png`, `opengraph-image.jpg` e `twitter-image.jpg`. O diretório `public/images/casa/` contém a logo e as fotos locais que alimentam a vitrine estática.

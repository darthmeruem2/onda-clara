# Identidade visual

A campanha Entre Marés apresenta a Onda Clara, loja demonstrativa de moda em linho. A imagem principal valoriza o corte da camisa e enquadra o texto sobre a parede em sombra. No celular, o enquadramento privilegia a modelo e a chamada fica ao alcance do polegar. O catálogo usa luz e fundos consistentes, com enquadramentos e imagens de detalhe pensados para cada tipo de peça.

A paleta combina marfim `#faf8f1`, oliva `#393e2a`, areia `#ece8da` e um cinza-esverdeado `#dedfd2`. Instrument Serif é usada nos títulos e na assinatura da loja. DM Sans atende navegação, preços e formulários. As fontes são servidas localmente e suas licenças ficam em `apps/storefront/public/fonts`.

- Altere a assinatura, o nome, os contatos e os links sociais em `apps/storefront/.env.local`. As chaves começam com `NEXT_PUBLIC_STORE_`. Para usar um arquivo de logo, coloque-o na pasta `public` e use o caminho correspondente em `NEXT_PUBLIC_STORE_LOGO`, por exemplo `/images/logo.svg`.
- Altere os nomes, textos, caminhos e vínculos de campanha em `apps/storefront/src/lib/brand.ts`. Substitua as fotos na pasta `apps/storefront/public/images`. As fotos incluídas foram geradas para a demonstração.
- Para trocar as cores ou a tipografia, use `apps/storefront/src/styles/brand.css`. Para trocar o ícone do navegador e as imagens sociais, substitua `public/favicon.ico`, `src/app/icon.svg`, `src/app/opengraph-image.jpg` e `src/app/twitter-image.jpg`, todos dentro de `apps/storefront`.
- Cadastre itens reais, imagens de produto, coleções e categorias pelo Admin do Medusa. A página inicial lê os produtos e categorias do banco e exibe os primeiros quatro produtos da coleção escolhida.

A composição comercial foi informada pela sequência de campanha e categorias da COS, pelo catálogo brasileiro da Osklen e pela hierarquia visual de produto do tema Prestige Couture. A arquitetura comercial usa o DTC oficial do Medusa, depois de consultar as opções B2C mantidas pela equipe no catálogo de starters. [COS](https://www.cos.com/en-us/women) · [Osklen](https://www.osklen.com.br/colecao/feminino) · [Prestige](https://themes.shopify.com/themes/prestige/presets/couture) · [Medusa](https://medusajs.com/starters)

As skills Frontend Design e Copywriting orientaram a composição, o ritmo tipográfico e a redação com chamadas explícitas. A CLI da UI/UX Pro Max orientou a revisão de contraste, foco, áreas de toque e movimento reduzido. A skill Storefront Best Practices orientou o uso de dados nativos e a continuidade da navegação regional.

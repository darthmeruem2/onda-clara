# Casa da Reforma Iguaí

## Entrega

- [Vitrine na Vercel](https://onda-clara-vitrine.vercel.app/)
- [Pull request no GitHub](https://github.com/darthmeruem2/onda-clara/pull/1)
- Capturas da página inicial no [celular](docs/screenshots/loja-celular.jpg) e no [computador](docs/screenshots/loja-computador.jpg). Catálogo no [celular](docs/screenshots/catalogo-celular.jpg) e no [computador](docs/screenshots/catalogo-computador.jpg). Capturas anteriores de [produto](docs/screenshots/equipamento.jpg) e [painel](docs/screenshots/admin.png).

## Identidade e catálogo

- A vitrine usa o símbolo, as cores, a tipografia, o WhatsApp e o Instagram publicados pela Casa da Reforma Iguaí. O nome foi recomposto ao lado do símbolo para melhorar a leitura em telas pequenas.
- As duas primeiras seções seguem a composição editorial dos primeiros scrolls do vídeo enviado. As três fotos ilustrativas da campanha foram geradas para a página inicial. A abertura e a segunda seção usam GSAP e respeitam a preferência por movimento reduzido.
- O catálogo ganhou busca e filtros mais visíveis e uma grade responsiva. As 20 fichas mantêm as fotos da loja. [Identidade visual](docs/identidade-visual.md)
- Cadastrei no Medusa os 20 equipamentos de locação das seis categorias, com fotos, descrições, aplicações e informações úteis para o orçamento. [Site de origem](https://feat-identidade-visual-20261.casa-da-reforma-iguai.pages.dev/equipamentos/index.html)
- A loja de origem publica valores e disponibilidade sob consulta. Cada página de equipamento direciona ao WhatsApp com o nome do item na mensagem. Nenhuma tarifa, estoque ou disponibilidade foi presumida.
- Os produtos e a promoção fictícios da Onda Clara foram despublicados na base local. O histórico existente fica no Medusa.
- O projeto usa a base oficial Medusa DTC Starter em `44f2979627d8b9dac3336ee039a99a433f4c3123`, com Next.js e 21 skills versionadas.

## Validação

- Validei a página inicial em cinco larguras entre 320 px e 1440 px no Chromium. Confirmei a animação de rolagem e a versão com movimento reduzido. Repeti as verificações do catálogo, da busca sem acento, do filtro por categoria e do link de orçamento após o refinamento.
- Verifiquei a logo, as 20 fotos, a busca, o filtro por categoria e a página de equipamento em um navegador com viewport de celular. O link de orçamento aponta para o número publicado e preenche o nome do equipamento.
- Confirmei no Medusa os 20 equipamentos publicados, seis categorias, quatro itens antigos em rascunho e os pedidos de teste preservados. O painel exibiu o catálogo em português. TypeScript passou no storefront e backend.

- Na publicação anterior, as 20 páginas de equipamento responderam HTTP 200 no domínio público. Repeti no domínio o teste móvel da logo, das imagens, do catálogo, da busca, do filtro e do orçamento.

## Como continuar

A Vercel usa a exportação do catálogo do Medusa. Para publicar alterações feitas no painel nessa arquitetura, reexporte o catálogo e faça um novo deploy. Para sincronizar alterações automaticamente, use uma instância Medusa persistente conectada ao storefront. O painel desta sessão é local.

1. [Configuração da vitrine](docs/CONFIGURACAO-DA-LOJA.md) — identidade, contatos e exportação.
2. [Implantação do Medusa](docs/implantacao.md) — importação, painel e infraestrutura.
3. [Guia do Mercado Pago](docs/mercado-pago.md) — integração mantida no projeto para uma futura operação de venda. O catálogo de locação opera por orçamento.

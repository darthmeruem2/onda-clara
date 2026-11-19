# Origem das skills

Cada diretório abaixo mantém o `SKILL.md` e os arquivos auxiliares da revisão indicada. O nome de uma pasta pode diferir do nome declarado nos metadados da skill. O Codex pode abrir o arquivo diretamente sem depender da descoberta automática na sessão.

| Skills | Código-fonte fixado |
| --- | --- |
| Find Skills | [vercel-labs/skills · 57217cf](https://github.com/vercel-labs/skills/tree/57217cf86ba38148a57af9e90d14a4c049558330/skills/find-skills) |
| Frontend Design | [anthropics/skills · e4bb5d9](https://github.com/anthropics/skills/tree/e4bb5d960d87126ff3b3a8af1a104b7db67560ba/skills/frontend-design) |
| React Best Practices, Web Design Guidelines e Deploy to Vercel | [vercel-labs/agent-skills · 1a2c79d](https://github.com/vercel-labs/agent-skills/tree/1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62/skills) |
| Regras de interface para consulta offline | [vercel-labs/web-interface-guidelines · 434b7f9](https://github.com/vercel-labs/web-interface-guidelines/blob/434b7f91364665f2f733b310ec54809bf8f37937/command.md) |
| Medusa Backend, Storefront, Admin, migrações, conta administrativa e Ecommerce Storefront Best Practices | [medusajs/medusa-agent-skills · c5a56b4](https://github.com/medusajs/medusa-agent-skills/tree/c5a56b4646b2c39d49b1da10c8a5404236b6b4ba/plugins) |
| UI/UX Pro Max | [nextlevelbuilder/ui-ux-pro-max-skill · 2de1134](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/2de1134dc4d1cfe112934611ae5803ae17a1bd7e/.claude/skills/ui-ux-pro-max) |
| Copywriting | [coreyhaines31/marketingskills · 73573e9](https://github.com/coreyhaines31/marketingskills/tree/73573e94a06a39965978b3fa1f9c1eace8cebc7c/skills/copywriting) |
| Playwright e Security Best Practices | [openai/skills · 49f948f](https://github.com/openai/skills/tree/49f948faa9258a0c61caceaf225e179651397431/skills/.curated) |
| GSAP Core, React e Performance | [greensock/gsap-skills · aed9cfd](https://github.com/greensock/gsap-skills/tree/aed9cfd3277740755f6bfc1155c7aa645403b760/skills) |
| Supabase e Supabase Postgres Best Practices | [supabase/agent-skills · c9be0e9](https://github.com/supabase/agent-skills/tree/c9be0e931b7930f7d02126d04774d904c381e7d7/skills) |

A seleção foi feita consultando o diretório Skills.sh e os repositórios originais. A instalação copiou diretórios revisados e preservou as licenças disponíveis. Foram verificados links simbólicos, ganchos, scripts auxiliares e chamadas de rede. O utilitário do UI/UX Pro Max usa bibliotecas padrão do Python para consultar dados locais. O wrapper oficial do Playwright resolve o pacote `@playwright/cli` via `npx` quando executado. As instruções de deploy da Vercel foram copiadas da própria equipe de hospedagem, sem o script alternativo de empacotamento e upload presente na opção da OpenAI.

Ponytail e Caveman foram avaliadas na origem. A ativação persistente e os estilos de resposta dessas revisões interfeririam na entrega e na documentação do projeto, por isso ficaram fora da instalação. As skills de GSAP fornecem referências para animações que precisarem da biblioteca. Sua presença no repositório não adiciona uma dependência ao site.

Fontes avaliadas para concisão: [dietrichgebert/ponytail · 96608e0](https://github.com/dietrichgebert/ponytail/tree/96608e078b2d5ea607c5c3b8b5a54d1c1fba6846/skills/ponytail) e [juliusbrussee/caveman · a192894](https://github.com/juliusbrussee/caveman/tree/a192894723a8f47e7f504c7b5041967ff1f18e55/skills/caveman).

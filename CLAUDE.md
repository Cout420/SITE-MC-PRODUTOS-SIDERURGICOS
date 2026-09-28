# CLAUDE.md — regras do projeto

## Divisão de trabalho entre modelos (regra do cliente, obrigatória)
- **Opus 5.5 = cérebro.** Arquitetura, decisões de design e conversão, segurança, revisão de código, QA final e comunicação com o cliente. Define padrões em `docs/BRIEF-BUILD.md`.
- **Sonnet 5 = mão de obra.** Toda construção repetitiva (páginas, conteúdo, arquivos de infraestrutura) é delegada a subagentes com `model: "sonnet"`, com escopo de arquivos exclusivo por agente e validação automática antes de devolver.
- O cérebro revisa tudo que a mão de obra entrega antes do commit.

## Projeto
- Site estático (HTML/CSS/JS, sem build) da MC Produtos Siderúrgicos. Ver `README.md`.
- Padrões obrigatórios de páginas: `docs/BRIEF-BUILD.md`.
- Fonte de verdade dos dados da empresa: `docs/levantamento-site-antigo.md`. Nunca inventar números, depoimentos, clientes ou certificações.
- Integrações (RD Station, GTM, webhook) só em `assets/js/config.js`.
- Validar com `python3 -m http.server` + Playwright (Chromium em `/opt/pw-browsers`): 0 erros JS, 1 `<h1>` por página, sem scroll horizontal em 390px, JSON-LD válido.

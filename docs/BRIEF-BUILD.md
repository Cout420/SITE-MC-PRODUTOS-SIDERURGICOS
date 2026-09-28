# Brief de construção — novo site MC Produtos Siderúrgicos

Arquitetura e padrões definidos pelo "cérebro" do projeto. Quem constrói páginas segue este documento à risca.

## Stack
- Site estático: HTML + `assets/css/main.css` + `assets/js/config.js` + `assets/js/main.js` + sprite `assets/img/icons.svg`. Sem framework, sem build, sem dependências novas.
- Caminhos absolutos a partir da raiz (`/assets/...`, `/contato/`). Cada página é `pasta/index.html` (URLs com barra final, iguais às do site antigo para não perder SEO).
- Servir localmente: `python3 -m http.server 8080` na raiz.

## Página-modelo
`/index.html` é a referência. Toda página nova copia **literalmente** de `index.html`:
1. `<head>` inteiro, trocando apenas: `<title>`, `meta description`, `canonical`, `og:title`, `og:description`, `og:url` e o JSON-LD (ver SEO abaixo). O script de Consent Mode e os scripts `config.js`/`main.js` com `defer` ficam iguais.
2. Do `<a class="skip-link">` até o fim do menu mobile (`</div>` do `#mobile-nav`): igual. Marque o link da seção atual com `aria-current="page"` no `.nav`.
3. Do `<footer class="footer">` até `</body>`: igual (footer, `.fab`, `.mobile-bar`, `#quote-drawer`, `.drawer-backdrop`, `#cookie`).
4. Entre eles, `<main id="conteudo">` com o conteúdo da página.

## Componentes disponíveis (use as classes de main.css; não crie CSS novo)
- Topo de página interna: `<section class="page-hero">` com `.hero__bg` opcional, `<ol class="breadcrumb">` (lista com `aria-label="Você está aqui"`, último item `aria-current="page"`), `<span class="eyebrow">`, **um único `<h1>`**, `<p class="lead">`, `.btn-row` com CTA de orçamento + WhatsApp.
- Seções: `.section`, `.section--muted`, `.section--dark`, `.section--tight`, `.container`, `.section-head` (+ `--center`), `.h-section`, `.lead`, `.eyebrow`, `.hl`.
- Grades: `.grid.grid-2|3|4`, `.split` (+ `--rev`), `.stack`.
- Cards: `.card` (+ `data-tilt`, `.card--link`, `.card--feature`, `.card__tag`, `.card__foot`), `.icon-badge`, `.chips/.chip`, `.sector`, `.steps/.step` (com `.steps__line`), `.checks`, `.cert`, `.seals/.seal`, `.panel`, `.event`, `.post`, `.cta-band` (+ `.cta-band__glow`), `.stats/.stat`.
- Itens de produto: `.items` > `.item` (nome em `<strong>`, norma em `<small>`, botão `.add-quote`).
- Abas: container `data-tabs`, `.tabs__list` com `role="tablist"`, botões `role="tab" aria-selected aria-controls id`, painéis `.tabs__panel role="tabpanel" aria-labelledby` (os inativos com `hidden`).
- Tabela: `.table-wrap` > `table.table` com `<caption class="sr-only">`.
- FAQ: `.faq[data-single]` > `<details><summary>Pergunta <i aria-hidden="true"></i></summary><div class="faq__body"><p>…</p></div></details>`.
- Artigo: `.article-layout` > `.prose` + `<aside class="sticky-aside">`.
- Ícones: `<svg class="icon" aria-hidden="true"><use href="/assets/img/icons.svg#i-NOME"></use></svg>`. Ver ids disponíveis em `assets/img/icons.svg`.
- Animações: `data-reveal` (`""`, `left`, `right`, `zoom`), `data-stagger=".08"` no pai para escalonar filhos, `data-tilt` em cards, `data-magnetic` em CTA principal, `.split-words` no H1 do hero, `data-count="1234"` para contadores (o número final **já escrito** no HTML).

## Conversão (obrigatório em toda página)
- CTA de orçamento (`/orcamento/`) e WhatsApp visíveis no page-hero **e** num `.cta-band` no final do `<main>`.
- WhatsApp: `<a data-whatsapp data-loc="IDENTIFICADOR" href="https://wa.me/551146107679">`. Mensagem própria: `data-whatsapp="Olá, MC! Quero cotar tubos ASTM A106."`.
- Botão de lista de cotação em cada item de produto:
  `<button class="add-quote" type="button" data-add-quote="Tubo sem costura ASTM A106" data-family="Tubos"><svg class="icon" aria-hidden="true"><use href="/assets/img/icons.svg#i-plus"></use></svg><span class="add-quote__label">Cotar</span></button>`
- Formulários de lead: `<form class="form" data-lead-form data-conversion="IDENTIFICADOR" novalidate>`. Cada campo em `.field` com `<label for>`, input com `name` padronizado e `<span class="field__error" aria-live="polite"></span>`. Sempre: checkbox `name="consent"` obrigatório dentro de `label.consent` com link para `/politica-de-privacidade/`, honeypot `.hp`, botão `type="submit"`, `<div class="form__status" role="status" aria-live="polite"></div>`. Copie o formulário do hero de `index.html` como modelo.
- Nomes de campo padronizados (o JS mapeia para o RD Station): `nome, email, whatsapp (data-mask="phone"), empresa, cnpj (data-mask="cnpj"), cargo, cidade ("Cidade/UF"), setor, produto, quantidade, mensagem, lista`.
- Identificadores de conversão: `orcamento-site`, `orcamento-tubos`, `orcamento-conexoes`, `orcamento-pead`, `orcamento-barras-perfis`, `orcamento-eletrodutos`, `contato-site`, `catalogo-2026`.

## SEO (obrigatório)
- Um `<h1>` por página. Hierarquia h2 → h3 sem pular níveis.
- `<title>` de até ~60 caracteres com palavra-chave + "| MC Produtos Siderúrgicos"; `meta description` de 140–160 caracteres; `canonical` com URL absoluta `https://www.mcprodutos.com.br/...`.
- JSON-LD: `BreadcrumbList` em toda página interna; `Product`/`ItemList` nas páginas de produto (sem preço, sem avaliação inventada); `FAQPage` quando houver FAQ; `Article` nos posts; `ContactPage`/`AboutPage` quando fizer sentido. Organização referenciada por `{"@id":"https://www.mcprodutos.com.br/#org"}`.
- `alt` em toda imagem; ícones decorativos com `aria-hidden="true"`.

## Tom e conteúdo
- Português do Brasil, técnico, direto, B2B. Proibido: frases de template ("projeto dos seus sonhos", "algo incrível"), lorem ipsum, depoimentos inventados, números não listados abaixo, clientes/logos inventados.
- Fonte de verdade dos dados: o mapa mental em `docs/levantamento-site-antigo.md` (conteúdo técnico de cada produto, normas, setores, diferenciais, certificado, contatos).
- Dados oficiais: Rua Arutec, **303** – Jd. Fazenda Rincão, Arujá/SP, CEP 07428-275 · (11) 4610-7679 (também WhatsApp) · vendas@mcprodutos.com.br · CNPJ 10.534.283/0001-05 · no mercado desde 2008 · +1.600 itens · +4.500 clientes · ISO 9001:2015 (DEX, BR066/22-SGQ-2459907, emitido 23/11/2025, válido até 22/11/2028) · Nota 5,0 no Google.
- Tempo de mercado: use só "desde 2008" (nunca "30 anos" ou "10 anos").
- Tabelas técnicas: pode trazer medidas padronizadas públicas das normas (ex.: DN/NPS × diâmetro externo × espessura SCH 40/80 segundo ASME B36.10; SDR × PN do PEAD PE100), sempre com nota "Valores de referência. Confirme a disponibilidade e a especificação com nosso time." Nada de preço ou estoque.

## Acessibilidade e desempenho
- Contraste AA, foco visível (já no CSS), `lang="pt-BR"`, formulários com labels.
- Sem imagens pesadas: use SVG/ícones do sprite. Onde uma foto real fizer falta, deixe um comentário `<!-- FOTO: descrição do que fotografar -->`.
- Não adicione bibliotecas externas.

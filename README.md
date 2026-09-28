# MC Produtos Siderúrgicos — site institucional e de conversão

Site estático, rápido e sem dependências da MC Produtos Siderúrgicos (distribuidora de aço carbono e PEAD em Arujá/SP). Substitui o WordPress + Elementor antigo, **mantendo as mesmas URLs** das páginas e artigos para não perder posicionamento no Google.

## Rodar localmente
```bash
python3 -m http.server 8080
# abra http://localhost:8080
```
Os caminhos são absolutos (`/assets/...`), então abra pelo servidor, não pelo arquivo.

## Estrutura
```
index.html                     Home
produtos/                      Hub de produtos
tubos-de-aco-carbono/  conexoes-e-flanges/  eletrodutos/  barras-e-perfis/  tubos-pead/
sobre-nos/  qualidade/  contato/  orcamento/  politica-de-privacidade/  404.html
blog/ + 5 artigos (mesmas URLs do site antigo)
assets/css/main.css            Design system (tokens, componentes, animações)
assets/js/config.js            ← integrações: RD Station, webhook, GTM, WhatsApp
assets/js/main.js              Interações, lista de cotação, formulários, consentimento
assets/img/icons.svg           Sprite de ícones
assets/docs/                   PDFs (catálogo, certificado ISO, política da qualidade)
_headers  _redirects  .htaccess  robots.txt  sitemap.xml
scripts/backup-site-antigo.sh  Backup completo do site antigo
docs/                          Levantamento, checklist de correções, brief de construção
```

## Conversão
- **Cotação rápida** no topo da home, **lista de cotação** (o visitante junta itens com “Cotar” e envia tudo de uma vez por formulário ou WhatsApp), **orçamento em 3 etapas**, **catálogo com captura**, WhatsApp flutuante e barra fixa no celular.
- Cada formulário tem um identificador de conversão (`orcamento-site`, `orcamento-tubos`, `catalogo-2026`, `contato-site`…) e envia nome, e-mail, WhatsApp, empresa, CNPJ, cidade, produto, quantidade, mensagem, página de origem e UTM.
- Sem integração configurada, o pedido abre no WhatsApp já preenchido: nenhum lead se perde.

## Integrar ao RD Station
1. RD Station Marketing → Conta → Integrações → copie o **token público**.
2. Cole em `assets/js/config.js` → `rdPublicToken`.
3. Crie os campos personalizados listados em `docs/checklist-correcoes.md`.
4. Envie um teste de cada formulário e confira o lead no RD.

Opcional: `leadWebhook` (n8n/Make/Zapier) recebe o mesmo lead em paralelo, por exemplo para avisar o vendedor.

## Medição e LGPD
- GTM `GTM-ND9KVHL4` carregado com **Google Consent Mode v2** (padrão negado até o aceite).
- Eventos no `dataLayer`: `generate_lead`, `whatsapp_click`, `phone_click`, `email_click`, `catalog_download`, `add_to_quote`, `form_start`, `form_step`, `faq_open`, `consent_update`.

## Backup do site antigo (fazer antes de ele sair do ar)
```bash
bash scripts/backup-site-antigo.sh
```
Baixa páginas, artigos, imagens e PDFs, gera um manifesto com hashes e copia os PDFs para `assets/docs/`. Inventário completo de links: `docs/arquivo-site-antigo.md`.

## Publicar
Qualquer hospedagem estática: **Cloudflare Pages** (recomendado, pois o domínio já usa Cloudflare; lê `_headers` e `_redirects`), Netlify ou a hospedagem LiteSpeed atual (lê `.htaccess`).

## Pendências
Ver `docs/checklist-correcoes.md` → “Pendências do cliente”.

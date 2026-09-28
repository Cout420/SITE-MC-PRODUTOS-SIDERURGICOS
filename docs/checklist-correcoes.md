# Checklist: problemas do site antigo × solução no novo site

Base: `docs/levantamento-site-antigo.md` (mapa mental de 28/09/2026).
✅ = resolvido no código · 🔧 = depende de configuração/acesso do cliente · ❓ = confirmar com o cliente

## Crítico: perde lead ou gera risco
| Problema no site antigo | Solução no novo site | Status |
|---|---|---|
| Newsletter sem lista (e-mails se perdiam) | Newsletter removida; captura passa a ser o **Catálogo 2026** (`catalogo-2026`), enviado ao RD | ✅ código · 🔧 token RD |
| Formulário sem ligação comprovada com o RD | Todos os formulários enviam à **API de conversões do RD** com identificador próprio, UTM e página de origem (`assets/js/main.js`) + webhook opcional | ✅ código · 🔧 `rdPublicToken` em `config.js` |
| Sem integração configurada = lead perdido | Se RD/webhook estiverem vazios ou falharem, o pedido abre no **WhatsApp já preenchido** | ✅ |
| Páginas de produto sem botão de orçamento (inclusive as do Google Ads) | CTA de orçamento + WhatsApp no topo, formulário próprio, botão “Cotar” por item, barra fixa no celular | ✅ |
| Rascunhos /landing-1/ e /nova-home/ indexados | Não existem no novo site; 301/410 em `_redirects`/`.htaccess`; fora do sitemap | ✅ |
| LGPD: sem política, banner sem cookies, sem Consent Mode | `/politica-de-privacidade/` com tabela de cookies; banner próprio (Aceitar/Rejeitar/Personalizar); **Consent Mode v2** padrão *denied* antes do GTM; consentimento em todos os formulários | ✅ · ❓ nomear encarregado (DPO) |

## Importante: credibilidade e SEO
| Problema | Solução | Status |
|---|---|---|
| Nenhuma página com H1; sem meta description | 1 H1 por página, title e description únicos em todas | ✅ |
| Título “MC Produtos - MC Produtos” | “Distribuidora de Tubos e Aço Carbono em SP \| MC Produtos Siderúrgicos” | ✅ |
| Endereço 303 × 365 | Só **Rua Arutec, 303** (igual ao certificado, Google e LinkedIn) | ✅ |
| Tempo de mercado divergente (30 × 10 anos) | Só “desde 2008” (data do CNPJ) | ✅ · ❓ cliente quer citar experiência da equipe? |
| Tubos PEAD fora da home e do hub | PEAD em destaque na home, no hub, no menu e com página técnica | ✅ |
| Catálogo de 18 MB aberto sem cadastro | Catálogo liberado após cadastro; link antigo do PDF redireciona para o formulário | ✅ · 🔧 salvar o PDF em `assets/docs/` (rodar backup) |
| Links “#”, logo levando a site de terceiros, rota partindo de Santos | Todos os links reais; rota do Google Maps usa a localização do visitante (`destination=` sem origem) | ✅ |
| Facebook triplicado | Não linkado; recomendação: unificar numa página oficial | 🔧 cliente |
| Tag do Google Ads duplicada | Só o GTM é carregado (Ads/GA4 dentro dele); sem Site Kit | ✅ · 🔧 revisar contêiner GTM |
| URL de spam indexada, usuário exposto, sem cabeçalhos de segurança | 410 para /2023/*, /author/*; `_headers`/`.htaccess` com HSTS, CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy | ✅ · 🔧 remover URL no Search Console |
| Contadores apareciam “0” para Google | Número final já está no HTML; a animação só roda no navegador | ✅ |
| Sem dados estruturados | Organization/LocalBusiness, WebSite, FAQPage, BreadcrumbList, ItemList/Product, Article | ✅ |
| Sitemap com lixo (templates, autor, uncategorized) | `sitemap.xml` só com páginas públicas | ✅ |
| Palavras-chave coladas no fim da página PEAD | Viraram tabela técnica SDR × PN × DN | ✅ |
| Escopo ISO muito maior que o site | Bloco “Sob consulta” com todo o escopo do certificado | ✅ |

## Ajustes finos
| Problema | Solução | Status |
|---|---|---|
| “nÃo”, “Entre entre em contato”, “para sua clientes”, “(011)” | Textos reescritos; telefone “(11) 4610-7679” | ✅ |
| Textos de template (“projeto dos seus sonhos”) | Copy B2B técnica | ✅ |
| Imagens sem alt | Ícones SVG decorativos com `aria-hidden`; imagens futuras com `alt` obrigatório | ✅ |
| Widget de avaliações desatualizado (3 × 6) | Nota 5,0 exibida com link para o Google (sem widget pesado) | ✅ · 🔧 atualizar nº de avaliações |
| “Certificado ISO 9000” | “ISO 9001:2015” com número, emissão e validade | ✅ |
| Blog parado há 20 meses | 5 artigos reescritos (700–1000 palavras) nas mesmas URLs | ✅ · 🔧 pauta de 2 artigos/mês |
| Home com 134 requisições e 17 plugins | 1 CSS, 2 JS, 1 sprite SVG, sem jQuery/Elementor | ✅ |

## Pendências do cliente (acessos)
- [ ] Token público do RD Station → `assets/js/config.js` (`rdPublicToken`) e teste de cada formulário chegando ao RD
- [ ] Criar no RD os campos personalizados: `cf_cnpj`, `cf_produto_de_interesse`, `cf_quantidade`, `cf_setor`, `cf_mensagem`, `cf_pagina_de_origem`
- [ ] GTM: gatilhos para os eventos `generate_lead`, `whatsapp_click`, `phone_click`, `email_click`, `catalog_download`, `add_to_quote`, `form_start`; remover a tag duplicada do Ads; adicionar Meta Pixel respeitando `consent_update`
- [ ] Logo oficial e fotos reais (pasta do Google Drive) → `assets/img/`
- [ ] Rodar `scripts/backup-site-antigo.sh` **antes** de o site antigo sair do ar
- [ ] Confirmar: horário de abertura, vigência SANEPAR/CRC Petrobras, encarregado LGPD
- [ ] Search Console: enviar `sitemap.xml`, remover URL de spam

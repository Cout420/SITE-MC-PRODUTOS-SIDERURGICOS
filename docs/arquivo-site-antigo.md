# Arquivo do site antigo — inventário de URLs (mcprodutos.com.br)

Este documento lista todas as URLs citadas em `docs/levantamento-site-antigo.md` e `docs/pesquisa-redes-sociais.md`, com o destino planejado no novo site e o status do backup.

**Importante — limite deste ambiente:** este ambiente de desenvolvimento **não tem acesso de rede ao domínio antigo** `mcprodutos.com.br` (bloqueado pelo proxy, confirmado durante o levantamento). Por isso, nenhuma URL abaixo foi baixada a partir daqui — todo o "status de backup" está como **pendente**. O script `scripts/backup-site-antigo.sh` deve ser rodado a partir de uma máquina com acesso normal à internet (ex.: notebook do time, servidor de deploy) antes que o site antigo saia do ar.

## Como rodar o backup

1. Tenha `wget`, `curl`, `tar` e, de preferência, `jq` instalados (em Debian/Ubuntu: `sudo apt install wget curl tar jq`; em macOS com Homebrew: `brew install wget curl jq`).
2. A partir da raiz do projeto, rode:
   ```bash
   bash scripts/backup-site-antigo.sh
   ```
3. O script cria `backup-site-antigo/AAAA-MM-DD/` com:
   - `mirror/` — espelho completo via `wget --mirror` (HTML, CSS, JS, imagens, com links convertidos para navegação offline).
   - `raw/` — cópia individual de cada página, post, PDF, sitemap e endpoint `wp-json` listado abaixo, mais a mídia referenciada pela API.
   - `MANIFESTO.txt` — lista de todos os arquivos baixados com hash SHA-256, para conferência de integridade.
4. O script também copia automaticamente os 3 PDFs para `assets/docs/` com os nomes já usados pelo novo site (`MC-Catalogo-2026-web.pdf`, `DEX-CERTIFICADO-MC-COMERCIO.pdf`, `Politica-da-Qualidade-e-Objetivos-MC-2024.pdf`).
5. Ao final, um `.tar.gz` de todo o backup do dia é gerado em `backup-site-antigo/mcprodutos-backup-AAAA-MM-DD.tar.gz` — guarde esse arquivo fora do repositório (Drive, S3, etc.), como cópia de segurança definitiva antes do domínio sair do ar.
6. Depois de rodar, atualize a coluna "status de backup" abaixo para "feito em AAAA-MM-DD".

## Páginas

| URL | O que é | Destino no novo site | Status de backup |
|---|---|---|---|
| https://www.mcprodutos.com.br/ | Home | `/` (recriada) | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/sobre-nos/ | Institucional | `/sobre-nos/` (recriada) | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/produtos/ | Hub de produtos | `/produtos/` (recriada) | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/tubos-de-aco-carbono/ | Página de produto | `/tubos-de-aco-carbono/` (mesma URL) | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/conexoes-e-flanges/ | Página de produto | `/conexoes-e-flanges/` (mesma URL) | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/eletrodutos/ | Página de produto | `/eletrodutos/` (mesma URL) | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/barras-e-perfis/ | Página de produto | `/barras-e-perfis/` (mesma URL) | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/tubos-pead/ | Página de produto | `/tubos-pead/` (mesma URL) | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/contato/ | Contato | `/contato/` (recriada) | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/blog/ | Índice do blog | `/blog/` (recriada) | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/landing-1/ | Rascunho com lorem ipsum e depoimentos falsos | descartar — redirect 410 (Gone) | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/nova-home/ | Cópia duplicada da home | descartar — redirect 301 para `/` | pendente: rodar scripts/backup-site-antigo.sh |

## Posts do blog (5)

| URL | O que é | Destino no novo site | Status de backup |
|---|---|---|---|
| https://www.mcprodutos.com.br/guia-completo-sobre-tubos-de-aco-carbono/ | Post (30/01/2025) | `/guia-completo-sobre-tubos-de-aco-carbono/` (mesma URL, reescrito) | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/conexoes-e-flanges-de-aco-carbono-saiba-como-escolher-o-melhor-produto/ | Post (05/02/2025) | mesma URL (reescrito) | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/entenda-a-importancia-do-aco-carbono-na-industria-moderna/ | Post (05/02/2025) | mesma URL (reescrito) | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/barras-e-perfis-de-aco-aplicacoes-e-beneficios-na-industria/ | Post (05/02/2025) | mesma URL (reescrito) | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/como-escolher-eletrodutos-em-aco-galvanizado-para-sua-instalacao/ | Post (05/02/2025) | mesma URL (reescrito) | pendente: rodar scripts/backup-site-antigo.sh |

## PDFs

| URL | O que é | Destino no novo site | Status de backup |
|---|---|---|---|
| https://www.mcprodutos.com.br/wp-content/uploads/2025/11/MC-Catalogo-2026-web.pdf | Catálogo 2026 (27 páginas, 18 MB) | redirect 301 para `/#catalogo` (agora com captura de lead) | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/wp-content/uploads/2025/12/DEX-CERTIFICADO-MC-COMERCIO.pdf | Certificado ISO 9001:2015 | copiar para `/assets/docs/DEX-CERTIFICADO-MC-COMERCIO.pdf` + redirect 301 | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/wp-content/uploads/2025/11/DEX-CERTIFICADO-MC-COMERCIO.pdf | Cópia duplicada do certificado | redirect 301 para `/assets/docs/DEX-CERTIFICADO-MC-COMERCIO.pdf` | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/wp-content/uploads/2025/11/Politica-da-Qualidade-e-Objetivos-MC-2024.pdf | Política da Qualidade | copiar para `/assets/docs/Politica-da-Qualidade-e-Objetivos-MC-2024.pdf` + redirect 301 | pendente: rodar scripts/backup-site-antigo.sh |

## Sitemaps, robots e API do WordPress

| URL | O que é | Destino no novo site | Status de backup |
|---|---|---|---|
| https://www.mcprodutos.com.br/sitemap_index.xml | Sitemap do Yoast (traz rascunhos indevidos) | redirect 301 para `/sitemap.xml` (novo, limpo) | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/robots.txt | robots.txt antigo | substituído pelo novo `/robots.txt` | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/wp-json/wp/v2/pages?per_page=100 | API de páginas (conteúdo bruto para conferência) | descartar após backup (fonte de conteúdo, não fica no ar) | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/wp-json/wp/v2/posts?per_page=100 | API de posts (conteúdo bruto para conferência) | descartar após backup | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/wp-json/wp/v2/media?per_page=100 | API de mídia (lista de imagens/arquivos) | descartar após backup; mídia relevante pode ser reaproveitada como referência de fotos reais | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/2023/03/20/kfdshield™-ll-Y8g3VBhG/ | URL de spam indexada (sinal de invasão antiga) | descartar — bloquear com 410 (Gone) e remover do Search Console | pendente: rodar scripts/backup-site-antigo.sh |
| https://www.mcprodutos.com.br/wp-admin/ , /wp-login.php | Painel WordPress | descartar — 404/410 no novo site (não existe mais WordPress) | não aplicável (não é conteúdo a preservar) |
| https://www.mcprodutos.com.br/author/coneki/ | Página de autor exposta | descartar — redirect 301 para `/` | não aplicável (não é conteúdo a preservar) |
| https://www.mcprodutos.com.br/category/* | Páginas de categoria do blog | descartar — redirect 301 para `/blog/` | não aplicável (não é conteúdo a preservar) |
| https://www.mcprodutos.com.br/feed/ | Feed RSS | descartar — redirect 301 para `/blog/` | não aplicável (não é conteúdo a preservar) |

## Redes sociais e presença externa (referência, não hospedadas pela MC)

| URL | O que é | Destino no novo site | Status de backup |
|---|---|---|---|
| https://www.instagram.com/mc.siderurgicos/ | Perfil Instagram oficial | manter link no header/footer/redes sociais | não aplicável — permanece no Instagram, apenas referenciado |
| https://www.instagram.com/p/DJpe2eBuqba/ | Post do Instagram identificado na pesquisa | referência de conteúdo (fotos reais/feiras), não migrado | não aplicável |
| https://www.instagram.com/mc.siderurgicos/reel/DMI6VUUuJE9/ | Reel do Instagram identificado na pesquisa | referência de conteúdo, não migrado | não aplicável |
| https://www.linkedin.com/company/mc-produtos-sider%C3%BArgicos/ | Página LinkedIn da empresa | manter link no footer | não aplicável |
| https://br.linkedin.com/in/dailsonsatilojunior | Perfil pessoal de colaborador (achado em busca) | não usar no site (dado pessoal, fora do escopo) | não aplicável |
| 3 páginas do Facebook (IDs 61578822683817, 61578700589414, 61578255314965) | Páginas duplicadas, sem uso | recomendação: cliente unificar em 1 página; nenhuma linkada no novo site por ora | não aplicável |
| https://www.google.com/maps/search/MC+Produtos+Sider%C3%BArgicos+Aruj%C3%A1 | Perfil da Empresa no Google (Maps) | manter link de avaliações na home (`/#prova-title`) | não aplicável — permanece no Google |
| https://adstransparency.google.com/?region=BR&domain=mcprodutos.com.br | Central de Transparência de Anúncios do Google | referência apenas (diagnóstico de mídia paga) | não aplicável |
| https://linktr.ee/mcprodutos | Linktree do Instagram | referência apenas; recomenda-se apontar para o novo site diretamente | não aplicável |
| https://www.econodata.com.br/consulta-empresa/10534283000105-m-c-comercio-de-produtos-siderurgicos-ltda | Cadastro público (Econodata) | referência de dados cadastrais (CNPJ, porte) | não aplicável |
| https://ajuda.rdstation.com/s/article/Integra%C3%A7%C3%A3o-de-Formul%C3%A1rios-via-C%C3%B3digo-de-Monitoramento | Ajuda RD Station — integração de formulários | referência técnica para configurar RD no novo site | não aplicável |
| https://wordpress.org/plugins/integracao-rd-station/ | Plugin oficial RD Station para WordPress | não aplicável ao novo site (sem WordPress) | não aplicável |

## Observações finais

- Todas as URLs de página e de post preservam a mesma estrutura (`/slug/`) no novo site, para não perder posicionamento no Google.
- `/landing-1/` e `/nova-home/` eram rascunhos publicados por engano no site antigo (conteúdo genérico/lorem ipsum e cópia duplicada da home) — não têm valor de conteúdo a preservar, por isso o backup serve apenas como registro histórico, não como fonte para o novo site.
- A URL de spam `/2023/03/20/kfdshield™-ll-Y8g3VBhG/` é sinal de uma possível invasão antiga; deve ser removida do Search Console do domínio assim que o time tiver acesso ao painel do Google.
- Depois que o backup for executado com sucesso a partir de um ambiente com acesso à internet, marque cada linha "pendente" como "feito em AAAA-MM-DD" e informe o caminho do `.tar.gz` gerado.

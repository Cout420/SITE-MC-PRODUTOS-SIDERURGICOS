#!/usr/bin/env bash
# Backup do site antigo (WordPress) mcprodutos.com.br antes de sair do ar.
# Uso: bash scripts/backup-site-antigo.sh
# Funciona em Linux, macOS e WSL. Requer: wget, curl, sha256sum (ou shasum), tar.
# jq é usado se disponível para extrair source_url da API de mídia; senão cai em python3.

set -euo pipefail

SITE="https://www.mcprodutos.com.br"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
DATE_DIR="$(date +%Y-%m-%d)"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
OUT_DIR="$PROJECT_ROOT/backup-site-antigo/$DATE_DIR"
MIRROR_DIR="$OUT_DIR/mirror"
RAW_DIR="$OUT_DIR/raw"
DOCS_DIR="$PROJECT_ROOT/assets/docs"

mkdir -p "$MIRROR_DIR" "$RAW_DIR" "$DOCS_DIR"

log() { printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*"; }

sha256_of() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | awk '{print $1}'
  else
    shasum -a 256 "$1" | awk '{print $1}'
  fi
}

# ---------------------------------------------------------------------------
# (a) wget --mirror do site inteiro
# ---------------------------------------------------------------------------
log "Iniciando espelhamento completo (wget --mirror) de $SITE ..."
wget \
  --mirror \
  --page-requisites \
  --convert-links \
  --adjust-extension \
  --no-parent \
  --wait=1 \
  --random-wait \
  --user-agent="$UA" \
  --directory-prefix="$MIRROR_DIR" \
  --no-check-certificate \
  "$SITE/" || log "AVISO: wget terminou com erros (site antigo pode estar bloqueado ou instável). Continuando com downloads explícitos."

# ---------------------------------------------------------------------------
# (b) curl explícito de cada URL do inventário
# ---------------------------------------------------------------------------
log "Baixando URLs explícitas do inventário (páginas, posts, PDFs, sitemaps, robots, wp-json) ..."

PAGES=(
  "/"
  "/sobre-nos/"
  "/produtos/"
  "/tubos-de-aco-carbono/"
  "/conexoes-e-flanges/"
  "/eletrodutos/"
  "/barras-e-perfis/"
  "/tubos-pead/"
  "/contato/"
  "/blog/"
  "/landing-1/"
  "/nova-home/"
)

POSTS=(
  "/guia-completo-sobre-tubos-de-aco-carbono/"
  "/conexoes-e-flanges-de-aco-carbono-saiba-como-escolher-o-melhor-produto/"
  "/entenda-a-importancia-do-aco-carbono-na-industria-moderna/"
  "/barras-e-perfis-de-aco-aplicacoes-e-beneficios-na-industria/"
  "/como-escolher-eletrodutos-em-aco-galvanizado-para-sua-instalacao/"
)

PDFS=(
  "/wp-content/uploads/2025/11/MC-Catalogo-2026-web.pdf"
  "/wp-content/uploads/2025/11/DEX-CERTIFICADO-MC-COMERCIO.pdf"
  "/wp-content/uploads/2025/12/DEX-CERTIFICADO-MC-COMERCIO.pdf"
  "/wp-content/uploads/2025/11/Politica-da-Qualidade-e-Objetivos-MC-2024.pdf"
)

SITEMAPS=(
  "/sitemap_index.xml"
  "/page-sitemap.xml"
  "/post-sitemap.xml"
  "/category-sitemap.xml"
)

MISC=(
  "/robots.txt"
  "/wp-json/wp/v2/pages?per_page=100"
  "/wp-json/wp/v2/posts?per_page=100"
  "/wp-json/wp/v2/media?per_page=100"
)

fetch() {
  local url_path="$1"
  local dest="$RAW_DIR${url_path}"
  # Se termina em "/", salva como index.html dentro da pasta
  if [[ "$url_path" == */ || "$url_path" != *.* ]]; then
    dest="${dest%/}/index.html"
  fi
  mkdir -p "$(dirname "$dest")"
  log "  curl: $SITE$url_path"
  curl -sS -L --fail --user-agent "$UA" --output "$dest" "$SITE$url_path" \
    || log "  AVISO: falhou ao baixar $SITE$url_path (site antigo pode estar inacessível deste ambiente)"
}

for p in "${PAGES[@]}" "${POSTS[@]}" "${SITEMAPS[@]}" "${MISC[@]}"; do
  fetch "$p"
done

for pdf in "${PDFS[@]}"; do
  fetch "$pdf"
done

# ---------------------------------------------------------------------------
# Sitemaps filhos referenciados pelo sitemap_index.xml (se ele baixou)
# ---------------------------------------------------------------------------
IDX_FILE="$RAW_DIR/sitemap_index.xml"
if [[ -f "$IDX_FILE" ]]; then
  log "Extraindo sitemaps filhos de sitemap_index.xml ..."
  grep -oE '<loc>[^<]+</loc>' "$IDX_FILE" 2>/dev/null | sed -E 's#</?loc>##g' | while read -r child_url; do
    child_path="${child_url#$SITE}"
    [[ "$child_path" == "$child_url" ]] && continue # não é do mesmo domínio
    fetch "$child_path"
  done
fi

# ---------------------------------------------------------------------------
# Mídia: baixar cada source_url listado no JSON de /wp-json/wp/v2/media
# ---------------------------------------------------------------------------
MEDIA_JSON="$RAW_DIR/wp-json/wp/v2/media"
# fetch() salvou "media?per_page=100" como index.html dentro de uma pasta; localizar o arquivo real
MEDIA_JSON_FILE=$(find "$RAW_DIR/wp-json/wp/v2" -maxdepth 1 -iname 'media*' -type f 2>/dev/null | head -n1 || true)

if [[ -n "${MEDIA_JSON_FILE:-}" && -s "$MEDIA_JSON_FILE" ]]; then
  log "Baixando arquivos de mídia listados em $MEDIA_JSON_FILE ..."
  MEDIA_OUT_DIR="$RAW_DIR/media"
  mkdir -p "$MEDIA_OUT_DIR"

  if command -v jq >/dev/null 2>&1; then
    jq -r '.[].source_url // empty' "$MEDIA_JSON_FILE" 2>/dev/null > "$OUT_DIR/.media_urls.txt" || true
  elif command -v python3 >/dev/null 2>&1; then
    python3 - "$MEDIA_JSON_FILE" > "$OUT_DIR/.media_urls.txt" <<'PYEOF'
import json, sys
try:
    with open(sys.argv[1], encoding="utf-8") as f:
        data = json.load(f)
    for item in data:
        url = item.get("source_url")
        if url:
            print(url)
except Exception:
    pass
PYEOF
  fi

  if [[ -f "$OUT_DIR/.media_urls.txt" ]]; then
    while read -r media_url; do
      [[ -z "$media_url" ]] && continue
      fname=$(basename "${media_url%%\?*}")
      log "  mídia: $media_url"
      curl -sS -L --fail --user-agent "$UA" --output "$MEDIA_OUT_DIR/$fname" "$media_url" \
        || log "  AVISO: falhou ao baixar mídia $media_url"
    done < "$OUT_DIR/.media_urls.txt"
    rm -f "$OUT_DIR/.media_urls.txt"
  fi
else
  log "AVISO: lista de mídia (wp-json/wp/v2/media) não encontrada ou vazia — pulando download de mídia."
fi

# ---------------------------------------------------------------------------
# (c) Copiar os 3 PDFs para assets/docs/ com os nomes esperados pelo novo site
# ---------------------------------------------------------------------------
log "Copiando PDFs para $DOCS_DIR ..."

copy_first_existing() {
  local dest_name="$1"; shift
  local candidate
  for candidate in "$@"; do
    if [[ -s "$candidate" ]]; then
      cp "$candidate" "$DOCS_DIR/$dest_name"
      log "  copiado: $candidate -> $DOCS_DIR/$dest_name"
      return 0
    fi
  done
  log "  AVISO: nenhum arquivo de origem encontrado para $dest_name"
  return 1
}

copy_first_existing "MC-Catalogo-2026-web.pdf" \
  "$RAW_DIR/wp-content/uploads/2025/11/MC-Catalogo-2026-web.pdf"

copy_first_existing "DEX-CERTIFICADO-MC-COMERCIO.pdf" \
  "$RAW_DIR/wp-content/uploads/2025/12/DEX-CERTIFICADO-MC-COMERCIO.pdf" \
  "$RAW_DIR/wp-content/uploads/2025/11/DEX-CERTIFICADO-MC-COMERCIO.pdf"

copy_first_existing "Politica-da-Qualidade-e-Objetivos-MC-2024.pdf" \
  "$RAW_DIR/wp-content/uploads/2025/11/Politica-da-Qualidade-e-Objetivos-MC-2024.pdf"

# ---------------------------------------------------------------------------
# (d) Manifesto (lista de arquivos + sha256) e .tar.gz
# ---------------------------------------------------------------------------
MANIFEST="$OUT_DIR/MANIFESTO.txt"
log "Gerando manifesto em $MANIFEST ..."
{
  echo "Manifesto de backup — mcprodutos.com.br"
  echo "Gerado em: $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
  echo "Diretório: $OUT_DIR"
  echo ""
  echo "sha256                                                          arquivo"
} > "$MANIFEST"

find "$OUT_DIR" -type f ! -name "MANIFESTO.txt" | sort | while read -r f; do
  printf '%s  %s\n' "$(sha256_of "$f")" "${f#$OUT_DIR/}" >> "$MANIFEST"
done

TARBALL="$PROJECT_ROOT/backup-site-antigo/mcprodutos-backup-$DATE_DIR.tar.gz"
log "Compactando backup em $TARBALL ..."
tar -czf "$TARBALL" -C "$PROJECT_ROOT/backup-site-antigo" "$DATE_DIR"

log "Backup concluído."
log "Pasta: $OUT_DIR"
log "Tarball: $TARBALL"
log "Manifesto: $MANIFEST"

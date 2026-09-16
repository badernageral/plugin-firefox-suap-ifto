#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
set -a
source .env.github
set +a

REPO="badernageral/plugin-firefox-suap-ifto"
TAG="v1.4.2"
XPI="web-ext-artifacts/suap_ifto.xpi"

echo "Criando release ${TAG}..."
RESPONSE=$(curl -s -X POST \
	-H "Authorization: Bearer ${GITHUB_TOKEN}" \
	-H "Accept: application/vnd.github+json" \
	"https://api.github.com/repos/${REPO}/releases" \
	-d @- <<EOF
{
  "tag_name": "${TAG}",
  "target_commitish": "main",
  "name": "${TAG}",
  "body": "Extensão SUAP IFTO ${TAG} — assinada pela Mozilla (AMO, self-distribution).\n\n- Import de CSV em Notas e Presença\n- Popups de Conteúdo e Plano de ensino removidos\n\nInstalação: baixe o suap_ifto.xpi abaixo e abra no Firefox.",
  "draft": false,
  "prerelease": false
}
EOF
)

UPLOAD_URL=$(echo "$RESPONSE" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const j=JSON.parse(d);if(j.upload_url){console.log(j.upload_url.split('{')[0]);}else{console.error(d);process.exit(1);}})")

echo "Release criado. Fazendo upload do xpi..."
curl -s -X POST \
	-H "Authorization: Bearer ${GITHUB_TOKEN}" \
	-H "Content-Type: application/x-xpinstall" \
	--data-binary "@${XPI}" \
	"${UPLOAD_URL}?name=suap_ifto.xpi" \
	| node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const j=JSON.parse(d);console.log(j.browser_download_url || d);})"

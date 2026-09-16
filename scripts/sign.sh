#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env.amo ]; then
	echo "Crie um arquivo .env.amo com WEB_EXT_API_KEY e WEB_EXT_API_SECRET (veja README.md)." >&2
	exit 1
fi

set -a
source .env.amo
set +a

if [ -z "${WEB_EXT_API_SECRET:-}" ]; then
	echo "WEB_EXT_API_SECRET está vazio em .env.amo." >&2
	exit 1
fi

node node_modules/web-ext/bin/web-ext sign --channel=unlisted

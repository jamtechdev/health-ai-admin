#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

API_DOMAIN="${API_DOMAIN:-api.34.199.84.247.nip.io}"

cd "$PROJECT_DIR"

cat > .env.production <<EOF
NEXT_PUBLIC_API_URL=https://${API_DOMAIN}/api/v1
NEXT_PUBLIC_API_BASE_URL=https://${API_DOMAIN}
NEXT_PUBLIC_APP_NAME=TovaPulse
EOF

docker compose up -d --build
docker compose ps

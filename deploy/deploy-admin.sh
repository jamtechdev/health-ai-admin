#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

API_DOMAIN="${API_DOMAIN:-api.tovapulse.com}"

cd "$PROJECT_DIR"

export DOCKER_BUILDKIT=1
export COMPOSE_BAKE=false

cat > .env.production <<EOF
NEXT_PUBLIC_API_URL=https://${API_DOMAIN}/api/v1
NEXT_PUBLIC_API_BASE_URL=https://${API_DOMAIN}
NEXT_PUBLIC_APP_NAME=TovaPulse
EOF

docker compose build admin
docker compose up -d --no-build
docker compose ps

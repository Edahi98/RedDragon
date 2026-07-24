#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

if ! command -v uv >/dev/null 2>&1; then
  echo "uv no está instalado. Instalando..."
  curl -LsSf https://astral.sh/uv/install.sh | sh
  export PATH="$HOME/.local/bin:$PATH"
fi

echo "Instalando dependencias de Python (uv sync)..."
uv sync --locked

if [ -d "frontend" ]; then
  if ! command -v npm >/dev/null 2>&1; then
    echo "npm no está instalado; se omite el build del frontend."
  else
    echo "Instalando dependencias del frontend..."
    (cd frontend && npm install)

    echo "Compilando frontend (npm run build)..."
    (cd frontend && npm run build)
  fi
fi

echo "Dando permisos de ejecución a los binarios de resources/..."
chmod +x resources/xmljava-docker resources/tsubasa 2>/dev/null || true

export REDDRAGON_HOST="${REDDRAGON_HOST:-0.0.0.0}"
export REDDRAGON_PORT="${REDDRAGON_PORT:-8000}"
export TSUBASA_HOST="${TSUBASA_HOST:-127.0.0.1}"
export TSUBASA_PORT="${TSUBASA_PORT:-5000}"

echo "Iniciando RedDragon en ${REDDRAGON_HOST}:${REDDRAGON_PORT} (tsubasa en ${TSUBASA_HOST}:${TSUBASA_PORT})..."
exec uv run main.py

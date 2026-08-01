#!/bin/sh
# Runtime entrypoint: prepare the persistent disk, sync the DB schema, seed
# base content, then start Next.js. Safe to run on every boot (idempotent).
set -e

# Ensure the uploads directory on the persistent disk exists.
if [ -n "$UPLOADS_DIR" ]; then
  mkdir -p "$UPLOADS_DIR"
fi

echo "→ Syncing database schema (prisma db push)…"
npx prisma db push --skip-generate

echo "→ Seeding base content (idempotent upserts)…"
npm run seed || echo "⚠ seed step skipped/failed — continuing"

echo "→ Starting Next.js on port ${PORT:-3000}…"
exec node_modules/.bin/next start -p "${PORT:-3000}"

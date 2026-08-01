# ── Bin Norouk Museum — production image (Railway / Render / any Docker host) ──
FROM node:20-slim

# Prisma needs openssl at runtime
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install all deps (dev deps are needed to build and to run the TS seed script)
COPY package*.json ./
RUN npm ci

COPY . .

# Generate the Prisma client and build against a throwaway DB so that any
# static evaluation during `next build` never needs the real database.
ENV DATABASE_URL="file:/tmp/build.db"
RUN npx prisma generate
RUN npx prisma db push --skip-generate --accept-data-loss || true
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["sh", "scripts/start.sh"]

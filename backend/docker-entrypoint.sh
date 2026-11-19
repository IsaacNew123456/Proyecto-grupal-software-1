#!/bin/sh
set -e

echo "📦 Sincronizando esquema de base de datos PostgreSQL con Prisma..."
npx prisma db push --skip-generate || echo "⚠️ Advertencia al sincronizar esquema"

echo "🌱 Verificando y aplicando datos iniciales (Seed)..."
node prisma/seed.js || echo "⚠️ Advertencia al aplicar seed"

echo "🚀 Iniciando servidor ErgoCheck AI..."
exec dumb-init -- node dist/main.js

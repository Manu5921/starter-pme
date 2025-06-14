#!/bin/bash

# 🔧 Configuration Automatique Variables Vercel
echo "🔧 Configuration des variables d'environnement Vercel..."

# Variables depuis .env.production
DATABASE_URL="postgresql://neondb_owner:npg_L8GXicIja2wU@ep-still-dream-a9mxd03t-pooler.gwc.azure.neon.tech/neondb?sslmode=require"
BETTER_AUTH_SECRET="1b5BqJPc/p0pCViR2zhte4D1jEak6q74ukrc7ZR00qo="
BETTER_AUTH_URL="https://website-builder-platform.vercel.app"
NODE_ENV="production"
NEXT_PUBLIC_APP_ENV="production"
NEXT_PUBLIC_STARTER_TIER="pro"
NEXT_PUBLIC_STARTER_SLUG="website-builder-platform"
POLAR_WEBHOOK_SECRET="polar_webhook_secret_dummy_for_build"

echo "📝 Configuration variable 1/8 : DATABASE_URL"
echo "$DATABASE_URL" | vercel env add DATABASE_URL production

echo "📝 Configuration variable 2/8 : BETTER_AUTH_SECRET"
echo "$BETTER_AUTH_SECRET" | vercel env add BETTER_AUTH_SECRET production

echo "📝 Configuration variable 3/8 : BETTER_AUTH_URL"
echo "$BETTER_AUTH_URL" | vercel env add BETTER_AUTH_URL production

echo "📝 Configuration variable 4/8 : NODE_ENV"
echo "$NODE_ENV" | vercel env add NODE_ENV production

echo "📝 Configuration variable 5/8 : NEXT_PUBLIC_APP_ENV"
echo "$NEXT_PUBLIC_APP_ENV" | vercel env add NEXT_PUBLIC_APP_ENV production

echo "📝 Configuration variable 6/8 : NEXT_PUBLIC_STARTER_TIER"
echo "$NEXT_PUBLIC_STARTER_TIER" | vercel env add NEXT_PUBLIC_STARTER_TIER production

echo "📝 Configuration variable 7/8 : NEXT_PUBLIC_STARTER_SLUG"
echo "$NEXT_PUBLIC_STARTER_SLUG" | vercel env add NEXT_PUBLIC_STARTER_SLUG production

echo "📝 Configuration variable 8/8 : POLAR_WEBHOOK_SECRET"
echo "$POLAR_WEBHOOK_SECRET" | vercel env add POLAR_WEBHOOK_SECRET production

echo ""
echo "✅ Toutes les variables configurées !"
echo "🚀 Lancement du déploiement..."

vercel --prod
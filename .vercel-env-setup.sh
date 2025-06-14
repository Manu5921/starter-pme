#!/bin/bash

# 🔧 Configuration automatique des variables Vercel
echo "🔧 Configuration variables Vercel..."

# Variables d'environnement
DATABASE_URL="postgresql://neondb_owner:npg_L8GXicIja2wU@ep-still-dream-a9mxd03t-pooler.gwc.azure.neon.tech/neondb?sslmode=require"
BETTER_AUTH_SECRET="1b5BqJPc/p0pCViR2zhte4D1jEak6q74ukrc7ZR00qo="
BETTER_AUTH_URL="https://website-builder-platform.vercel.app"
NODE_ENV="production"
NEXT_PUBLIC_APP_ENV="production"
NEXT_PUBLIC_STARTER_TIER="pro"
NEXT_PUBLIC_STARTER_SLUG="website-builder-platform"
POLAR_WEBHOOK_SECRET="polar_webhook_secret_dummy_for_build"

echo "📝 Configuration des variables sur Vercel..."

# Configuration via CLI (méthode interactive évitée)
echo "⚠️  Configuration manuelle requise sur Vercel Dashboard"
echo "🌐 https://vercel.com/dashboard → website-builder-platform → Settings → Environment Variables"

echo ""
echo "Variables à copier-coller :"
echo "========================="
echo "DATABASE_URL=$DATABASE_URL"
echo "BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET"
echo "BETTER_AUTH_URL=$BETTER_AUTH_URL"
echo "NODE_ENV=$NODE_ENV"
echo "NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV"
echo "NEXT_PUBLIC_STARTER_TIER=$NEXT_PUBLIC_STARTER_TIER"
echo "NEXT_PUBLIC_STARTER_SLUG=$NEXT_PUBLIC_STARTER_SLUG"
echo "POLAR_WEBHOOK_SECRET=$POLAR_WEBHOOK_SECRET"
echo ""
echo "🚀 Après configuration, relancer : vercel --prod"
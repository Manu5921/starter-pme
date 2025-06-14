#!/usr/bin/env tsx

/**
 * 🔧 Configuration Variables Vercel
 * Website Builder Platform
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔧 CONFIGURATION VARIABLES VERCEL');
console.log('=================================\n');

// Lire le fichier .env.production
const envPath = path.join(process.cwd(), '.env.production');
if (!fs.existsSync(envPath)) {
  console.error('❌ Fichier .env.production non trouvé');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = envContent
  .split('\n')
  .filter(line => line.includes('=') && !line.startsWith('#'))
  .map(line => {
    const [key, ...values] = line.split('=');
    return { 
      key: key.trim(), 
      value: values.join('=').replace(/"/g, '').trim()
    };
  })
  .filter(({ key, value }) => key && value);

console.log(`📋 Variables détectées : ${envVars.length}`);

// Configuration manuelle recommandée
console.log('\n🎯 CONFIGURATION VERCEL DASHBOARD');
console.log('================================');
console.log('\n1. 🌐 Aller sur : https://vercel.com/dashboard');
console.log('2. 📁 Sélectionner : website-builder-platform');
console.log('3. ⚙️  Aller dans : Settings → Environment Variables');
console.log('4. ➕ Ajouter ces variables :');
console.log('');

envVars.forEach(({ key, value }) => {
  const displayValue = key.includes('SECRET') || key.includes('PASSWORD') 
    ? `${value.substring(0, 12)}...` 
    : value.substring(0, 50) + (value.length > 50 ? '...' : '');
  
  console.log(`📝 ${key}`);
  console.log(`   Valeur : ${displayValue}`);
  console.log(`   Scope : Production`);
  console.log('');
});

console.log('🔧 VALEURS COMPLÈTES POUR COPIER-COLLER :');
console.log('=========================================');
console.log('');

envVars.forEach(({ key, value }) => {
  console.log(`${key}=${value}`);
});

console.log('');
console.log('5. 💾 Sauvegarder les variables');
console.log('6. 🚀 Redéployer : vercel --prod');
console.log('');

console.log('⚡ DÉPLOIEMENT RAPIDE ALTERNATIF :');
console.log('=================================');
console.log('');
console.log('Si tu préfères, push le code sur GitHub et :');
console.log('1. 🌐 Va sur https://vercel.com/new');
console.log('2. 📁 Import depuis GitHub : website-builder-platform');
console.log('3. ⚙️  Configure les variables d\'environnement');
console.log('4. 🚀 Deploy automatique');
console.log('');

console.log('🎯 URL attendue après déploiement :');
console.log('https://website-builder-platform.vercel.app');
console.log('');
console.log('✅ Tests post-déploiement :');
console.log('• / → Page d\'accueil');
console.log('• /demo → Template plombier');  
console.log('• /dashboard → Interface admin');
console.log('• /sign-up → Création compte');
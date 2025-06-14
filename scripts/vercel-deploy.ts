#!/usr/bin/env tsx

/**
 * 🚀 Script de Déploiement Vercel
 * Website Builder Platform
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 DÉPLOIEMENT VERCEL - Website Builder Platform');
console.log('===============================================\n');

// Vérifier que nous sommes dans le bon répertoire
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json non trouvé. Êtes-vous dans le bon répertoire ?');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
console.log(`📦 Déploiement de : ${packageJson.name} v${packageJson.version}`);

// Vérifier que .env.production existe
const envProdPath = path.join(process.cwd(), '.env.production');
if (!fs.existsSync(envProdPath)) {
  console.error('❌ Fichier .env.production non trouvé');
  console.log('💡 Créer le fichier avec les variables nécessaires');
  process.exit(1);
}

console.log('✅ Configuration production trouvée');

// Lire les variables d'environnement
const envContent = fs.readFileSync(envProdPath, 'utf8');
const envVars = envContent
  .split('\n')
  .filter(line => line.includes('=') && !line.startsWith('#'))
  .map(line => {
    const [key, ...values] = line.split('=');
    return { key: key.trim(), value: values.join('=').replace(/"/g, '') };
  });

console.log(`📋 Variables d'environnement détectées : ${envVars.length}`);

// Instructions pour l'utilisateur
console.log('\n🎯 INSTRUCTIONS DE DÉPLOIEMENT');
console.log('==============================');
console.log('');
console.log('1. 🔐 CONNEXION VERCEL :');
console.log('   → Exécuter : vercel login');
console.log('   → Choisir "Continue with GitHub"');
console.log('   → Autoriser dans le navigateur');
console.log('');
console.log('2. 🚀 DÉPLOIEMENT :');
console.log('   → Exécuter : vercel --prod');
console.log('   → Confirmer le nom du projet');
console.log('   → Les variables seront configurées automatiquement');
console.log('');
console.log('3. ⚙️  VARIABLES POUR VERCEL DASHBOARD :');
console.log('   (Si configuration manuelle nécessaire)');
console.log('');

envVars.forEach(({ key, value }) => {
  if (key && value) {
    // Masquer les valeurs sensibles
    const displayValue = key.includes('SECRET') || key.includes('PASSWORD') || key.includes('TOKEN') 
      ? value.substring(0, 8) + '...' 
      : value;
    console.log(`   ${key} = ${displayValue}`);
  }
});

console.log('');
console.log('4. 🌐 APRÈS DÉPLOIEMENT :');
console.log('   → Récupérer l\'URL de production');
console.log('   → Mettre à jour BETTER_AUTH_URL dans Vercel dashboard');
console.log('   → Tester : https://ton-site.vercel.app/demo');
console.log('');

// Vérification build local
console.log('🧪 Test de build local...');
try {
  console.log('   → npm run build...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('   ✅ Build réussi');
} catch (error) {
  console.error('   ❌ Échec du build local');
  console.error('   💡 Résoudre les erreurs avant déploiement');
  process.exit(1);
}

console.log('');
console.log('🎉 PRÊT POUR LE DÉPLOIEMENT !');
console.log('');
console.log('▶️  Prochaines commandes :');
console.log('   vercel login');
console.log('   vercel --prod');
console.log('');
console.log('📊 Métriques attendues après déploiement :');
console.log('   • Page load : < 3 secondes');
console.log('   • SEO score : > 90/100');
console.log('   • Performance : > 85/100');
console.log('');
console.log('🔗 URLs à tester :');
console.log('   • / (page d\'accueil)');
console.log('   • /demo (template plombier)');
console.log('   • /dashboard (admin)');
console.log('   • /sign-up (inscription)');
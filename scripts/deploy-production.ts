#!/usr/bin/env tsx

/**
 * 🚀 Script de Déploiement Production
 * Website Builder Platform
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 DÉPLOIEMENT PRODUCTION - Website Builder Platform');
console.log('====================================================\n');

// Vérifications préalables
console.log('🔍 Vérifications préalables...');

// 1. Vérifier que nous sommes bien sur la branche principale
try {
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  if (currentBranch !== 'main' && currentBranch !== 'master') {
    console.warn(`⚠️  Attention : Vous êtes sur la branche "${currentBranch}". Recommandé : main/master`);
  } else {
    console.log(`✅ Branche actuelle : ${currentBranch}`);
  }
} catch (error) {
  console.error('❌ Erreur lors de la vérification de la branche Git');
}

// 2. Vérifier les variables d'environnement production
const envProdPath = path.join(process.cwd(), '.env.production');
if (!fs.existsSync(envProdPath)) {
  console.log('⚠️  Fichier .env.production non trouvé');
  console.log('📋 Étapes pour configurer la production :');
  console.log('   1. Copier .env.production.template vers .env.production');
  console.log('   2. Remplir les variables (DATABASE_URL, BETTER_AUTH_SECRET, etc.)');
  console.log('   3. Relancer ce script');
  process.exit(1);
}

console.log('✅ Fichier .env.production trouvé');

// 3. Vérifier Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 20) {
  console.error(`❌ Node.js ${nodeVersion} trop ancien. Minimum requis: v20.0.0`);
  console.log('💡 Solution : nvm use 24 && npm install');
  process.exit(1);
}

console.log(`✅ Node.js ${nodeVersion} (compatible)`);

// 4. Tests avant déploiement
console.log('\n🧪 Tests avant déploiement...');

try {
  console.log('   → Test de build...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('   ✅ Build réussi');
} catch (error) {
  console.error('   ❌ Échec du build');
  console.error('   💡 Résoudre les erreurs de build avant déploiement');
  process.exit(1);
}

try {
  console.log('   → Tests finaux...');
  execSync('npm run test:final', { stdio: 'pipe' });
  console.log('   ✅ Tests réussis');
} catch (error) {
  console.warn('   ⚠️  Tests échoués - déploiement possible mais risqué');
}

// 5. Informations de déploiement
console.log('\n📊 Informations de déploiement');
console.log('================================');

const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
console.log(`📦 Projet : ${packageJson.name} v${packageJson.version}`);

// Compter les fichiers principaux
const appDir = path.join(process.cwd(), 'app');
const componentsDir = path.join(process.cwd(), 'components');
const appFiles = fs.existsSync(appDir) ? fs.readdirSync(appDir, { recursive: true }).length : 0;
const componentFiles = fs.existsSync(componentsDir) ? fs.readdirSync(componentsDir, { recursive: true }).length : 0;

console.log(`📁 Fichiers app/ : ${appFiles}`);
console.log(`🧩 Composants : ${componentFiles}`);

// 6. Instructions de déploiement
console.log('\n🎯 PROCHAINES ÉTAPES DE DÉPLOIEMENT');
console.log('==================================');
console.log('');
console.log('1. 🗄️  CONFIGURER BASE DE DONNÉES NEON :');
console.log('   → Aller sur https://neon.tech');
console.log('   → Créer un projet "website-builder-prod"');
console.log('   → Copier la DATABASE_URL dans .env.production');
console.log('');
console.log('2. 🔐 GÉNÉRER BETTER_AUTH_SECRET :');
console.log('   → Utiliser : openssl rand -base64 32');
console.log('   → Ou générer en ligne : https://generate-secret.vercel.app/32');
console.log('');
console.log('3. 🚀 DÉPLOYER SUR VERCEL :');
console.log('   → Aller sur https://vercel.com/new');
console.log('   → Importer ce repository GitHub');
console.log('   → Configurer les variables d\'environnement');
console.log('   → Cliquer "Deploy"');
console.log('');
console.log('4. ✅ TESTER EN PRODUCTION :');
console.log('   → https://ton-site.vercel.app/');
console.log('   → https://ton-site.vercel.app/demo');
console.log('   → https://ton-site.vercel.app/dashboard');
console.log('');

console.log('🎉 Prêt pour le déploiement !');
console.log('📋 Suivre le guide : DEPLOYMENT_GUIDE.md');
console.log('');
console.log('💡 Une fois déployé, tester toutes les fonctionnalités');
console.log('📊 Métriques attendues : Page load < 3s, SEO > 90/100');
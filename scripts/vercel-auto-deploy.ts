#!/usr/bin/env tsx

/**
 * 🤖 Déploiement Vercel Automatisé
 * Website Builder Platform
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🤖 DÉPLOIEMENT VERCEL AUTOMATISÉ');
console.log('==============================\n');

interface VercelEnvVar {
  key: string;
  value: string;
  type: 'encrypted' | 'plain';
  target: 'production' | 'preview' | 'development';
}

// Lire les variables d'environnement
function readEnvVariables(): VercelEnvVar[] {
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
      const value = values.join('=').replace(/"/g, '').trim();
      
      return {
        key: key.trim(),
        value,
        type: key.includes('SECRET') || key.includes('TOKEN') ? 'encrypted' : 'plain',
        target: 'production'
      } as VercelEnvVar;
    })
    .filter(({ key, value }) => key && value);

  return envVars;
}

// Vérifier si Vercel CLI est connecté
function checkVercelAuth(): boolean {
  try {
    execSync('vercel whoami', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// Obtenir le Project ID Vercel
function getVercelProjectId(): string | null {
  try {
    const vercelDir = path.join(process.cwd(), '.vercel');
    if (!fs.existsSync(vercelDir)) return null;
    
    const projectJson = path.join(vercelDir, 'project.json');
    if (!fs.existsSync(projectJson)) return null;
    
    const project = JSON.parse(fs.readFileSync(projectJson, 'utf8'));
    return project.projectId;
  } catch {
    return null;
  }
}

// Configuration automatique via API Vercel
async function configureVercelEnvironment(projectId: string, envVars: VercelEnvVar[], token?: string): Promise<boolean> {
  if (!token) {
    console.log('⚠️  Token Vercel non fourni - configuration manuelle requise');
    return false;
  }

  console.log('🔧 Configuration automatique des variables...');
  
  try {
    for (const envVar of envVars) {
      const curlCommand = `curl -X POST "https://api.vercel.com/v1/projects/${projectId}/env" \
        -H "Authorization: Bearer ${token}" \
        -H "Content-Type: application/json" \
        -d '{"key":"${envVar.key}","value":"${envVar.value}","type":"${envVar.type}","target":["${envVar.target}"]}'`;
      
      execSync(curlCommand, { stdio: 'pipe' });
      console.log(`   ✅ ${envVar.key} configuré`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur configuration automatique:', error);
    return false;
  }
}

// Script principal
async function main() {
  // 1. Vérifications préalables
  console.log('🔍 Vérifications préalables...');
  
  if (!checkVercelAuth()) {
    console.error('❌ Non connecté à Vercel');
    console.log('💡 Exécuter : vercel login');
    process.exit(1);
  }
  console.log('✅ Connecté à Vercel');

  // 2. Build local
  console.log('\n🧪 Test build local...');
  try {
    execSync('npm run build', { stdio: 'pipe' });
    console.log('✅ Build local réussi');
  } catch {
    console.error('❌ Build local échoué');
    console.log('💡 Corriger les erreurs avant déploiement');
    process.exit(1);
  }

  // 3. Variables d'environnement
  const envVars = readEnvVariables();
  console.log(`\n📋 Variables détectées : ${envVars.length}`);

  // 4. Configuration Vercel
  const projectId = getVercelProjectId();
  if (!projectId) {
    console.log('⚠️  Project ID non trouvé - première configuration requise');
    console.log('\n📋 CONFIGURATION MANUELLE REQUISE :');
    console.log('==================================');
    console.log('\n1. 🌐 Aller sur : https://vercel.com/new');
    console.log('2. 📁 Import : Repository GitHub');
    console.log('3. ⚙️  Configurer variables d\'environnement :');
    console.log('');
    
    envVars.forEach(({ key, value }) => {
      const displayValue = key.includes('SECRET') ? `${value.substring(0, 12)}...` : value;
      console.log(`   ${key} = ${displayValue}`);
    });
    
    console.log('\n4. 🚀 Deploy');
    return;
  }

  console.log(`✅ Project ID : ${projectId}`);

  // 5. Token Vercel pour automatisation
  const vercelToken = process.env.VERCEL_TOKEN;
  
  if (vercelToken) {
    console.log('\n🤖 Configuration automatique...');
    const success = await configureVercelEnvironment(projectId, envVars, vercelToken);
    
    if (success) {
      console.log('✅ Variables configurées automatiquement');
      
      // Déploiement automatique
      console.log('\n🚀 Déploiement en cours...');
      try {
        const result = execSync('vercel --prod --yes', { encoding: 'utf8' });
        console.log('✅ Déploiement réussi !');
        
        // Extraire l'URL de production
        const urlMatch = result.match(/https:\/\/[^\s]+/);
        if (urlMatch) {
          const productionUrl = urlMatch[0];
          console.log(`\n🌐 URL de production : ${productionUrl}`);
          
          // Tests post-déploiement
          console.log('\n✅ Tests recommandés :');
          console.log(`   • ${productionUrl}/ → Page d'accueil`);
          console.log(`   • ${productionUrl}/demo → Template plombier`);
          console.log(`   • ${productionUrl}/dashboard → Interface admin`);
          console.log(`   • ${productionUrl}/sign-up → Création compte`);
        }
        
        return;
      } catch (error) {
        console.error('❌ Échec du déploiement automatique');
        console.log('💡 Essayer : vercel --prod manuellement');
      }
    }
  }

  // 6. Instructions manuelles si automatisation impossible
  console.log('\n📋 DÉPLOIEMENT MANUEL REQUIS :');
  console.log('=============================');
  console.log('\n1. 🌐 Dashboard : https://vercel.com/dashboard');
  console.log(`2. 📁 Projet : ${projectId}`);
  console.log('3. ⚙️  Settings → Environment Variables');
  console.log('4. ➕ Ajouter variables :');
  console.log('');
  
  envVars.forEach(({ key, value }) => {
    console.log(`${key}=${value}`);
  });
  
  console.log('\n5. 🚀 Redeploy : vercel --prod');
  
  console.log('\n💡 POUR AUTOMATISATION FUTURE :');
  console.log('===============================');
  console.log('1. Créer token Vercel : https://vercel.com/account/tokens');
  console.log('2. Exporter : export VERCEL_TOKEN="vercel_xxxx"');
  console.log('3. Relancer : npm run vercel:auto');
}

main().catch(console.error);
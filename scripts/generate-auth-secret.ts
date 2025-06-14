#!/usr/bin/env tsx

/**
 * 🔐 Générateur de Secret Better Auth
 * Website Builder Platform
 */

import { randomBytes } from 'crypto';

console.log('🔐 GÉNÉRATEUR DE SECRET BETTER AUTH');
console.log('==================================\n');

// Générer un secret cryptographiquement sécurisé
const secret = randomBytes(32).toString('base64');

console.log('✅ Secret généré avec succès !');
console.log('');
console.log('📋 À copier dans .env.production :');
console.log('');
console.log(`BETTER_AUTH_SECRET="${secret}"`);
console.log('');
console.log('⚠️  Important :');
console.log('• Garder ce secret confidentiel');
console.log('• Ne jamais le commiter dans Git');
console.log('• Utiliser le même secret sur tous les environnements de production');
console.log('');
console.log('🔒 Longueur : 32 bytes → Base64 (44 caractères)');
console.log('🎯 Cryptographiquement sécurisé pour la production');
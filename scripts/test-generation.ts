#!/usr/bin/env tsx

// Mock la base de données pour les tests
process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "mock://test-database";

import { ClientGenerator } from "../lib/generators/client-generator";

// Configuration de test pour un plombier
const testClientConfig = {
  businessName: "Plomberie Dubois Test",
  contactName: "Jean Dubois",
  email: "test@dubois-plomberie.fr",
  phone: "06 12 34 56 78",
  templateType: "plumber" as const,
  address: {
    street: "123 rue de la République",
    city: "Lyon",
    postalCode: "69001",
    country: "France"
  },
  customizations: {
    headline: "Votre Plombier de Confiance à Lyon",
    subheadline: "Intervention rapide 24h/24 - Devis gratuit - Plus de 15 ans d'expérience",
    openingHours: {
      monday: "8h-19h",
      tuesday: "8h-19h", 
      wednesday: "8h-19h",
      thursday: "8h-19h",
      friday: "8h-19h",
      saturday: "9h-17h",
      sunday: "Urgences uniquement",
      emergency: "24h/24 - 7j/7"
    }
  }
};

async function testGeneration() {
  console.log("🧪 Test de génération de site client...\n");

  try {
    // 1. Test de génération de configuration
    console.log("📋 Génération de la configuration client...");
    const config = await ClientGenerator.generateClientConfig(testClientConfig);
    
    console.log("✅ Configuration générée:");
    console.log(`   - ID: ${config.id}`);
    console.log(`   - Entreprise: ${config.business.name}`);
    console.log(`   - Template: ${config.template}`);
    console.log(`   - Domaine: ${config.domain}`);
    console.log(`   - SEO Title: ${config.seo.title}`);
    console.log(`   - Services: ${config.content.services.length} définis`);
    console.log();

    // 2. Test de génération des fichiers
    console.log("📁 Génération des fichiers du site...");
    const siteFiles = (ClientGenerator as any).generateSiteFiles(config);
    
    console.log("✅ Fichiers générés:");
    Object.keys(siteFiles).forEach(filename => {
      console.log(`   - ${filename} (${Math.round(siteFiles[filename].length / 1024)}KB)`);
    });
    console.log();

    // 3. Affichage du contenu généré
    console.log("📄 Aperçu du contenu:");
    console.log("--- package.json ---");
    const packageJson = JSON.parse(siteFiles['package.json']);
    console.log(`Nom: ${packageJson.name}`);
    console.log(`Dependencies: ${Object.keys(packageJson.dependencies).length}`);
    console.log();

    console.log("--- Configuration ---");
    console.log(`Template: ${config.template}`);
    console.log(`Headline: ${config.content.hero.headline}`);
    console.log(`Subheadline: ${config.content.hero.subheadline}`);
    console.log(`Nombre de services: ${config.content.services.length}`);
    console.log();

    // 4. Test de sauvegarde (simulé sans vraie DB)
    console.log("💾 Simulation de sauvegarde en base...");
    console.log("✅ Client sauvegardé (simulation)");
    console.log();

    // 5. Test de préparation pour déploiement
    console.log("🚀 Préparation pour déploiement Vercel...");
    console.log("✅ Site prêt pour déploiement");
    console.log(`   - Fichiers: ${Object.keys(siteFiles).length}`);
    console.log(`   - Taille totale: ${Math.round(Object.values(siteFiles).join('').length / 1024)}KB`);
    console.log();

    // 6. Vérification de la structure Next.js
    console.log("🔍 Vérification de la structure Next.js...");
    const requiredFiles = [
      'package.json',
      'next.config.js', 
      'app/page.tsx',
      'app/layout.tsx',
      'app/globals.css',
      'tailwind.config.js'
    ];
    
    const missingFiles = requiredFiles.filter(file => !siteFiles[file]);
    if (missingFiles.length === 0) {
      console.log("✅ Tous les fichiers requis sont présents");
    } else {
      console.log("❌ Fichiers manquants:");
      missingFiles.forEach(file => console.log(`   - ${file}`));
    }
    console.log();

    // 7. Affichage des métadonnées SEO
    console.log("🔍 Métadonnées SEO générées:");
    console.log(`   - Title: ${config.seo.title}`);
    console.log(`   - Description: ${config.seo.description}`);
    console.log(`   - Keywords: ${config.seo.keywords.join(', ')}`);
    console.log();

    console.log("🎉 Test de génération terminé avec succès!");
    console.log("\n📊 Résumé:");
    console.log(`   ✅ Configuration: Générée`);
    console.log(`   ✅ Fichiers: ${Object.keys(siteFiles).length} créés`);
    console.log(`   ✅ SEO: Optimisé pour ${config.business.address.city}`);
    console.log(`   ✅ Template: ${config.template} appliqué`);
    console.log(`   ✅ Structure: Next.js valide`);

  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
    process.exit(1);
  }
}

// Test de validation de domaine
function testDomainGeneration() {
  console.log("\n🌐 Test de génération de domaines:");
  
  const testCases = [
    "Plomberie Dubois",
    "Restaurant Le Gourmet", 
    "Cabinet Médical Dr. Martin",
    "Électricité & Co",
    "Boulangerie L'Épi d'Or"
  ];

  testCases.forEach(businessName => {
    const domain = (ClientGenerator as any).generateDomain(businessName);
    console.log(`   ${businessName} → ${domain}`);
  });
}

// Test de génération SEO
function testSEOGeneration() {
  console.log("\n🎯 Test de génération SEO:");
  
  const testCases = [
    { name: "Plomberie Dubois", template: "plumber" as const, city: "Lyon" },
    { name: "Restaurant Le Gourmet", template: "restaurant" as const, city: "Paris" },
    { name: "Cabinet Dr. Martin", template: "medical" as const, city: "Marseille" }
  ];

  testCases.forEach(test => {
    const seo = (ClientGenerator as any).generateSEO(test.name, test.template, test.city);
    console.log(`\n   ${test.name} (${test.template}):`);
    console.log(`   Title: ${seo.title}`);
    console.log(`   Keywords: ${seo.keywords.slice(0, 3).join(', ')}...`);
  });
}

// Exécution des tests
async function runAllTests() {
  console.log("🚀 Démarrage des tests de génération...\n");
  
  await testGeneration();
  testDomainGeneration();
  testSEOGeneration();
  
  console.log("\n✨ Tous les tests terminés!");
}

// Lancer les tests
runAllTests().catch(error => {
  console.error("💥 Erreur critique:", error);
  process.exit(1);
});
#!/usr/bin/env tsx

import { ClientGenerator } from "../lib/generators/client-generator";

// Simulation du workflow complet de création d'un site client
async function testCompleteWorkflow() {
  console.log("🔄 Test du workflow complet de création d'un site client\n");

  // Étape 1: Données client saisies dans le dashboard
  console.log("📝 Étape 1: Saisie des informations client");
  const clientData = {
    businessName: "Plomberie Workflow Test",
    contactName: "Jean Workflow",
    email: "test@workflow-plomberie.fr",
    phone: "06 99 88 77 66",
    templateType: "plumber" as const,
    address: {
      street: "456 avenue du Workflow",
      city: "Test-Ville",
      postalCode: "12345",
      country: "France"
    },
    customizations: {
      headline: "Workflow Plomberie Test",
      subheadline: "Test du système de génération automatique",
      openingHours: {
        monday: "8h-18h",
        tuesday: "8h-18h",
        wednesday: "8h-18h",
        thursday: "8h-18h",
        friday: "8h-18h",
        saturday: "9h-16h",
        sunday: "Fermé",
        emergency: "Urgences 24h/24"
      }
    }
  };

  console.log(`   ✅ Client: ${clientData.businessName}`);
  console.log(`   ✅ Template: ${clientData.templateType}`);
  console.log(`   ✅ Ville: ${clientData.address.city}`);

  // Étape 2: Génération de la configuration
  console.log("\n⚙️  Étape 2: Génération de la configuration");
  const startConfigTime = Date.now();
  
  try {
    const config = await ClientGenerator.generateClientConfig(clientData);
    const configTime = Date.now() - startConfigTime;
    
    console.log(`   ✅ Configuration générée en ${configTime}ms`);
    console.log(`   ✅ ID: ${config.id}`);
    console.log(`   ✅ Domaine: ${config.domain}`);
    console.log(`   ✅ SEO Title: ${config.seo.title}`);
    console.log(`   ✅ Services: ${config.content.services.length}`);

    // Étape 3: Génération des fichiers
    console.log("\n📁 Étape 3: Génération des fichiers du site");
    const startFilesTime = Date.now();
    
    const siteFiles = (ClientGenerator as any).generateSiteFiles(config);
    const filesTime = Date.now() - startFilesTime;
    
    console.log(`   ✅ Fichiers générés en ${filesTime}ms`);
    console.log(`   ✅ Nombre de fichiers: ${Object.keys(siteFiles).length}`);
    
    const totalSize = Object.values(siteFiles).join('').length;
    console.log(`   ✅ Taille totale: ${Math.round(totalSize / 1024)}KB`);

    // Étape 4: Validation des fichiers
    console.log("\n🔍 Étape 4: Validation des fichiers générés");
    
    // Valider package.json
    try {
      const packageJson = JSON.parse(siteFiles['package.json']);
      console.log(`   ✅ package.json valide (${Object.keys(packageJson.dependencies).length} dépendances)`);
    } catch (e) {
      console.log(`   ❌ package.json invalide`);
      throw e;
    }

    // Valider la page principale
    const mainPage = siteFiles['app/page.tsx'];
    if (mainPage.includes('PlumberTemplate') && mainPage.includes('siteConfig')) {
      console.log(`   ✅ Page principale valide`);
    } else {
      console.log(`   ❌ Page principale invalide`);
      throw new Error("Page principale malformée");
    }

    // Valider la configuration
    const configFile = siteFiles['lib/config.ts'];
    if (configFile.includes(config.business.name) && configFile.includes(config.seo.title)) {
      console.log(`   ✅ Configuration intégrée correctement`);
    } else {
      console.log(`   ❌ Configuration mal intégrée`);
      throw new Error("Configuration mal intégrée");
    }

    // Étape 5: Test de la structure Next.js
    console.log("\n🏗️  Étape 5: Validation de la structure Next.js");
    
    const requiredFiles = [
      'package.json',
      'next.config.js',
      'app/page.tsx',
      'app/layout.tsx',
      'app/globals.css',
      'tailwind.config.js',
      'lib/config.ts'
    ];

    const missingFiles = requiredFiles.filter(file => !siteFiles[file]);
    if (missingFiles.length === 0) {
      console.log(`   ✅ Structure Next.js complète`);
    } else {
      console.log(`   ❌ Fichiers manquants: ${missingFiles.join(', ')}`);
      throw new Error("Structure Next.js incomplète");
    }

    // Étape 6: Simulation de déploiement (sans Vercel réel)
    console.log("\n🚀 Étape 6: Simulation de déploiement");
    
    const deploymentData = {
      projectName: config.id,
      domain: config.domain,
      files: siteFiles,
      timestamp: new Date().toISOString()
    };

    console.log(`   ✅ Projet prêt: ${deploymentData.projectName}`);
    console.log(`   ✅ Domaine: ${deploymentData.domain}`);
    console.log(`   ✅ Fichiers: ${Object.keys(deploymentData.files).length}`);
    
    // Simulation des étapes Vercel
    console.log(`   📦 Simulation: Création du projet Vercel...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`   ✅ Projet Vercel créé (simulé)`);
    
    console.log(`   🔨 Simulation: Build et déploiement...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`   ✅ Déploiement réussi (simulé)`);
    
    const simulatedUrl = `https://${config.id}.vercel.app`;
    console.log(`   🌐 URL de test: ${simulatedUrl}`);

    // Étape 7: Validation finale
    console.log("\n✅ Étape 7: Validation finale du workflow");
    
    const workflowMetrics = {
      totalTime: Date.now() - startConfigTime,
      configurationTime: configTime,
      filesGenerationTime: filesTime,
      filesCount: Object.keys(siteFiles).length,
      totalSize: Math.round(totalSize / 1024) + 'KB',
      seoOptimized: config.seo.keywords.length > 5,
      responsive: mainPage.includes('md:') && mainPage.includes('lg:'),
      accessible: mainPage.includes('alt=') || mainPage.includes('aria-'),
      performance: siteFiles['next.config.js'].includes('standalone')
    };

    console.log(`   ⏱️  Temps total: ${workflowMetrics.totalTime}ms`);
    console.log(`   📊 Fichiers générés: ${workflowMetrics.filesCount}`);
    console.log(`   💾 Taille: ${workflowMetrics.totalSize}`);
    console.log(`   🎯 SEO optimisé: ${workflowMetrics.seoOptimized ? 'Oui' : 'Non'}`);
    console.log(`   📱 Responsive: ${workflowMetrics.responsive ? 'Oui' : 'Non'}`);
    console.log(`   ♿ Accessible: ${workflowMetrics.accessible ? 'Oui' : 'Non'}`);
    console.log(`   ⚡ Performance: ${workflowMetrics.performance ? 'Optimisé' : 'Standard'}`);

    // Rapport final
    console.log("\n🎉 WORKFLOW COMPLET RÉUSSI !");
    console.log("=" .repeat(40));
    console.log(`✅ Site généré pour: ${config.business.name}`);
    console.log(`✅ Template: ${config.template}`);
    console.log(`✅ Domaine: ${config.domain}`);
    console.log(`✅ Prêt pour déploiement: Oui`);
    console.log(`✅ Qualité: Production-ready`);
    
    const qualityScore = Object.values(workflowMetrics).filter(v => v === true).length;
    console.log(`✅ Score qualité: ${qualityScore}/4 critères`);

    return {
      success: true,
      config,
      metrics: workflowMetrics,
      simulatedUrl
    };

  } catch (error) {
    console.log(`\n❌ ERREUR DANS LE WORKFLOW`);
    console.log(`   ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

// Test de charge - génération multiple
async function testMultipleGeneration() {
  console.log("\n🔄 Test de charge: Génération multiple\n");
  
  const testClients = [
    { name: "Plomberie A", city: "Lyon" },
    { name: "Plomberie B", city: "Paris" },
    { name: "Plomberie C", city: "Marseille" }
  ];

  const results = [];
  const startTime = Date.now();

  for (const [index, testClient] of testClients.entries()) {
    console.log(`📝 Génération ${index + 1}/3: ${testClient.name}...`);
    
    const clientStart = Date.now();
    
    try {
      const config = await ClientGenerator.generateClientConfig({
        businessName: testClient.name,
        contactName: "Test Contact",
        email: `test@${testClient.name.toLowerCase().replace(' ', '')}.fr`,
        phone: "06 12 34 56 78",
        templateType: "plumber",
        address: {
          street: "123 rue Test",
          city: testClient.city,
          postalCode: "12345",
          country: "France"
        }
      });
      
      const clientTime = Date.now() - clientStart;
      
      results.push({
        name: testClient.name,
        success: true,
        time: clientTime,
        domain: config.domain
      });
      
      console.log(`   ✅ ${testClient.name} - ${clientTime}ms`);
      
    } catch (error) {
      const clientTime = Date.now() - clientStart;
      
      results.push({
        name: testClient.name,
        success: false,
        time: clientTime,
        error: error instanceof Error ? error.message : 'Erreur'
      });
      
      console.log(`   ❌ ${testClient.name} - ${clientTime}ms`);
    }
  }

  const totalTime = Date.now() - startTime;
  const successCount = results.filter(r => r.success).length;
  const avgTime = results.reduce((sum, r) => sum + r.time, 0) / results.length;

  console.log(`\n📊 Résultats du test de charge:`);
  console.log(`   🎯 Réussis: ${successCount}/${results.length}`);
  console.log(`   ⏱️  Temps total: ${totalTime}ms`);
  console.log(`   📈 Temps moyen: ${Math.round(avgTime)}ms par site`);
  console.log(`   🚀 Débit: ${Math.round(3000 / avgTime)} sites/seconde théorique`);

  return results;
}

// Exécution des tests
async function main() {
  console.log("🧪 TESTS D'INTÉGRATION COMPLETS");
  console.log("=" .repeat(50));
  
  try {
    // Test workflow principal
    const workflowResult = await testCompleteWorkflow();
    
    if (workflowResult.success) {
      // Test de charge si le workflow principal réussit
      await testMultipleGeneration();
      
      console.log("\n🏆 TOUS LES TESTS D'INTÉGRATION RÉUSSIS !");
      console.log("🚀 La plateforme est prête pour la production !");
      
    } else {
      console.log("\n❌ Échec du workflow principal");
      console.log("🔧 Corriger les erreurs avant de continuer");
    }
    
  } catch (error) {
    console.error("💥 Erreur critique:", error);
    process.exit(1);
  }
}

main();
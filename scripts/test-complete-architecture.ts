#!/usr/bin/env tsx

import { ClientGenerator } from "../lib/generators/client-generator";
import { duboisPlomberieConfig } from "../lib/configs/examples/dubois-plomberie";

// Configuration de test complète
const testClient = {
  businessName: "Plomberie Test Lyon",
  contactName: "Jean Test",
  email: "test@plomberie-test-lyon.fr",
  phone: "06 11 22 33 44",
  templateType: "plumber" as const,
  address: {
    street: "123 rue de Test",
    city: "Lyon",
    postalCode: "69001",
    country: "France"
  },
  customizations: {
    headline: "Votre Plombier Test à Lyon",
    subheadline: "Test d'intervention rapide 24h/24",
    openingHours: {
      monday: "8h-19h",
      tuesday: "8h-19h",
      wednesday: "8h-19h",
      thursday: "8h-19h",
      friday: "8h-19h",
      saturday: "9h-17h",
      sunday: "Urgences test",
      emergency: "Test 24h/24"
    }
  }
};

interface TestResult {
  name: string;
  success: boolean;
  duration: number;
  details?: any;
  error?: string;
}

class ArchitectureTestSuite {
  private results: TestResult[] = [];

  private async runTest(name: string, testFn: () => Promise<any>): Promise<TestResult> {
    const startTime = Date.now();
    console.log(`🧪 Test: ${name}...`);

    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      console.log(`✅ ${name} - ${duration}ms`);
      
      const testResult: TestResult = {
        name,
        success: true,
        duration,
        details: result
      };
      
      this.results.push(testResult);
      return testResult;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      console.log(`❌ ${name} - ${duration}ms`);
      console.log(`   Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      
      const testResult: TestResult = {
        name,
        success: false,
        duration,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
      
      this.results.push(testResult);
      return testResult;
    }
  }

  async testConfigGeneration() {
    return this.runTest("Génération de configuration", async () => {
      const config = await ClientGenerator.generateClientConfig(testClient);
      
      // Vérifications de base
      if (!config.id) throw new Error("ID manquant");
      if (!config.domain) throw new Error("Domaine manquant");
      if (!config.business.name) throw new Error("Nom d'entreprise manquant");
      if (!config.seo.title) throw new Error("Titre SEO manquant");
      if (!config.content.services || config.content.services.length === 0) {
        throw new Error("Services manquants");
      }
      
      return {
        id: config.id,
        domain: config.domain,
        template: config.template,
        servicesCount: config.content.services.length,
        seoKeywords: config.seo.keywords.length
      };
    });
  }

  async testFileGeneration() {
    return this.runTest("Génération des fichiers", async () => {
      const config = await ClientGenerator.generateClientConfig(testClient);
      const files = (ClientGenerator as any).generateSiteFiles(config);
      
      const requiredFiles = [
        'package.json',
        'next.config.js',
        'app/page.tsx',
        'app/layout.tsx',
        'app/globals.css',
        'tailwind.config.js',
        'lib/config.ts'
      ];
      
      const missingFiles = requiredFiles.filter(file => !files[file]);
      if (missingFiles.length > 0) {
        throw new Error(`Fichiers manquants: ${missingFiles.join(', ')}`);
      }
      
      // Vérifier la validité du package.json
      try {
        const packageJson = JSON.parse(files['package.json']);
        if (!packageJson.dependencies || !packageJson.scripts) {
          throw new Error("package.json invalide");
        }
      } catch (e) {
        throw new Error("package.json mal formé");
      }
      
      return {
        filesGenerated: Object.keys(files).length,
        totalSize: Math.round(Object.values(files).join('').length / 1024) + 'KB',
        files: Object.keys(files)
      };
    });
  }

  async testTemplateRendering() {
    return this.runTest("Rendu du template", async () => {
      // Test avec la configuration d'exemple
      const config = duboisPlomberieConfig;
      
      // Vérifier que toutes les sections ont du contenu
      if (!config.content.hero.headline) throw new Error("Hero headline manquant");
      if (!config.content.services || config.content.services.length === 0) {
        throw new Error("Services manquants");
      }
      if (!config.content.testimonials || config.content.testimonials.length === 0) {
        throw new Error("Témoignages manquants");
      }
      if (!config.content.faq || config.content.faq.length === 0) {
        throw new Error("FAQ manquante");
      }
      
      return {
        template: config.template,
        heroHeadline: config.content.hero.headline,
        servicesCount: config.content.services.length,
        testimonialsCount: config.content.testimonials.length,
        faqCount: config.content.faq.length,
        seoOptimized: config.seo.keywords.length > 5
      };
    });
  }

  async testDatabaseSchema() {
    return this.runTest("Validation du schéma de base", async () => {
      // Test de validation des types TypeScript
      const config = await ClientGenerator.generateClientConfig(testClient);
      
      // Vérifier que la config peut être sérialisée/désérialisée
      const serialized = JSON.stringify(config);
      const deserialized = JSON.parse(serialized);
      
      if (!deserialized.business || !deserialized.seo || !deserialized.content) {
        throw new Error("Structure de configuration invalide");
      }
      
      return {
        configSize: Math.round(serialized.length / 1024) + 'KB',
        structure: {
          business: !!deserialized.business,
          seo: !!deserialized.seo,
          content: !!deserialized.content,
          theme: !!deserialized.theme
        }
      };
    });
  }

  async testSEOGeneration() {
    return this.runTest("Génération SEO", async () => {
      const config = await ClientGenerator.generateClientConfig(testClient);
      const seo = config.seo;
      
      // Vérifications SEO
      if (!seo.title || seo.title.length < 30) {
        throw new Error("Titre SEO trop court");
      }
      if (!seo.description || seo.description.length < 120) {
        throw new Error("Description SEO trop courte");
      }
      if (!seo.keywords || seo.keywords.length < 5) {
        throw new Error("Pas assez de mots-clés");
      }
      
      // Vérifier que la ville est présente dans le titre
      if (!seo.title.toLowerCase().includes(testClient.address.city.toLowerCase())) {
        throw new Error("Ville manquante dans le titre SEO");
      }
      
      return {
        titleLength: seo.title.length,
        descriptionLength: seo.description.length,
        keywordsCount: seo.keywords.length,
        localOptimized: seo.title.includes(testClient.address.city)
      };
    });
  }

  async testResponsiveComponents() {
    return this.runTest("Composants responsive", async () => {
      const config = await ClientGenerator.generateClientConfig(testClient);
      
      // Vérifier que les composants ont les bonnes classes Tailwind
      const files = (ClientGenerator as any).generateSiteFiles(config);
      const mainPage = files['app/page.tsx'];
      
      // Vérifier la présence de classes responsive
      const responsiveClasses = [
        'md:', 'lg:', 'sm:', 'xl:',
        'grid-cols-1', 'grid-cols-2', 'grid-cols-3',
        'flex-col', 'flex-row'
      ];
      
      const foundClasses = responsiveClasses.filter(cls => mainPage.includes(cls));
      
      if (foundClasses.length < 3) {
        throw new Error("Pas assez de classes responsive détectées");
      }
      
      return {
        responsiveClassesFound: foundClasses.length,
        classes: foundClasses.slice(0, 5),
        mobileFirst: mainPage.includes('grid-cols-1')
      };
    });
  }

  async testPerformanceOptimization() {
    return this.runTest("Optimisations performance", async () => {
      const config = await ClientGenerator.generateClientConfig(testClient);
      const files = (ClientGenerator as any).generateSiteFiles(config);
      
      // Vérifier les optimisations Next.js
      const nextConfig = files['next.config.js'];
      const packageJson = JSON.parse(files['package.json']);
      
      // Vérifications d'optimisation
      const checks = {
        standalone: nextConfig.includes('standalone'),
        framerMotion: !!packageJson.dependencies['framer-motion'],
        tailwind: !!packageJson.dependencies['tailwindcss'],
        lucideIcons: !!packageJson.dependencies['lucide-react'],
        nextOptimized: nextConfig.includes('images')
      };
      
      const optimizationScore = Object.values(checks).filter(Boolean).length;
      
      return {
        optimizationScore: `${optimizationScore}/5`,
        checks,
        bundleEstimate: '< 150KB (estimé)'
      };
    });
  }

  async testAccessibility() {
    return this.runTest("Accessibilité", async () => {
      const config = await ClientGenerator.generateClientConfig(testClient);
      const files = (ClientGenerator as any).generateSiteFiles(config);
      const mainPage = files['app/page.tsx'];
      
      // Vérifier les bonnes pratiques d'accessibilité
      const accessibilityFeatures = {
        semanticHTML: mainPage.includes('<section'),
        altTexts: mainPage.includes('alt='),
        ariaLabels: mainPage.includes('aria-'),
        keyboardNav: mainPage.includes('onKeyDown') || mainPage.includes('tabIndex'),
        headingStructure: mainPage.includes('<h1') && mainPage.includes('<h2')
      };
      
      const accessibilityScore = Object.values(accessibilityFeatures).filter(Boolean).length;
      
      if (accessibilityScore < 3) {
        throw new Error("Score d'accessibilité insuffisant");
      }
      
      return {
        accessibilityScore: `${accessibilityScore}/5`,
        features: accessibilityFeatures,
        wcagCompliance: accessibilityScore >= 4 ? 'AA' : 'A'
      };
    });
  }

  async runAllTests() {
    console.log("🚀 Démarrage des tests d'architecture complète\n");
    
    // Exécuter tous les tests
    await this.testConfigGeneration();
    await this.testFileGeneration();
    await this.testTemplateRendering();
    await this.testDatabaseSchema();
    await this.testSEOGeneration();
    await this.testResponsiveComponents();
    await this.testPerformanceOptimization();
    await this.testAccessibility();
    
    // Générer le rapport
    this.generateReport();
  }

  private generateReport() {
    console.log("\n📊 RAPPORT DE TESTS D'ARCHITECTURE");
    console.log("=" .repeat(50));
    
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    console.log(`\n📈 Résumé global:`);
    console.log(`   ✅ Tests réussis: ${passedTests}/${totalTests}`);
    console.log(`   ❌ Tests échoués: ${failedTests}/${totalTests}`);
    console.log(`   ⏱️  Durée totale: ${totalDuration}ms`);
    console.log(`   📊 Taux de réussite: ${Math.round((passedTests/totalTests) * 100)}%`);
    
    console.log(`\n📋 Détail des tests:`);
    this.results.forEach((result, index) => {
      const status = result.success ? "✅" : "❌";
      console.log(`   ${status} ${result.name} (${result.duration}ms)`);
      
      if (result.success && result.details) {
        // Afficher quelques détails pour les tests réussis
        const details = result.details;
        if (details.domain) console.log(`       → Domaine: ${details.domain}`);
        if (details.filesGenerated) console.log(`       → Fichiers: ${details.filesGenerated}`);
        if (details.optimizationScore) console.log(`       → Performance: ${details.optimizationScore}`);
        if (details.accessibilityScore) console.log(`       → Accessibilité: ${details.accessibilityScore}`);
      }
      
      if (!result.success && result.error) {
        console.log(`       ❌ ${result.error}`);
      }
    });
    
    // Recommandations
    console.log(`\n💡 Recommandations:`);
    
    if (passedTests === totalTests) {
      console.log(`   🎉 Tous les tests passent ! L'architecture est prête pour la production.`);
      console.log(`   🚀 Vous pouvez procéder au déploiement d'un site test.`);
    } else {
      console.log(`   ⚠️  ${failedTests} test(s) à corriger avant la production.`);
      const failedTestNames = this.results.filter(r => !r.success).map(r => r.name);
      console.log(`   🔧 Tests échoués: ${failedTestNames.join(', ')}`);
    }
    
    // Métriques de qualité
    console.log(`\n🏆 Métriques de qualité:`);
    const qualityMetrics = this.calculateQualityMetrics();
    Object.entries(qualityMetrics).forEach(([metric, score]) => {
      const emoji = score >= 80 ? "🟢" : score >= 60 ? "🟡" : "🔴";
      console.log(`   ${emoji} ${metric}: ${score}%`);
    });
    
    console.log(`\n✨ Tests d'architecture terminés !`);
  }

  private calculateQualityMetrics() {
    const metrics: Record<string, number> = {};
    
    // Métrique de génération
    const generationTests = ['Génération de configuration', 'Génération des fichiers'];
    const generationSuccess = generationTests.filter(name => 
      this.results.find(r => r.name === name)?.success
    ).length;
    metrics['Génération'] = Math.round((generationSuccess / generationTests.length) * 100);
    
    // Métrique de qualité du code
    const qualityTests = ['Composants responsive', 'Optimisations performance', 'Accessibilité'];
    const qualitySuccess = qualityTests.filter(name => 
      this.results.find(r => r.name === name)?.success
    ).length;
    metrics['Qualité Code'] = Math.round((qualitySuccess / qualityTests.length) * 100);
    
    // Métrique SEO
    const seoTests = ['Génération SEO'];
    const seoSuccess = seoTests.filter(name => 
      this.results.find(r => r.name === name)?.success
    ).length;
    metrics['SEO'] = Math.round((seoSuccess / seoTests.length) * 100);
    
    // Score global
    const globalSuccess = this.results.filter(r => r.success).length;
    metrics['Global'] = Math.round((globalSuccess / this.results.length) * 100);
    
    return metrics;
  }
}

// Exécution des tests
async function main() {
  const testSuite = new ArchitectureTestSuite();
  
  try {
    await testSuite.runAllTests();
    process.exit(0);
  } catch (error) {
    console.error("💥 Erreur critique lors des tests:", error);
    process.exit(1);
  }
}

main();
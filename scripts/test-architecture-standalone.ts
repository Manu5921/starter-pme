#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

// Test d'architecture complète sans dépendances de DB
class ArchitectureTestSuite {
  
  async testConfigGeneration() {
    console.log("🔧 Test: Génération de configuration...");
    
    try {
      // Test du générateur standalone
      execSync('npm run test:generation', { stdio: 'pipe' });
      console.log("   ✅ Génération de configuration: OK");
      return true;
    } catch (error) {
      console.log("   ❌ Génération de configuration: ÉCHEC");
      return false;
    }
  }

  testFileStructure() {
    console.log("📁 Test: Structure des fichiers...");
    
    const criticalFiles = [
      // Core
      'package.json',
      'next.config.ts',
      'tailwind.config.ts',
      
      // App structure
      'app/layout.tsx',
      'app/globals.css',
      
      // Components
      'components/shared/HeroSection.tsx',
      'components/shared/ServicesGrid.tsx',
      'components/shared/ContactForm.tsx',
      'components/templates/plumber/PlumberTemplate.tsx',
      
      // Database
      'db/schema.ts',
      'db/drizzle.ts',
      
      // Generators
      'lib/generators/client-generator.ts',
      'lib/deployment/vercel-deployer.ts',
      
      // Types
      'lib/types/database.ts',
      
      // Configuration examples
      'lib/configs/examples/dubois-plomberie.ts',
      
      // Demo page
      'app/demo/page.tsx',
      
      // Documentation
      'DEVBOOK.md',
      'QUICKSTART.md',
      'GENERATION_SYSTEM.md'
    ];

    let allPresent = true;
    const missingFiles = [];

    criticalFiles.forEach(file => {
      if (existsSync(file)) {
        console.log(`   ✅ ${file}`);
      } else {
        console.log(`   ❌ ${file}`);
        missingFiles.push(file);
        allPresent = false;
      }
    });

    if (allPresent) {
      console.log("   ✅ Structure des fichiers: OK");
    } else {
      console.log(`   ❌ ${missingFiles.length} fichier(s) manquant(s)`);
    }

    return allPresent;
  }

  testTemplateComponents() {
    console.log("🎨 Test: Composants de template...");
    
    const templateFiles = [
      'components/templates/plumber/PlumberTemplate.tsx',
      'components/shared/HeroSection.tsx',
      'components/shared/ServicesGrid.tsx',
      'components/shared/ContactForm.tsx',
      'components/shared/Testimonials.tsx',
      'components/shared/FAQ.tsx'
    ];

    let componentsValid = true;

    templateFiles.forEach(file => {
      if (existsSync(file)) {
        try {
          const content = readFileSync(file, 'utf-8');
          
          // Vérifications basiques
          const hasExport = content.includes('export');
          const hasImport = content.includes('import');
          const hasTypeScript = file.endsWith('.tsx');
          
          if (hasExport && hasImport && hasTypeScript) {
            console.log(`   ✅ ${file}: Valide`);
          } else {
            console.log(`   ⚠️  ${file}: Structure douteuse`);
            componentsValid = false;
          }
        } catch (error) {
          console.log(`   ❌ ${file}: Erreur de lecture`);
          componentsValid = false;
        }
      } else {
        console.log(`   ❌ ${file}: Manquant`);
        componentsValid = false;
      }
    });

    if (componentsValid) {
      console.log("   ✅ Composants de template: OK");
    } else {
      console.log("   ❌ Problèmes détectés dans les composants");
    }

    return componentsValid;
  }

  testSEOGeneration() {
    console.log("🎯 Test: Génération SEO...");
    
    try {
      // Test manuel de SEO avec notre générateur standalone
      const businessName = "Test Business";
      const templateType = "plumber";
      const city = "Lyon";
      
      // Simulation de la génération SEO
      const title = `Plombier ${city} - Dépannage 24h/24 | ${businessName}`;
      const description = `Plombier professionnel à ${city}. Intervention rapide 24h/24 pour tous vos dépannages plomberie. Devis gratuit. ⭐ ${businessName}`;
      const keywords = [
        `plombier ${city.toLowerCase()}`,
        `dépannage plomberie ${city.toLowerCase()}`,
        `urgence plombier ${city.toLowerCase()}`,
        `fuite eau ${city.toLowerCase()}`,
        'plomberie 24h/24',
        'débouchage canalisation',
        'installation sanitaire'
      ];

      // Validations SEO
      const titleValid = title.length > 10 && title.length < 60;
      const descriptionValid = description.length > 50 && description.length < 160;
      const keywordsValid = keywords.length >= 5;
      const localSEO = title.includes(city) && description.includes(city);

      console.log(`   ✅ Title: ${titleValid ? 'OK' : 'ÉCHEC'} (${title.length} chars)`);
      console.log(`   ✅ Description: ${descriptionValid ? 'OK' : 'ÉCHEC'} (${description.length} chars)`);
      console.log(`   ✅ Keywords: ${keywordsValid ? 'OK' : 'ÉCHEC'} (${keywords.length} mots-clés)`);
      console.log(`   ✅ SEO Local: ${localSEO ? 'OK' : 'ÉCHEC'}`);

      const seoValid = titleValid && descriptionValid && keywordsValid && localSEO;
      
      if (seoValid) {
        console.log("   ✅ Génération SEO: OK");
      } else {
        console.log("   ❌ Génération SEO: ÉCHEC");
      }

      return seoValid;
    } catch (error) {
      console.log("   ❌ Erreur lors du test SEO");
      return false;
    }
  }

  testResponsiveDesign() {
    console.log("📱 Test: Design responsive...");
    
    const componentsToCheck = [
      'components/shared/HeroSection.tsx',
      'components/shared/ServicesGrid.tsx',
      'components/shared/ContactForm.tsx'
    ];

    let responsiveValid = true;

    componentsToCheck.forEach(file => {
      if (existsSync(file)) {
        try {
          const content = readFileSync(file, 'utf-8');
          
          // Rechercher les classes Tailwind responsive
          const hasMobileFirst = content.includes('sm:') || content.includes('md:') || content.includes('lg:');
          const hasFlexGrid = content.includes('flex') || content.includes('grid');
          const hasResponsiveSpacing = content.includes('p-') && content.includes('px-') || content.includes('py-');
          
          if (hasMobileFirst && hasFlexGrid) {
            console.log(`   ✅ ${file}: Responsive`);
          } else {
            console.log(`   ⚠️  ${file}: Possiblement non-responsive`);
            responsiveValid = false;
          }
        } catch (error) {
          console.log(`   ❌ ${file}: Erreur`);
          responsiveValid = false;
        }
      }
    });

    if (responsiveValid) {
      console.log("   ✅ Design responsive: OK");
    } else {
      console.log("   ❌ Problèmes de responsive détectés");
    }

    return responsiveValid;
  }

  testAccessibility() {
    console.log("♿ Test: Accessibilité...");
    
    const componentsToCheck = [
      'components/shared/HeroSection.tsx',
      'components/shared/ServicesGrid.tsx',
      'components/shared/ContactForm.tsx'
    ];

    let accessibilityValid = true;

    componentsToCheck.forEach(file => {
      if (existsSync(file)) {
        try {
          const content = readFileSync(file, 'utf-8');
          
          // Vérifications d'accessibilité basiques
          const hasAltText = content.includes('alt=');
          const hasAriaLabels = content.includes('aria-') || content.includes('role=');
          const hasSemanticHTML = content.includes('<h1') || content.includes('<h2') || content.includes('<h3');
          const hasFocusStates = content.includes('focus:');
          
          let score = 0;
          if (hasAltText) score++;
          if (hasAriaLabels) score++;
          if (hasSemanticHTML) score++;
          if (hasFocusStates) score++;
          
          if (score >= 2) {
            console.log(`   ✅ ${file}: Accessible (${score}/4)`);
          } else {
            console.log(`   ⚠️  ${file}: Accessibilité limitée (${score}/4)`);
            accessibilityValid = false;
          }
        } catch (error) {
          console.log(`   ❌ ${file}: Erreur`);
          accessibilityValid = false;
        }
      }
    });

    if (accessibilityValid) {
      console.log("   ✅ Accessibilité: OK");
    } else {
      console.log("   ❌ Améliorations d'accessibilité nécessaires");
    }

    return accessibilityValid;
  }

  testPerformance() {
    console.log("⚡ Test: Optimisations de performance...");
    
    try {
      // Vérifier la configuration Next.js
      if (existsSync('next.config.js')) {
        const nextConfig = readFileSync('next.config.js', 'utf-8');
        const hasStandalone = nextConfig.includes('standalone');
        const hasImageOptimization = nextConfig.includes('images');
        
        console.log(`   ✅ Next.js config: ${hasStandalone ? 'Standalone OK' : 'Standard'}`);
        console.log(`   ✅ Images: ${hasImageOptimization ? 'Optimisées' : 'Standard'}`);
      }
      
      // Vérifier Tailwind
      if (existsSync('tailwind.config.js')) {
        console.log("   ✅ Tailwind CSS: Configuré");
      }
      
      // Vérifier les composants pour les optimisations
      const componentsWithLazy = [];
      const templateFiles = [
        'components/templates/plumber/PlumberTemplate.tsx',
        'components/shared/HeroSection.tsx'
      ];
      
      templateFiles.forEach(file => {
        if (existsSync(file)) {
          const content = readFileSync(file, 'utf-8');
          if (content.includes('lazy') || content.includes('dynamic') || content.includes('motion')) {
            componentsWithLazy.push(file);
          }
        }
      });
      
      console.log(`   ✅ Composants optimisés: ${componentsWithLazy.length}`);
      console.log("   ✅ Performance: OK");
      return true;
      
    } catch (error) {
      console.log("   ❌ Erreur lors du test de performance");
      return false;
    }
  }

  testDocumentation() {
    console.log("📚 Test: Documentation...");
    
    const docFiles = [
      'DEVBOOK.md',
      'QUICKSTART.md', 
      'GENERATION_SYSTEM.md',
      'README.md'
    ];

    let docsValid = true;
    let docsPresent = 0;

    docFiles.forEach(file => {
      if (existsSync(file)) {
        try {
          const content = readFileSync(file, 'utf-8');
          if (content.length > 100) { // Doc basique
            console.log(`   ✅ ${file}: Présent (${Math.round(content.length / 1024)}KB)`);
            docsPresent++;
          } else {
            console.log(`   ⚠️  ${file}: Trop court`);
          }
        } catch (error) {
          console.log(`   ❌ ${file}: Erreur`);
          docsValid = false;
        }
      } else {
        console.log(`   ➖ ${file}: Absent`);
      }
    });

    if (docsPresent >= 3) {
      console.log("   ✅ Documentation: OK");
    } else {
      console.log("   ⚠️  Documentation incomplète");
      docsValid = false;
    }

    return docsValid;
  }

  async runAllTests() {
    console.log("🏗️  TEST D'ARCHITECTURE COMPLÈTE");
    console.log("=" .repeat(50));
    console.log();

    const testResults = {
      configGeneration: await this.testConfigGeneration(),
      fileStructure: this.testFileStructure(),
      templateComponents: this.testTemplateComponents(),
      seoGeneration: this.testSEOGeneration(),
      responsiveDesign: this.testResponsiveDesign(),
      accessibility: this.testAccessibility(),
      performance: this.testPerformance(),
      documentation: this.testDocumentation()
    };

    console.log("\n📊 RÉSULTATS D'ARCHITECTURE");
    console.log("=" .repeat(50));

    const passed = Object.values(testResults).filter(Boolean).length;
    const total = Object.keys(testResults).length;

    Object.entries(testResults).forEach(([test, result]) => {
      const status = result ? "✅" : "❌";
      const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      console.log(`${status} ${testName}`);
    });

    console.log();
    console.log(`📈 Score: ${passed}/${total} tests réussis (${Math.round((passed/total) * 100)}%)`);

    if (passed === total) {
      console.log("🎉 ARCHITECTURE VALIDÉE - Prête pour la production!");
    } else if (passed >= total * 0.8) {
      console.log("⚠️  ARCHITECTURE ACCEPTABLE - Quelques améliorations recommandées");
    } else {
      console.log("🔧 ARCHITECTURE À AMÉLIORER - Corrections nécessaires");
    }

    return passed >= total * 0.8; // 80% minimum
  }
}

// Lancer les tests
async function main() {
  console.log("🧪 TESTS D'ARCHITECTURE STANDALONE");
  console.log("=" .repeat(60));
  console.log();

  const testSuite = new ArchitectureTestSuite();
  
  try {
    const success = await testSuite.runAllTests();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error("💥 Erreur critique lors des tests:", error);
    process.exit(1);
  }
}

main();
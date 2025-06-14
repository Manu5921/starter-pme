#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

interface TestSuite {
  name: string;
  command: string;
  description: string;
  critical: boolean;
}

const testSuites: TestSuite[] = [
  {
    name: "Génération de base",
    command: "npm run test:generation",
    description: "Test des fonctions de génération de configuration et fichiers",
    critical: true
  },
  {
    name: "Architecture complète",
    command: "npm run test:architecture", 
    description: "Test de tous les composants de l'architecture",
    critical: true
  },
  {
    name: "Workflow d'intégration",
    command: "npm run test:workflow",
    description: "Test du workflow complet de création d'un site",
    critical: true
  }
];

interface TestResult {
  suite: string;
  success: boolean;
  output: string;
  duration: number;
  error?: string;
}

class FinalTestRunner {
  private results: TestResult[] = [];

  async runTestSuite(suite: TestSuite): Promise<TestResult> {
    console.log(`🧪 Exécution: ${suite.name}...`);
    const startTime = Date.now();

    try {
      const output = execSync(suite.command, { 
        encoding: 'utf8',
        timeout: 60000 // 1 minute max par test
      });
      
      const duration = Date.now() - startTime;
      
      console.log(`✅ ${suite.name} - ${duration}ms`);
      
      return {
        suite: suite.name,
        success: true,
        output,
        duration
      };
      
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorOutput = error instanceof Error ? error.message : 'Erreur inconnue';
      
      console.log(`❌ ${suite.name} - ${duration}ms`);
      console.log(`   Erreur: ${errorOutput.split('\n')[0]}`);
      
      return {
        suite: suite.name,
        success: false,
        output: '',
        duration,
        error: errorOutput
      };
    }
  }

  async runAllTests() {
    console.log("🚀 TESTS FINAUX DE LA PLATEFORME");
    console.log("=" .repeat(50));
    console.log();

    const startTime = Date.now();

    for (const suite of testSuites) {
      const result = await this.runTestSuite(suite);
      this.results.push(result);
      
      // Arrêter si un test critique échoue
      if (!result.success && suite.critical) {
        console.log(`\n⚠️  Test critique échoué: ${suite.name}`);
        console.log("🛑 Arrêt des tests");
        break;
      }
    }

    const totalDuration = Date.now() - startTime;
    this.generateFinalReport(totalDuration);
  }

  private generateFinalReport(totalDuration: number) {
    console.log("\n📊 RAPPORT FINAL DE TESTS");
    console.log("=" .repeat(50));

    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    const criticalTests = testSuites.filter(t => t.critical).length;
    const criticalPassed = this.results.filter(r => 
      r.success && testSuites.find(t => t.name === r.suite)?.critical
    ).length;

    // Résumé global
    console.log(`\n📈 Résumé global:`);
    console.log(`   ✅ Tests réussis: ${passedTests}/${totalTests}`);
    console.log(`   ❌ Tests échoués: ${failedTests}/${totalTests}`);
    console.log(`   🔥 Tests critiques réussis: ${criticalPassed}/${criticalTests}`);
    console.log(`   ⏱️  Durée totale: ${Math.round(totalDuration / 1000)}s`);
    console.log(`   📊 Taux de réussite: ${Math.round((passedTests/totalTests) * 100)}%`);

    // Détail par suite
    console.log(`\n📋 Détail des suites de tests:`);
    this.results.forEach(result => {
      const status = result.success ? "✅" : "❌";
      const suite = testSuites.find(t => t.name === result.suite);
      const criticalBadge = suite?.critical ? " [CRITIQUE]" : "";
      
      console.log(`   ${status} ${result.suite}${criticalBadge} (${result.duration}ms)`);
      console.log(`       ${suite?.description}`);
      
      if (!result.success && result.error) {
        console.log(`       ❌ ${result.error.split('\n')[0]}`);
      }
    });

    // Statut de la plateforme
    console.log(`\n🏆 STATUT DE LA PLATEFORME:`);
    
    if (criticalPassed === criticalTests) {
      console.log(`   🟢 PRÊTE POUR LA PRODUCTION`);
      console.log(`   🚀 Tous les tests critiques passent`);
      console.log(`   ✨ La plateforme peut être déployée`);
      
      this.generateProductionChecklist();
    } else {
      console.log(`   🟡 EN DÉVELOPPEMENT`);
      console.log(`   ⚠️  ${criticalTests - criticalPassed} test(s) critique(s) échoué(s)`);
      console.log(`   🔧 Corrections nécessaires avant production`);
      
      this.generateTodoList();
    }

    // Générer le rapport fichier
    this.generateReportFile(totalDuration);
    
    console.log(`\n✨ Tests finaux terminés !`);
  }

  private generateProductionChecklist() {
    console.log(`\n✅ CHECKLIST PRODUCTION:`);
    console.log(`   🔧 Configurer les variables d'environnement`);
    console.log(`   🗄️  Configurer la base de données de production`);
    console.log(`   🔑 Configurer les tokens Vercel`);
    console.log(`   🌐 Tester un déploiement réel`);
    console.log(`   📊 Configurer le monitoring`);
    console.log(`   💳 Intégrer le système de paiement`);
    console.log(`   📧 Configurer les notifications`);
  }

  private generateTodoList() {
    console.log(`\n📝 TODO AVANT PRODUCTION:`);
    
    const failedTests = this.results.filter(r => !r.success);
    failedTests.forEach(test => {
      console.log(`   🔧 Corriger: ${test.suite}`);
      if (test.error) {
        console.log(`       → ${test.error.split('\n')[0]}`);
      }
    });
  }

  private generateReportFile(totalDuration: number) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: this.results.length,
        passed: this.results.filter(r => r.success).length,
        failed: this.results.filter(r => !r.success).length,
        duration: totalDuration,
        successRate: Math.round((this.results.filter(r => r.success).length / this.results.length) * 100)
      },
      results: this.results,
      productionReady: this.results.filter(r => !r.success && testSuites.find(t => t.name === r.suite)?.critical).length === 0
    };

    try {
      writeFileSync('test-report.json', JSON.stringify(report, null, 2));
      console.log(`\n📄 Rapport sauvegardé: test-report.json`);
    } catch (error) {
      console.log(`\n⚠️  Impossible de sauvegarder le rapport`);
    }
  }
}

// Test des prérequis système
function checkSystemRequirements() {
  console.log("🔍 Vérification des prérequis système...\n");

  try {
    // Vérifier Node.js
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    console.log(`✅ Node.js: ${nodeVersion}`);

    // Vérifier npm
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`✅ npm: ${npmVersion}`);

    // Vérifier tsx
    try {
      execSync('npx tsx --version', { encoding: 'utf8' });
      console.log(`✅ tsx: Disponible`);
    } catch {
      console.log(`❌ tsx: Non trouvé`);
      throw new Error("tsx requis pour les tests");
    }

    console.log(`✅ Tous les prérequis sont satisfaits\n`);
    return true;

  } catch (error) {
    console.log(`❌ Prérequis manquants: ${error instanceof Error ? error.message : 'Erreur'}`);
    return false;
  }
}

// Point d'entrée principal
async function main() {
  console.log("🎯 TESTS FINAUX DE LA WEBSITE BUILDER PLATFORM");
  console.log("=" .repeat(60));
  console.log();

  // Vérifier les prérequis
  if (!checkSystemRequirements()) {
    console.log("🛑 Impossible de continuer sans les prérequis");
    process.exit(1);
  }

  const runner = new FinalTestRunner();
  
  try {
    await runner.runAllTests();
    process.exit(0);
  } catch (error) {
    console.error("💥 Erreur critique lors des tests finaux:", error);
    process.exit(1);
  }
}

main();
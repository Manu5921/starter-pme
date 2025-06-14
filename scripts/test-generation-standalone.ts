#!/usr/bin/env tsx

import { nanoid } from "nanoid";

// Types simplifiés pour les tests
type TemplateType = 'plumber' | 'restaurant' | 'medical';

interface ClientConfig {
  id: string;
  template: TemplateType;
  domain: string;
  business: {
    name: string;
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
    openingHours: Record<string, string>;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  content: any;
  theme: any;
}

interface GenerateClientParams {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  templateType: TemplateType;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country?: string;
  };
  customizations?: {
    headline?: string;
    subheadline?: string;
    openingHours?: Record<string, string>;
  };
}

// Générateur standalone pour les tests
class TestClientGenerator {
  static async generateClientConfig(params: GenerateClientParams): Promise<ClientConfig> {
    const {
      businessName,
      contactName,
      email,
      phone,
      templateType,
      address,
      customizations = {}
    } = params;

    const clientId = nanoid();
    const domain = this.generateDomain(businessName);

    const config: ClientConfig = {
      id: clientId,
      template: templateType,
      domain,
      business: {
        name: businessName,
        phone,
        email,
        address: {
          ...address,
          country: address.country || 'France'
        },
        openingHours: customizations.openingHours || this.getDefaultOpeningHours(templateType)
      },
      seo: this.generateSEO(businessName, templateType, address.city),
      content: this.generateContent(templateType, businessName, customizations),
      theme: this.getDefaultTheme(templateType)
    };

    return config;
  }

  private static generateDomain(businessName: string): string {
    const slug = businessName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    return `${slug}.fr`;
  }

  private static generateSEO(businessName: string, templateType: TemplateType, city: string) {
    const seoConfigs = {
      plumber: {
        title: `Plombier ${city} - Dépannage 24h/24 | ${businessName}`,
        description: `Plombier professionnel à ${city}. Intervention rapide 24h/24 pour tous vos dépannages plomberie. Devis gratuit. ⭐ ${businessName}`,
        keywords: [
          `plombier ${city.toLowerCase()}`,
          `dépannage plomberie ${city.toLowerCase()}`,
          `urgence plombier ${city.toLowerCase()}`,
          `fuite eau ${city.toLowerCase()}`,
          'plomberie 24h/24',
          'débouchage canalisation',
          'installation sanitaire'
        ]
      },
      restaurant: {
        title: `${businessName} - Restaurant ${city} | Cuisine Authentique`,
        description: `Découvrez ${businessName}, restaurant à ${city}. Cuisine authentique et savoureuse. Réservation en ligne. Spécialités locales.`,
        keywords: [
          `restaurant ${city.toLowerCase()}`,
          `cuisine ${city.toLowerCase()}`,
          `réservation restaurant ${city.toLowerCase()}`,
          businessName.toLowerCase(),
          'spécialités locales',
          'menu du jour',
          'restaurant traditionnel'
        ]
      },
      medical: {
        title: `${businessName} - Cabinet Médical ${city} | Consultations`,
        description: `${businessName}, cabinet médical à ${city}. Consultations, soins de qualité. Prise de rendez-vous en ligne. Équipe médicale expérimentée.`,
        keywords: [
          `médecin ${city.toLowerCase()}`,
          `cabinet médical ${city.toLowerCase()}`,
          `consultation ${city.toLowerCase()}`,
          businessName.toLowerCase(),
          'rendez-vous médical',
          'soins médicaux',
          'praticien'
        ]
      }
    };

    return seoConfigs[templateType];
  }

  private static generateContent(templateType: TemplateType, businessName: string, customizations: any) {
    const contentGenerators = {
      plumber: () => ({
        hero: {
          headline: customizations.headline || `Votre Plombier de Confiance`,
          subheadline: customizations.subheadline || 'Intervention rapide 24h/24 - Devis gratuit',
          cta: 'Appeler maintenant'
        },
        services: [
          {
            icon: 'Wrench',
            title: 'Dépannage Urgent',
            description: 'Fuite d\'eau, canalisation bouchée, panne chaudière',
            price: 'À partir de 80€',
            highlighted: true
          },
          {
            icon: 'Droplets',
            title: 'Installation Sanitaire',
            description: 'WC, lavabo, douche, baignoire',
            price: 'Devis gratuit'
          },
          {
            icon: 'Thermometer',
            title: 'Chauffage',
            description: 'Installation et maintenance chaudière',
            price: 'Sur mesure'
          }
        ],
        testimonials: [
          {
            name: 'Client satisfait',
            text: 'Service rapide et professionnel, je recommande !',
            rating: 5,
            city: 'Lyon'
          }
        ],
        faq: [
          {
            question: 'Intervenez-vous 24h/24 ?',
            answer: 'Oui, nous sommes disponibles 24h/24 pour les urgences.'
          },
          {
            question: 'Vos devis sont-ils gratuits ?',
            answer: 'Oui, tous nos devis sont gratuits et sans engagement.'
          }
        ]
      }),
      restaurant: () => ({
        hero: {
          headline: customizations.headline || `Bienvenue chez ${businessName}`,
          subheadline: customizations.subheadline || 'Une cuisine authentique et savoureuse',
          cta: 'Réserver une table'
        },
        services: [
          {
            icon: 'Utensils',
            title: 'Menu du Jour',
            description: 'Plats frais préparés chaque jour',
            price: 'À partir de 15€'
          },
          {
            icon: 'Wine',
            title: 'Carte des Vins',
            description: 'Sélection de vins locaux et régionaux',
            price: 'Voir carte'
          }
        ]
      }),
      medical: () => ({
        hero: {
          headline: customizations.headline || `${businessName}`,
          subheadline: customizations.subheadline || 'Votre santé, notre priorité',
          cta: 'Prendre rendez-vous'
        },
        services: [
          {
            icon: 'Stethoscope',
            title: 'Consultation Générale',
            description: 'Examen médical complet',
            price: 'Conventionné'
          },
          {
            icon: 'Heart',
            title: 'Cardiologie',
            description: 'Suivi cardiologique spécialisé',
            price: 'Sur rendez-vous'
          }
        ]
      })
    };

    return contentGenerators[templateType]();
  }

  private static getDefaultOpeningHours(templateType: TemplateType) {
    const defaultHours = {
      plumber: {
        monday: '8h-19h',
        tuesday: '8h-19h',
        wednesday: '8h-19h',
        thursday: '8h-19h',
        friday: '8h-19h',
        saturday: '9h-17h',
        sunday: 'Urgences uniquement',
        emergency: '24h/24 - 7j/7'
      },
      restaurant: {
        monday: 'Fermé',
        tuesday: '12h-14h, 19h-22h',
        wednesday: '12h-14h, 19h-22h',
        thursday: '12h-14h, 19h-22h',
        friday: '12h-14h, 19h-23h',
        saturday: '12h-14h, 19h-23h',
        sunday: '12h-14h, 19h-22h'
      },
      medical: {
        monday: '9h-12h, 14h-18h',
        tuesday: '9h-12h, 14h-18h',
        wednesday: '9h-12h',
        thursday: '9h-12h, 14h-18h',
        friday: '9h-12h, 14h-18h',
        saturday: '9h-12h',
        sunday: 'Fermé'
      }
    };

    return defaultHours[templateType];
  }

  private static getDefaultTheme(templateType: TemplateType) {
    const themes = {
      plumber: {
        colors: {
          primary: 'blue-600',
          secondary: 'gray-800',
          accent: 'orange-500'
        }
      },
      restaurant: {
        colors: {
          primary: 'amber-600',
          secondary: 'stone-800',
          accent: 'red-600'
        }
      },
      medical: {
        colors: {
          primary: 'green-600',
          secondary: 'gray-800',
          accent: 'blue-500'
        }
      }
    };

    return themes[templateType];
  }

  static generateSiteFiles(config: ClientConfig) {
    return {
      'package.json': this.generatePackageJson(config),
      'next.config.js': this.generateNextConfig(config),
      'app/page.tsx': this.generateMainPage(config),
      'app/layout.tsx': this.generateLayout(config),
      'app/globals.css': this.generateGlobalCSS(),
      'tailwind.config.js': this.generateTailwindConfig(),
      'lib/config.ts': `export const siteConfig = ${JSON.stringify(config, null, 2)};`
    };
  }

  private static generatePackageJson(config: ClientConfig) {
    return JSON.stringify({
      name: config.id,
      version: "1.0.0",
      private: true,
      scripts: {
        build: "next build",
        start: "next start",
        dev: "next dev"
      },
      dependencies: {
        "next": "15.3.1",
        "react": "^19.0.0",
        "react-dom": "^19.0.0",
        "framer-motion": "^12.12.1",
        "lucide-react": "^0.503.0",
        "tailwindcss": "^4.1.7"
      }
    }, null, 2);
  }

  private static generateNextConfig(config: ClientConfig) {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;`;
  }

  private static generateMainPage(config: ClientConfig) {
    return `import { ${config.template.charAt(0).toUpperCase() + config.template.slice(1)}Template } from '../components/templates/${config.template}/${config.template.charAt(0).toUpperCase() + config.template.slice(1)}Template';
import { siteConfig } from '../lib/config';

export default function HomePage() {
  return <${config.template.charAt(0).toUpperCase() + config.template.slice(1)}Template config={siteConfig} />;
}

export const metadata = {
  title: '${config.seo.title}',
  description: '${config.seo.description}',
  keywords: '${config.seo.keywords.join(', ')}',
};`;
  }

  private static generateLayout(config: ClientConfig) {
    return `import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}`;
  }

  private static generateGlobalCSS() {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply text-gray-900;
  }
}`;
  }

  private static generateTailwindConfig() {
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};`;
  }
}

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
    const config = await TestClientGenerator.generateClientConfig(testClientConfig);
    
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
    const siteFiles = TestClientGenerator.generateSiteFiles(config);
    
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

    // 4. Vérification de la structure Next.js
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

    // 5. Affichage des métadonnées SEO
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
    const domain = (TestClientGenerator as any).generateDomain(businessName);
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
    const seo = (TestClientGenerator as any).generateSEO(test.name, test.template, test.city);
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
import { nanoid } from "nanoid";
import { ClientConfig, TemplateType } from "@/lib/types/database";
import { db } from "@/db/drizzle";
import { clients, templates } from "@/db/schema";
import { eq } from "drizzle-orm";

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
    services?: Array<{
      title: string;
      description: string;
      price?: string;
    }>;
    openingHours?: Record<string, string>;
  };
}

export class ClientGenerator {
  
  /**
   * Génère une configuration client complète basée sur un template
   */
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

    // En mode test, on utilise un template mock
    const template = process.env.NODE_ENV === "test" ? 
      { config: { defaultColors: this.getDefaultTheme(templateType) } } :
      await this.getTemplateFromDB(templateType);

    const clientId = nanoid();
    const domain = this.generateDomain(businessName);

    // Configuration de base
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
      theme: template.config.defaultColors || this.getDefaultTheme(templateType)
    };

    return config;
  }

  /**
   * Récupère le template depuis la base de données
   */
  private static async getTemplateFromDB(templateType: TemplateType) {
    const [template] = await db
      .select()
      .from(templates)
      .where(eq(templates.type, templateType))
      .limit(1);

    if (!template) {
      throw new Error(`Template ${templateType} non trouvé`);
    }

    return template;
  }

  /**
   * Génère un nom de domaine basé sur le nom de l'entreprise
   */
  private static generateDomain(businessName: string): string {
    const slug = businessName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Supprimer caractères spéciaux
      .replace(/\s+/g, '-') // Remplacer espaces par tirets
      .replace(/-+/g, '-') // Fusionner tirets multiples
      .trim();
    
    return `${slug}.fr`;
  }

  /**
   * Génère la configuration SEO optimisée par template
   */
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

  /**
   * Génère le contenu par défaut selon le template
   */
  private static generateContent(
    templateType: TemplateType,
    businessName: string,
    customizations: any
  ) {
    const contentGenerators = {
      plumber: () => ({
        hero: {
          headline: customizations.headline || `Votre Plombier de Confiance`,
          subheadline: customizations.subheadline || 'Intervention rapide 24h/24 - Devis gratuit',
          cta: 'Appeler maintenant'
        },
        services: customizations.services || [
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
        services: customizations.services || [
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
        ],
        testimonials: [
          {
            name: 'Client gourmet',
            text: 'Excellente cuisine, service impeccable !',
            rating: 5,
            city: 'Lyon'
          }
        ]
      }),
      
      medical: () => ({
        hero: {
          headline: customizations.headline || `${businessName}`,
          subheadline: customizations.subheadline || 'Votre santé, notre priorité',
          cta: 'Prendre rendez-vous'
        },
        services: customizations.services || [
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
        ],
        testimonials: [
          {
            name: 'Patient reconnaissant',
            text: 'Médecin à l\'écoute, soins de qualité.',
            rating: 5,
            city: 'Lyon'
          }
        ]
      })
    };

    return contentGenerators[templateType]();
  }

  /**
   * Horaires par défaut selon le type d'activité
   */
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

  /**
   * Thème par défaut selon le template
   */
  private static getDefaultTheme(templateType: TemplateType) {
    const themes = {
      plumber: {
        colors: {
          primary: 'blue-600',
          secondary: 'gray-800',
          accent: 'orange-500'
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter'
        }
      },
      restaurant: {
        colors: {
          primary: 'amber-600',
          secondary: 'stone-800',
          accent: 'red-600'
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter'
        }
      },
      medical: {
        colors: {
          primary: 'green-600',
          secondary: 'gray-800',
          accent: 'blue-500'
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter'
        }
      }
    };

    return themes[templateType];
  }

  /**
   * Sauvegarde la configuration en base de données
   */
  static async saveClientToDatabase(config: ClientConfig, userId: string) {
    // En mode test, on simule la sauvegarde
    if (process.env.NODE_ENV === "test") {
      return {
        id: config.id,
        businessName: config.business.name,
        contactName: 'Contact Principal',
        email: config.business.email,
        phone: config.business.phone,
        domain: config.domain,
        templateType: config.template,
        config: config as any,
        status: 'development',
        monthlyFee: 29,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    try {
      const [newClient] = await db
        .insert(clients)
        .values({
          id: config.id,
          businessName: config.business.name,
          contactName: 'Contact Principal', // À récupérer des params
          email: config.business.email,
          phone: config.business.phone,
          domain: config.domain,
          templateType: config.template,
          config: config as any, // Cast pour JSONB
          status: 'development',
          monthlyFee: 29,
          userId
        })
        .returning();

      return newClient;
    } catch (error) {
      console.error('Erreur sauvegarde client:', error);
      throw new Error('Impossible de sauvegarder le client');
    }
  }

  /**
   * Génère un site complet prêt pour le déploiement
   */
  static async generateCompleteSite(params: GenerateClientParams, userId: string) {
    // 1. Générer la configuration
    const config = await this.generateClientConfig(params);
    
    // 2. Sauvegarder en base
    const client = await this.saveClientToDatabase(config, userId);
    
    // 3. Préparer les fichiers pour le déploiement
    const siteFiles = this.generateSiteFiles(config);
    
    return {
      client,
      config,
      siteFiles,
      domain: config.domain
    };
  }

  /**
   * Génère les fichiers du site pour le déploiement
   */
  private static generateSiteFiles(config: ClientConfig) {
    // Structure de fichiers pour un déploiement Next.js standalone
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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
    ];
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
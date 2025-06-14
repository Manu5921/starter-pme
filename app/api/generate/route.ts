import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ClientGenerator } from "@/lib/generators/client-generator";
import { VercelDeployer } from "@/lib/deployment/vercel-deployer";
import { z } from "zod";

// Schema de validation pour la génération de site
const generateSiteSchema = z.object({
  businessName: z.string().min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères"),
  contactName: z.string().min(2, "Le nom du contact doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  templateType: z.enum(["plumber", "restaurant", "medical"]),
  address: z.object({
    street: z.string().min(5, "Adresse incomplète"),
    city: z.string().min(2, "Ville requise"),
    postalCode: z.string().min(5, "Code postal invalide"),
    country: z.string().optional().default("France")
  }),
  customizations: z.object({
    headline: z.string().optional(),
    subheadline: z.string().optional(),
    services: z.array(z.object({
      title: z.string(),
      description: z.string(),
      price: z.string().optional()
    })).optional(),
    openingHours: z.record(z.string()).optional()
  }).optional(),
  deployImmediately: z.boolean().optional().default(false)
});

type GenerateSiteRequest = z.infer<typeof generateSiteSchema>;

// POST /api/generate - Génère un nouveau site client
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = generateSiteSchema.parse(body);

    console.log(`🎯 Génération de site pour: ${validatedData.businessName}`);

    // 1. Générer la configuration et sauvegarder en base
    const result = await ClientGenerator.generateCompleteSite(
      {
        businessName: validatedData.businessName,
        contactName: validatedData.contactName,
        email: validatedData.email,
        phone: validatedData.phone,
        templateType: validatedData.templateType,
        address: validatedData.address,
        customizations: validatedData.customizations
      },
      session.userId
    );

    console.log(`✅ Configuration générée pour ${result.config.business.name}`);

    let deploymentResult = null;

    // 2. Déployer immédiatement si demandé
    if (validatedData.deployImmediately) {
      try {
        console.log(`🚀 Démarrage du déploiement automatique...`);
        
        const deployer = new VercelDeployer();
        deploymentResult = await deployer.deploySite(
          result.client.id,
          result.config,
          result.siteFiles
        );

        console.log(`🎉 Déploiement réussi: ${deploymentResult.url}`);
      } catch (deploymentError) {
        console.error('❌ Erreur déploiement:', deploymentError);
        // Le site est créé mais pas déployé, on retourne quand même le succès
        // avec l'erreur de déploiement
      }
    }

    // 3. Préparer la réponse
    const response = {
      success: true,
      data: {
        client: result.client,
        config: result.config,
        domain: result.domain,
        previewUrl: `/dashboard/clients/${result.client.id}/preview`,
        deployment: deploymentResult ? {
          success: deploymentResult.success,
          url: deploymentResult.url,
          customDomain: deploymentResult.customDomain,
          vercelProjectId: deploymentResult.project.id
        } : null
      },
      message: deploymentResult 
        ? `Site généré et déployé avec succès pour ${validatedData.businessName}!`
        : `Site généré avec succès pour ${validatedData.businessName}. Déploiement manuel disponible.`
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error("❌ Erreur génération de site:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Erreur de validation",
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur interne du serveur" 
      },
      { status: 500 }
    );
  }
}

// GET /api/generate/templates - Récupère les templates disponibles
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Templates disponibles avec leurs caractéristiques
    const availableTemplates = [
      {
        id: 'plumber',
        name: 'Template Plombier',
        description: 'Template professionnel pour plombiers avec fonctionnalités d\'urgence 24h/24',
        features: [
          'Hero avec CTA urgence',
          'Grille de services',
          'Zone d\'intervention',
          'Témoignages clients',
          'FAQ complète',
          'Formulaire de contact'
        ],
        colors: {
          primary: 'blue-600',
          secondary: 'gray-800',
          accent: 'orange-500'
        },
        preview: '/templates/plumber/preview.jpg',
        estimatedTime: '5-10 minutes',
        complexity: 'Simple'
      },
      {
        id: 'restaurant',
        name: 'Template Restaurant',
        description: 'Template élégant pour restaurants avec showcase menu',
        features: [
          'Hero gastronomique',
          'Menu du jour',
          'Galerie photos',
          'Réservation',
          'Horaires d\'ouverture',
          'Localisation'
        ],
        colors: {
          primary: 'amber-600',
          secondary: 'stone-800',
          accent: 'red-600'
        },
        preview: '/templates/restaurant/preview.jpg',
        estimatedTime: '10-15 minutes',
        complexity: 'Moyen',
        status: 'Bientôt disponible'
      },
      {
        id: 'medical',
        name: 'Template Médical',
        description: 'Template professionnel pour cabinets médicaux',
        features: [
          'Design rassurant',
          'Services médicaux',
          'Équipe praticiens',
          'Prise de rendez-vous',
          'Informations pratiques',
          'Certifications'
        ],
        colors: {
          primary: 'green-600',
          secondary: 'gray-800',
          accent: 'blue-500'
        },
        preview: '/templates/medical/preview.jpg',
        estimatedTime: '10-15 minutes',
        complexity: 'Moyen',
        status: 'Bientôt disponible'
      }
    ];

    return NextResponse.json({
      success: true,
      data: availableTemplates
    });

  } catch (error) {
    console.error("Erreur récupération templates:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { clients, sites } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { VercelDeployer } from "@/lib/deployment/vercel-deployer";
import { ClientGenerator } from "@/lib/generators/client-generator";
import { z } from "zod";

const deploySchema = z.object({
  clientId: z.string().min(1, "Client ID requis"),
  forceRedeploy: z.boolean().optional().default(false)
});

// POST /api/deploy - Déploie un site client sur Vercel
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
    const { clientId, forceRedeploy } = deploySchema.parse(body);

    console.log(`🚀 Démarrage déploiement pour client: ${clientId}`);

    // 1. Récupérer les données du client
    const [client] = await db
      .select()
      .from(clients)
      .where(
        and(
          eq(clients.id, clientId),
          eq(clients.userId, session.userId)
        )
      )
      .limit(1);

    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client non trouvé" },
        { status: 404 }
      );
    }

    // 2. Vérifier si le site existe déjà
    const [existingSite] = await db
      .select()
      .from(sites)
      .where(eq(sites.clientId, clientId))
      .limit(1);

    if (existingSite && existingSite.status === 'ready' && !forceRedeploy) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Site déjà déployé. Utilisez forceRedeploy=true pour redéployer." 
        },
        { status: 409 }
      );
    }

    // 3. Générer les fichiers du site
    const config = client.config;
    const siteFiles = (ClientGenerator as any).generateSiteFiles(config);

    console.log(`📁 Fichiers générés pour ${client.businessName}`);

    // 4. Déployer sur Vercel
    const deployer = new VercelDeployer();
    let deploymentResult;

    if (existingSite && existingSite.vercelProjectId && forceRedeploy) {
      // Redéploiement
      console.log(`🔄 Redéploiement du site existant...`);
      deploymentResult = await deployer.redeploySite(clientId, siteFiles);
    } else {
      // Premier déploiement
      console.log(`🆕 Premier déploiement du site...`);
      deploymentResult = await deployer.deploySite(clientId, config, siteFiles);
    }

    // 5. Mettre à jour le statut du client
    await db
      .update(clients)
      .set({ 
        status: 'live',
        updatedAt: new Date()
      })
      .where(eq(clients.id, clientId));

    console.log(`✅ Déploiement réussi: ${deploymentResult.url}`);

    return NextResponse.json({
      success: true,
      data: {
        client: {
          id: client.id,
          businessName: client.businessName,
          domain: client.domain
        },
        deployment: {
          url: deploymentResult.url,
          customDomain: client.domain,
          vercelProjectId: deploymentResult.project?.id || existingSite?.vercelProjectId,
          deployedAt: new Date()
        }
      },
      message: `Site déployé avec succès pour ${client.businessName}!`
    });

  } catch (error) {
    console.error("❌ Erreur déploiement:", error);

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

// DELETE /api/deploy - Supprime un déploiement
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: "Client ID requis" },
        { status: 400 }
      );
    }

    // 1. Vérifier que le client appartient à l'utilisateur
    const [client] = await db
      .select()
      .from(clients)
      .where(
        and(
          eq(clients.id, clientId),
          eq(clients.userId, session.userId)
        )
      )
      .limit(1);

    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client non trouvé" },
        { status: 404 }
      );
    }

    // 2. Récupérer les infos du site
    const [site] = await db
      .select()
      .from(sites)
      .where(eq(sites.clientId, clientId))
      .limit(1);

    if (!site) {
      return NextResponse.json(
        { success: false, error: "Aucun déploiement trouvé" },
        { status: 404 }
      );
    }

    // 3. Supprimer le projet Vercel
    if (site.vercelProjectId) {
      const deployer = new VercelDeployer();
      await deployer.deleteDeployment(site.vercelProjectId);
    }

    // 4. Supprimer l'enregistrement du site
    await db
      .delete(sites)
      .where(eq(sites.id, site.id));

    // 5. Remettre le client en développement
    await db
      .update(clients)
      .set({ 
        status: 'development',
        updatedAt: new Date()
      })
      .where(eq(clients.id, clientId));

    return NextResponse.json({
      success: true,
      message: `Déploiement supprimé pour ${client.businessName}`
    });

  } catch (error) {
    console.error("❌ Erreur suppression déploiement:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur interne du serveur" 
      },
      { status: 500 }
    );
  }
}

// GET /api/deploy/status - Vérifie le statut d'un déploiement
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

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: "Client ID requis" },
        { status: 400 }
      );
    }

    // 1. Récupérer les infos du site
    const [siteInfo] = await db
      .select({
        site: sites,
        client: {
          id: clients.id,
          businessName: clients.businessName,
          domain: clients.domain,
          status: clients.status
        }
      })
      .from(sites)
      .innerJoin(clients, eq(sites.clientId, clients.id))
      .where(
        and(
          eq(sites.clientId, clientId),
          eq(clients.userId, session.userId)
        )
      )
      .limit(1);

    if (!siteInfo) {
      return NextResponse.json(
        { success: false, error: "Site non trouvé" },
        { status: 404 }
      );
    }

    // 2. Récupérer les stats Vercel si disponibles
    let vercelStats = null;
    if (siteInfo.site.vercelDeploymentId) {
      try {
        const deployer = new VercelDeployer();
        vercelStats = await deployer.getDeploymentStats(siteInfo.site.vercelDeploymentId);
      } catch (error) {
        console.warn('Impossible de récupérer les stats Vercel:', error);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        client: siteInfo.client,
        site: siteInfo.site,
        vercelStats,
        isLive: siteInfo.client.status === 'live' && siteInfo.site.status === 'ready'
      }
    });

  } catch (error) {
    console.error("❌ Erreur vérification statut:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur interne du serveur" 
      },
      { status: 500 }
    );
  }
}
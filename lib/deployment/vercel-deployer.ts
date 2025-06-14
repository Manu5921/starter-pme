import { ClientConfig } from "@/lib/types/database";
import { db } from "@/db/drizzle";
import { sites } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

interface VercelDeploymentOptions {
  projectName: string;
  domain: string;
  files: Record<string, string>;
  env?: Record<string, string>;
}

export class VercelDeployer {
  private apiToken: string;
  private teamId?: string;

  constructor() {
    this.apiToken = process.env.VERCEL_TOKEN!;
    this.teamId = process.env.VERCEL_TEAM_ID;
    
    if (!this.apiToken) {
      throw new Error('VERCEL_TOKEN environment variable is required');
    }
  }

  /**
   * Déploie un site client sur Vercel
   */
  async deploySite(
    clientId: string,
    config: ClientConfig,
    siteFiles: Record<string, string>
  ) {
    try {
      console.log(`🚀 Démarrage du déploiement pour ${config.business.name}...`);

      // 1. Créer le projet Vercel
      const project = await this.createProject(config);
      
      // 2. Créer le déploiement
      const deployment = await this.createDeployment(project.id, siteFiles);
      
      // 3. Configurer le domaine custom
      if (config.domain) {
        await this.addCustomDomain(project.id, config.domain);
      }
      
      // 4. Mettre à jour la base de données
      const siteRecord = await this.updateSiteRecord(clientId, {
        vercelProjectId: project.id,
        vercelDeploymentId: deployment.id,
        domain: config.domain,
        status: 'ready',
        deployedAt: new Date()
      });

      console.log(`✅ Déploiement réussi: ${deployment.url}`);
      
      return {
        success: true,
        project,
        deployment,
        site: siteRecord,
        url: deployment.url,
        customDomain: config.domain
      };

    } catch (error) {
      console.error('❌ Erreur déploiement:', error);
      
      // Marquer le site comme en erreur
      await this.updateSiteRecord(clientId, {
        status: 'error',
        buildLogs: error instanceof Error ? error.message : 'Erreur inconnue'
      });

      throw error;
    }
  }

  /**
   * Crée un projet Vercel
   */
  private async createProject(config: ClientConfig) {
    const projectName = config.id;
    
    const response = await fetch('https://api.vercel.com/v9/projects', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...(this.teamId && { 'X-Vercel-Team-Id': this.teamId })
      },
      body: JSON.stringify({
        name: projectName,
        framework: 'nextjs',
        buildCommand: 'npm run build',
        outputDirectory: '.next',
        installCommand: 'npm install',
        devCommand: 'npm run dev',
        environmentVariables: [
          {
            key: 'NODE_ENV',
            value: 'production',
            type: 'plain',
            target: ['production']
          }
        ],
        gitRepository: null // Déploiement direct sans Git
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur création projet Vercel: ${error}`);
    }

    return await response.json();
  }

  /**
   * Crée un déploiement Vercel
   */
  private async createDeployment(projectId: string, files: Record<string, string>) {
    // Convertir les fichiers au format attendu par Vercel
    const vercelFiles = Object.entries(files).map(([file, content]) => ({
      file,
      data: Buffer.from(content).toString('base64'),
      encoding: 'base64'
    }));

    const response = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...(this.teamId && { 'X-Vercel-Team-Id': this.teamId })
      },
      body: JSON.stringify({
        name: projectId,
        files: vercelFiles,
        projectSettings: {
          framework: 'nextjs',
          buildCommand: 'npm run build',
          outputDirectory: '.next',
          installCommand: 'npm install'
        },
        target: 'production'
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur création déploiement: ${error}`);
    }

    const deployment = await response.json();
    
    // Attendre que le déploiement soit terminé
    await this.waitForDeployment(deployment.id);
    
    return deployment;
  }

  /**
   * Ajoute un domaine custom au projet
   */
  private async addCustomDomain(projectId: string, domain: string) {
    try {
      const response = await fetch(`https://api.vercel.com/v9/projects/${projectId}/domains`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
          ...(this.teamId && { 'X-Vercel-Team-Id': this.teamId })
        },
        body: JSON.stringify({
          name: domain
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.warn(`Avertissement domaine custom: ${error}`);
        // Ne pas faire échouer le déploiement pour un problème de domaine
        return null;
      }

      return await response.json();
    } catch (error) {
      console.warn('Erreur ajout domaine custom:', error);
      return null;
    }
  }

  /**
   * Attend que le déploiement soit terminé
   */
  private async waitForDeployment(deploymentId: string, maxWaitTime = 300000) { // 5 minutes max
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      const response = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          ...(this.teamId && { 'X-Vercel-Team-Id': this.teamId })
        }
      });

      if (!response.ok) {
        throw new Error('Erreur vérification statut déploiement');
      }

      const deployment = await response.json();
      
      if (deployment.readyState === 'READY') {
        return deployment;
      }
      
      if (deployment.readyState === 'ERROR') {
        throw new Error(`Déploiement échoué: ${deployment.error?.message || 'Erreur inconnue'}`);
      }

      // Attendre 5 secondes avant de vérifier à nouveau
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    throw new Error('Timeout: Le déploiement a pris trop de temps');
  }

  /**
   * Met à jour l'enregistrement du site en base
   */
  private async updateSiteRecord(clientId: string, updates: Partial<{
    vercelProjectId: string;
    vercelDeploymentId: string;
    domain: string;
    status: string;
    deployedAt: Date;
    buildLogs: string;
  }>) {
    try {
      // Chercher s'il existe déjà un enregistrement
      const [existingSite] = await db
        .select()
        .from(sites)
        .where(eq(sites.clientId, clientId))
        .limit(1);

      if (existingSite) {
        // Mettre à jour
        const [updatedSite] = await db
          .update(sites)
          .set({
            ...updates,
            updatedAt: new Date()
          })
          .where(eq(sites.id, existingSite.id))
          .returning();
        
        return updatedSite;
      } else {
        // Créer nouveau
        const [newSite] = await db
          .insert(sites)
          .values({
            id: nanoid(),
            clientId,
            ...updates,
            ssl: true
          })
          .returning();
        
        return newSite;
      }
    } catch (error) {
      console.error('Erreur mise à jour site:', error);
      throw error;
    }
  }

  /**
   * Supprime un déploiement Vercel
   */
  async deleteDeployment(projectId: string) {
    try {
      const response = await fetch(`https://api.vercel.com/v9/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          ...(this.teamId && { 'X-Vercel-Team-Id': this.teamId })
        }
      });

      if (!response.ok) {
        throw new Error('Erreur suppression projet Vercel');
      }

      return true;
    } catch (error) {
      console.error('Erreur suppression déploiement:', error);
      throw error;
    }
  }

  /**
   * Redéploie un site existant
   */
  async redeploySite(clientId: string, siteFiles: Record<string, string>) {
    try {
      // Récupérer les infos du site existant
      const [site] = await db
        .select()
        .from(sites)
        .where(eq(sites.clientId, clientId))
        .limit(1);

      if (!site || !site.vercelProjectId) {
        throw new Error('Site non trouvé ou pas de projet Vercel associé');
      }

      // Créer un nouveau déploiement
      const deployment = await this.createDeployment(site.vercelProjectId, siteFiles);
      
      // Mettre à jour la base
      await this.updateSiteRecord(clientId, {
        vercelDeploymentId: deployment.id,
        status: 'ready',
        deployedAt: new Date()
      });

      return {
        success: true,
        deployment,
        url: deployment.url
      };
    } catch (error) {
      console.error('Erreur redéploiement:', error);
      throw error;
    }
  }

  /**
   * Obtient les statistiques d'un déploiement
   */
  async getDeploymentStats(deploymentId: string) {
    try {
      const response = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          ...(this.teamId && { 'X-Vercel-Team-Id': this.teamId })
        }
      });

      if (!response.ok) {
        throw new Error('Erreur récupération stats déploiement');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur stats déploiement:', error);
      return null;
    }
  }
}
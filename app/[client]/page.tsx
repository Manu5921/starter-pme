import { notFound } from "next/navigation";
import { db } from "@/db/drizzle";
import { clients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PlumberTemplate } from "@/components/templates/plumber/PlumberTemplate";
import { ClientConfig } from "@/lib/types/database";

interface ClientPageProps {
  params: {
    client: string;
  };
}

// Cette fonction récupère les données du client depuis la base de données
async function getClientData(clientSlug: string) {
  try {
    // Chercher le client par son domaine ou un slug généré
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.domain, `${clientSlug}.fr`)) // Ou toute autre logique de mapping
      .limit(1);

    if (!client) {
      return null;
    }

    return client;
  } catch (error) {
    console.error("Error fetching client data:", error);
    return null;
  }
}

export default async function ClientPage({ params }: ClientPageProps) {
  const clientData = await getClientData(params.client);

  if (!clientData) {
    notFound();
  }

  // Vérifier que le client a un site actif
  if (clientData.status !== 'live') {
    notFound();
  }

  // Convertir les données DB en format ClientConfig
  const config: ClientConfig = {
    id: clientData.id,
    template: clientData.templateType as 'plumber' | 'restaurant' | 'medical',
    domain: clientData.domain || '',
    business: clientData.config.business,
    seo: clientData.config.seo,
    content: clientData.config.content,
    theme: clientData.config.theme
  };

  // Router vers le bon template selon le type
  switch (config.template) {
    case 'plumber':
      return <PlumberTemplate config={config} />;
    case 'restaurant':
      // TODO: Implémenter RestaurantTemplate
      return <div>Restaurant template coming soon...</div>;
    case 'medical':
      // TODO: Implémenter MedicalTemplate  
      return <div>Medical template coming soon...</div>;
    default:
      notFound();
  }
}

// Générer les métadonnées SEO dynamiques
export async function generateMetadata({ params }: ClientPageProps) {
  const clientData = await getClientData(params.client);
  
  if (!clientData) {
    return {
      title: 'Page non trouvée',
      description: 'Cette page n\'existe pas'
    };
  }

  const seo = clientData.config.seo;
  const business = clientData.config.business;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords.join(', '),
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `https://${clientData.domain}`,
      siteName: business.name,
      images: seo.ogImage ? [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: seo.title
        }
      ] : [],
      locale: 'fr_FR',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : []
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    verification: {
      google: 'your-google-verification-code' // À configurer
    }
  };
}

// Générer les pages statiques pour de meilleures performances (optionnel)
export async function generateStaticParams() {
  // Récupérer tous les clients avec des sites actifs
  const activeClients = await db
    .select({
      domain: clients.domain
    })
    .from(clients)
    .where(eq(clients.status, 'live'));

  return activeClients
    .filter(client => client.domain)
    .map(client => ({
      client: client.domain!.replace('.fr', '') // Extraire le slug du domaine
    }));
}
import { ClientConfig } from "@/lib/types/database";

export const duboisPlomberieConfig: ClientConfig = {
  id: 'dubois-plomberie',
  template: 'plumber',
  domain: 'dubois-plomberie.fr',
  
  business: {
    name: 'Plomberie Dubois',
    logo: '/logos/dubois-plomberie.svg',
    phone: '06 12 34 56 78',
    email: 'contact@dubois-plomberie.fr',
    address: {
      street: '123 rue de la République',
      city: 'Lyon',
      postalCode: '69001',
      country: 'France'
    },
    openingHours: {
      monday: '8h-19h',
      tuesday: '8h-19h',
      wednesday: '8h-19h',
      thursday: '8h-19h',
      friday: '8h-19h',
      saturday: '9h-17h',
      sunday: 'Fermé',
      emergency: '24h/24 - 7j/7'
    }
  },
  
  seo: {
    title: 'Plombier Lyon - Dépannage 24h/24 | Plomberie Dubois',
    description: 'Plombier professionnel à Lyon. Intervention rapide 24h/24 pour tous vos dépannages plomberie. Devis gratuit. ⭐ Plus de 500 interventions réussies.',
    keywords: [
      'plombier lyon',
      'dépannage plomberie lyon',
      'urgence plombier lyon',
      'plomberie 24h/24 lyon',
      'fuite eau lyon',
      'débouchage canalisation lyon',
      'chaudière lyon',
      'installation sanitaire lyon'
    ],
    ogImage: '/og/dubois-plomberie.jpg'
  },
  
  content: {
    hero: {
      headline: 'Votre Plombier de Confiance à Lyon',
      subheadline: 'Intervention rapide 24h/24 - Devis gratuit - Plus de 15 ans d\'expérience',
      cta: 'Appeler maintenant',
      backgroundImage: '/templates/plumber/hero-bg.jpg',
      stats: [
        { value: '500+', label: 'Interventions réussies' },
        { value: '24h/7j', label: 'Disponibilité' },
        { value: '98%', label: 'Clients satisfaits' },
        { value: '< 30min', label: 'Délai moyen d\'intervention' }
      ]
    },
    
    services: [
      {
        icon: 'Wrench',
        title: 'Dépannage Urgent',
        description: 'Fuite d\'eau, canalisation bouchée, panne chaudière - Intervention rapide garantie sous 30 minutes',
        price: 'À partir de 80€',
        highlighted: true,
        features: [
          'Intervention en moins de 30 minutes',
          'Diagnostic gratuit sur place',
          'Devis transparent sans surprise',
          'Garantie 2 ans sur les réparations',
          'Matériel professionnel inclus'
        ]
      },
      {
        icon: 'Droplets',
        title: 'Installation Sanitaire',
        description: 'Installation et remplacement de WC, lavabo, douche, baignoire - Travail soigné et conforme aux normes',
        price: 'Devis gratuit',
        features: [
          'Matériel de qualité professionnelle',
          'Installation conforme aux normes NF',
          'Conseil personnalisé selon vos besoins',
          'SAV réactif et garantie étendue',
          'Nettoyage du chantier inclus'
        ]
      },
      {
        icon: 'Thermometer',
        title: 'Chauffage & Climatisation',
        description: 'Installation, maintenance et dépannage de chaudières gaz, fioul, électrique et climatiseurs',
        price: 'Sur mesure',
        features: [
          'Entretien annuel certifié',
          'Réparation tous modèles et marques',
          'Installation certifiée RGE',
          'Conseils économies d\'énergie',
          'Contrat de maintenance disponible'
        ]
      },
      {
        icon: 'Home',
        title: 'Rénovation Salle de Bain',
        description: 'Rénovation complète de salle de bain - De la conception à la finition',
        price: 'À partir de 3500€',
        features: [
          'Étude et conception 3D',
          'Carrelage et faïence',
          'Plomberie et électricité',
          'Menuiserie sur mesure',
          'Garantie décennale'
        ]
      },
      {
        icon: 'Droplets',
        title: 'Débouchage Canalisation',
        description: 'Débouchage professionnel par hydrocurage ou spirale électrique',
        price: 'À partir de 120€',
        features: [
          'Caméra d\'inspection incluse',
          'Localisation précise du bouchon',
          'Technique adaptée au problème',
          'Nettoyage complet des canalisations',
          'Conseils préventifs gratuits'
        ]
      },
      {
        icon: 'Shield',
        title: 'Détection de Fuite',
        description: 'Recherche de fuite non destructive avec matériel de pointe',
        price: 'À partir de 150€',
        features: [
          'Détection électronique avancée',
          'Localisation précise sans casse',
          'Rapport détaillé avec photos',
          'Réparation immédiate possible',
          'Pas de dégâts collatéraux'
        ]
      }
    ],
    
    testimonials: [
      {
        name: 'Marie Lemoine',
        text: 'Intervention très rapide pour une fuite d\'eau urgente. Jean est arrivé en 20 minutes, a diagnostiqué le problème rapidement et l\'a réparé proprement. Prix correct et travail de qualité !',
        rating: 5,
        city: 'Lyon 6ème',
        service: 'Dépannage urgence',
        image: '/testimonials/marie-l.jpg'
      },
      {
        name: 'Pierre Martin',
        text: 'Installation complète de ma nouvelle salle de bain. Travail parfaitement réalisé, dans les délais et le budget annoncé. Très professionnel, je recommande vivement !',
        rating: 5,
        city: 'Villeurbanne',
        service: 'Rénovation salle de bain',
        image: '/testimonials/pierre-m.jpg'
      },
      {
        name: 'Sophie Dubois',
        text: 'Entretien annuel de ma chaudière effectué rapidement et consciencieusement. Technicien compétent qui a pris le temps de m\'expliquer le fonctionnement. Excellent service !',
        rating: 5,
        city: 'Lyon 3ème',
        service: 'Entretien chauffage',
        image: '/testimonials/sophie-d.jpg'
      },
      {
        name: 'Laurent Moreau',
        text: 'Débouchage de canalisation avec inspection caméra. Problème résolu définitivement avec de précieux conseils pour éviter que ça se reproduise. Très satisfait du service.',
        rating: 5,
        city: 'Caluire-et-Cuire',
        service: 'Débouchage',
        image: '/testimonials/laurent-m.jpg'
      },
      {
        name: 'Isabelle Rousseau',
        text: 'Recherche de fuite invisible grâce à leur matériel de détection. Fuite trouvée sans avoir à casser les murs ! Réparation immédiate et garantie. Parfait !',
        rating: 5,
        city: 'Bron',
        service: 'Détection de fuite',
        image: '/testimonials/isabelle-r.jpg'
      },
      {
        name: 'Michel Garnier',
        text: 'Installation d\'un nouveau chauffe-eau en urgence. Intervention le jour même, installation propre et conseils d\'utilisation. Service irréprochable !',
        rating: 5,
        city: 'Saint-Priest',
        service: 'Installation',
        image: '/testimonials/michel-g.jpg'
      }
    ],
    
    faq: [
      {
        question: 'Intervenez-vous vraiment 24h/24 et 7j/7 ?',
        answer: 'Oui, nous sommes disponibles 24h/24 et 7j/7 pour toutes les urgences de plomberie. Nos techniciens peuvent intervenir en moins de 30 minutes sur Lyon et sa périphérie (dans un rayon de 30km). Pour les interventions de nuit, weekend et jours fériés, un supplément peut s\'appliquer.'
      },
      {
        question: 'Vos devis sont-ils vraiment gratuits ?',
        answer: 'Absolument ! Nous établissons tous nos devis gratuitement et sans aucun engagement de votre part. Le devis est détaillé, transparent et ne comporte aucun coût caché. Nous nous déplaçons gratuitement pour évaluer vos besoins, même si vous ne donnez pas suite.'
      },
      {
        question: 'Quelles garanties offrez-vous sur vos travaux ?',
        answer: 'Nous offrons une garantie de 2 ans sur tous nos travaux de réparation et installations. Pour les gros travaux (rénovation, installation complète), nous proposons une garantie décennale. De plus, nous utilisons uniquement des matériaux de qualité professionnelle avec leurs garanties constructeur.'
      },
      {
        question: 'Quels modes de paiement acceptez-vous ?',
        answer: 'Nous acceptons tous les modes de paiement : espèces, chèque, carte bancaire (avec terminal mobile), virement bancaire et Paypal. Pour les gros travaux, nous proposons des facilités de paiement en plusieurs fois sans frais supplémentaires.'
      },
      {
        question: 'Êtes-vous assurés et déclarés ?',
        answer: 'Bien sûr ! Nous sommes totalement assurés (responsabilité civile professionnelle et décennale) et parfaitement déclarés. Nous pouvons fournir toutes nos attestations d\'assurance et justificatifs légaux sur simple demande. Nous sommes également certifiés RGE pour les travaux de chauffage.'
      },
      {
        question: 'Puis-je obtenir un devis par téléphone ?',
        answer: 'Pour les dépannages simples, nous pouvons donner une estimation téléphonique. Cependant, pour un devis précis et définitif, nous préférons nous déplacer gratuitement pour évaluer exactement la situation. Cela nous permet de vous proposer la solution la plus adaptée et au meilleur prix.'
      },
      {
        question: 'Que se passe-t-il si le problème n\'est pas résolu ?',
        answer: 'Notre objectif est de résoudre votre problème dès la première intervention. Si toutefois ce n\'était pas le cas, nous revenons gratuitement jusqu\'à résolution complète du problème, dans le cadre de notre garantie. Votre satisfaction est notre priorité absolue.'
      },
      {
        question: 'Travaillez-vous avec les assurances ?',
        answer: 'Oui, nous travaillons régulièrement avec les compagnies d\'assurance. Nous pouvons vous accompagner dans vos démarches, fournir les justificatifs nécessaires et accepter la prise en charge directe par votre assureur selon les termes de votre contrat.'
      }
    ],
    
    gallery: [
      {
        src: '/gallery/plomberie-1.jpg',
        alt: 'Réparation fuite eau Lyon',
        caption: 'Réparation d\'urgence - Fuite sous évier'
      },
      {
        src: '/gallery/plomberie-2.jpg',
        alt: 'Installation sanitaire Lyon',
        caption: 'Installation complète salle de bain'
      },
      {
        src: '/gallery/plomberie-3.jpg',
        alt: 'Chaudière réparation Lyon',
        caption: 'Maintenance chaudière gaz'
      },
      {
        src: '/gallery/plomberie-4.jpg',
        alt: 'Débouchage canalisation Lyon',
        caption: 'Débouchage par hydrocurage'
      }
    ]
  },
  
  theme: {
    colors: {
      primary: 'blue-600',
      secondary: 'gray-800',
      accent: 'orange-500'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    }
  }
};
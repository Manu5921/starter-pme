# Website Builder Platform

Plateforme de création rapide de sites web pour PME/TPE avec templates modulaires.

## 🚀 Installation

### 1. Cloner et installer
```bash
git clone [repository-url]
cd website-builder-platform
npm install
```

### 2. Configuration base de données
```bash
# Copier le fichier d'environnement
cp .env.example .env

# Configurer votre DATABASE_URL dans .env
# Exemple pour Neon: postgresql://username:password@host/database
```

### 3. Initialiser la base de données
```bash
# Générer et appliquer les migrations
npm run db:generate
npm run db:migrate

# Créer les templates par défaut
npm run db:seed
```

### 4. Lancer le développement
```bash
npm run dev
```

## 📊 Structure de la base de données

### Tables principales
- **clients** - Informations des clients et configuration des sites
- **sites** - Déploiements et status des sites
- **templates** - Templates disponibles (plumber, restaurant, medical)
- **payments** - Paiements et facturation
- **site_analytics** - Statistiques des sites
- **support_tickets** - Support client

## 🎯 API Endpoints

### Clients
- `GET /api/clients` - Liste tous les clients
- `POST /api/clients` - Créer un nouveau client
- `GET /api/clients/[id]` - Détails d'un client
- `PUT /api/clients/[id]` - Modifier un client
- `DELETE /api/clients/[id]` - Supprimer un client

### Sites
- `GET /api/sites` - Liste tous les sites
- `POST /api/sites` - Créer un nouveau déploiement

### Templates
- `GET /api/templates` - Liste des templates disponibles
- `POST /api/templates` - Créer templates par défaut

### Dashboard
- `GET /api/dashboard/stats` - Statistiques du dashboard

## 🎨 Templates disponibles

### 1. Plumber (Plombier)
- **Couleurs** : Blue-600, Gray-800, Orange-500
- **Sections** : Hero, Services, Zone intervention, Processus, Témoignages, FAQ, Contact
- **Features** : Contact urgence 24h/24, Carte zone intervention, Grille tarifaire

### 2. Restaurant
- **Couleurs** : Amber-600, Stone-800, Red-600  
- **Sections** : Hero, À propos, Menu, Galerie, Réservation, Témoignages, Localisation
- **Features** : Showcase menu, Galerie photos, Réservation en ligne

### 3. Medical (Médical)
- **Couleurs** : Green-600, Gray-800, Blue-500
- **Sections** : Hero, Services, Équipe, Rendez-vous, Informations, Témoignages, Contact
- **Features** : Profils médecins, Prise de rendez-vous, Certifications

## 🛠 Scripts utiles

```bash
# Base de données
npm run db:generate    # Générer migration
npm run db:migrate     # Appliquer migration  
npm run db:studio      # Interface Drizzle Studio
npm run db:seed        # Créer templates par défaut

# Développement
npm run dev           # Serveur de développement
npm run build         # Build production
npm run lint          # Linter
```

## 🏗 Workflow de production

### 1. Créer un client
```typescript
const client = {
  businessName: "Plomberie Dubois",
  contactName: "Jean Dubois", 
  email: "jean@dubois-plomberie.fr",
  phone: "06 12 34 56 78",
  templateType: "plumber",
  config: {
    business: { /* infos business */ },
    seo: { /* config SEO */ },
    content: { /* contenu personnalisé */ },
    theme: { /* couleurs et polices */ }
  }
}
```

### 2. Générer le site
- Sélection du template
- Application de la configuration client
- Génération des pages optimisées

### 3. Déploiement
- Build automatique
- Déploiement sur Vercel
- Configuration domaine custom

## 📱 Dashboard Features

### Vue d'ensemble
- Revenus total et croissance mensuelle
- Nombre de sites actifs
- Clients actifs
- Templates les plus utilisés

### Gestion clients
- Liste des clients avec filtres
- Statut des sites (développement/live)
- Informations de contact
- Historique des paiements

### Monitoring sites
- Performance Lighthouse
- Statistiques de visite
- Uptime monitoring
- Gestion des domaines

## 🎯 Objectifs de performance

- **Temps de chargement** : < 2 secondes
- **Score Lighthouse** : > 95 sur toutes les métriques
- **Bundle size** : < 150KB initial
- **SEO Score** : > 95
- **Accessibilité** : WCAG 2.1 AA

## 🔧 Configuration avancée

### Variables d'environnement
```env
# Base de données
DATABASE_URL="postgresql://..."

# Authentification
BETTER_AUTH_SECRET="your-secret"
BETTER_AUTH_URL="http://localhost:3000"

# Vercel (déploiement automatique)
VERCEL_TOKEN="your-token"
VERCEL_TEAM_ID="your-team-id"

# Stripe (paiements)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Personnalisation templates
Les templates sont configurables via le fichier `config` de chaque client :

```typescript
const config: ClientConfig = {
  template: 'plumber',
  business: { /* infos métier */ },
  content: { 
    hero: { /* contenu hero */ },
    services: [ /* liste services */ ]
  },
  theme: {
    colors: { /* palette couleurs */ }
  }
}
```

## 🚦 Status du projet

### ✅ Terminé
- [x] Backoffice admin complet
- [x] Structure base de données
- [x] API CRUD clients/sites/templates  
- [x] Dashboard avec statistiques
- [x] Authentification Better Auth
- [x] Types TypeScript complets

### 🔄 En cours
- [ ] Template Plombier complet
- [ ] Système de génération automatique
- [ ] Déploiement Vercel automatisé

### 📋 À faire
- [ ] Templates Restaurant & Médical
- [ ] Système de paiement Stripe
- [ ] Analytics intégrées
- [ ] Monitoring automatique

## 📞 Support

Pour toute question ou problème, consulter le [DEVBOOK.md](./DEVBOOK.md) pour la documentation complète du projet.
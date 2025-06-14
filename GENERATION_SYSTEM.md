# Système de Génération et Déploiement Automatique

## 📋 Vue d'ensemble

Le système de génération automatique permet de créer et déployer des sites clients en quelques minutes à partir de templates prédéfinis.

## 🏗 Architecture

### Composants principaux

1. **ClientGenerator** - Génère la configuration et les fichiers du site
2. **VercelDeployer** - Gère le déploiement sur Vercel
3. **API Routes** - Endpoints pour l'interface utilisateur
4. **Dashboard UI** - Interface de création de clients

## 🚀 Workflow de génération

### 1. Saisie des informations client
```typescript
const clientData = {
  businessName: "Plomberie Dubois",
  contactName: "Jean Dubois",
  email: "contact@dubois-plomberie.fr",
  phone: "06 12 34 56 78",
  templateType: "plumber",
  address: {
    street: "123 rue de la République",
    city: "Lyon",
    postalCode: "69001"
  },
  customizations: {
    headline: "Votre Plombier de Confiance",
    subheadline: "Intervention 24h/24"
  }
};
```

### 2. Génération automatique
- **Configuration SEO** optimisée par ville et métier
- **Contenu par défaut** adapté au template
- **Domaine automatique** basé sur le nom d'entreprise
- **Thème de couleurs** selon l'activité

### 3. Fichiers générés
```
site-client/
├── package.json          # Dependencies Next.js
├── next.config.js         # Configuration Next.js
├── app/
│   ├── page.tsx          # Page principale avec template
│   ├── layout.tsx        # Layout global
│   └── globals.css       # Styles Tailwind
├── tailwind.config.js    # Configuration Tailwind
└── lib/
    └── config.ts         # Configuration du site
```

### 4. Déploiement Vercel
- **Projet Vercel** créé automatiquement
- **Build et déploiement** via API Vercel
- **Domaine custom** configuré (optionnel)
- **Surveillance** du statut de déploiement

## 📡 API Endpoints

### POST /api/generate
Génère un nouveau site client

**Body:**
```json
{
  "businessName": "Plomberie Dubois",
  "contactName": "Jean Dubois", 
  "email": "contact@dubois-plomberie.fr",
  "phone": "06 12 34 56 78",
  "templateType": "plumber",
  "address": {
    "street": "123 rue de la République",
    "city": "Lyon",
    "postalCode": "69001"
  },
  "customizations": {
    "headline": "Titre personnalisé",
    "subheadline": "Sous-titre personnalisé"
  },
  "deployImmediately": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "client": { "id": "...", "businessName": "..." },
    "config": { /* Configuration complète */ },
    "domain": "plomberie-dubois.fr",
    "deployment": {
      "url": "https://plomberie-dubois.vercel.app",
      "customDomain": "plomberie-dubois.fr"
    }
  }
}
```

### POST /api/deploy
Déploie un site client existant

**Body:**
```json
{
  "clientId": "client-id-here",
  "forceRedeploy": false
}
```

### GET /api/deploy/status?clientId=xxx
Vérifie le statut d'un déploiement

### GET /api/generate/templates
Liste des templates disponibles

## 🎨 Templates Disponibles

### Template Plombier ✅
- **Status:** Disponible
- **Sections:** Hero, Services, Zone intervention, Processus, Témoignages, FAQ, Contact
- **Couleurs:** Blue-600, Gray-800, Orange-500
- **Features:** CTA urgence 24h/24, Zone d'intervention, Grille tarifaire

### Template Restaurant 🔄
- **Status:** En développement
- **Sections:** Hero, Menu, Galerie, Réservation, Témoignages, Contact
- **Couleurs:** Amber-600, Stone-800, Red-600

### Template Médical 🔄
- **Status:** En développement  
- **Sections:** Hero, Services, Équipe, Rendez-vous, Informations, Contact
- **Couleurs:** Green-600, Gray-800, Blue-500

## 🛠 Configuration

### Variables d'environnement requises
```env
# Vercel API
VERCEL_TOKEN=your_vercel_token_here
VERCEL_TEAM_ID=your_team_id_here (optionnel)

# Base de données
DATABASE_URL=postgresql://...

# Authentification
BETTER_AUTH_SECRET=your_secret_here
```

### Permissions Vercel
Le token Vercel doit avoir les permissions :
- Créer des projets
- Créer des déploiements
- Gérer les domaines
- Lire les statistiques

## 🧪 Tests

### Test de génération locale
```bash
npm run test:generation
```

### Test complet avec déploiement
1. Configurer les variables d'environnement Vercel
2. Utiliser l'interface `/dashboard/clients/new`
3. Activer "Déployer automatiquement"

## 📊 Monitoring

### Métriques disponibles
- **Temps de génération** (configuration + fichiers)
- **Temps de déploiement** sur Vercel
- **Statut des sites** (building, ready, error)
- **Performance Lighthouse** (à implémenter)

### Dashboard
- Vue d'ensemble des sites déployés
- Statut en temps réel
- Logs de déploiement
- Analytics basiques

## 🔧 Personnalisation

### Ajouter un nouveau template
1. Créer le composant template dans `/components/templates/`
2. Ajouter la configuration par défaut dans `ClientGenerator`
3. Mettre à jour le router dans `/app/[client]/page.tsx`
4. Ajouter aux templates disponibles dans l'API

### Modifier la génération SEO
Éditer les méthodes dans `ClientGenerator`:
- `generateSEO()` - Métadonnées et mots-clés
- `generateContent()` - Contenu par défaut
- `getDefaultTheme()` - Couleurs et polices

### Personnaliser le déploiement
Modifier `VercelDeployer`:
- `createProject()` - Configuration du projet
- `createDeployment()` - Paramètres de build
- `addCustomDomain()` - Gestion des domaines

## 🚨 Troubleshooting

### Erreur de génération
1. Vérifier la configuration du template
2. Contrôler les données d'entrée (validation Zod)
3. Examiner les logs de `ClientGenerator`

### Erreur de déploiement Vercel
1. Vérifier le token Vercel et les permissions
2. Contrôler les variables d'environnement
3. Vérifier la structure des fichiers générés
4. Examiner les logs Vercel via l'API

### Site non accessible
1. Vérifier le statut dans la base de données
2. Contrôler la configuration du domaine
3. Tester l'URL Vercel directe
4. Vérifier les DNS si domaine custom

## 📈 Roadmap

### Améliorations prévues
- [ ] Templates Restaurant et Médical
- [ ] Générateur de contenu IA
- [ ] Analytics intégrées
- [ ] Optimisation images automatique
- [ ] A/B testing des templates
- [ ] CDN et optimisation performance
- [ ] Backup et versioning des sites

### Intégrations futures
- [ ] Stripe pour paiements clients
- [ ] Google Analytics automatique
- [ ] Monitoring uptime
- [ ] Notifications email/SMS
- [ ] API clients pour mises à jour

## 💡 Bonnes pratiques

### Performance
- Générer les fichiers en streaming pour gros sites
- Cache des configurations fréquentes
- Optimisation des images avant déploiement
- Minification CSS/JS automatique

### Sécurité
- Validation stricte des entrées utilisateur
- Sanitisation du contenu généré
- Limitation du taux de génération
- Isolation des déploiements clients

### Maintenance
- Logs détaillés de toutes les opérations
- Monitoring automatique des déploiements
- Tests automatisés sur les templates
- Documentation à jour du code

---

*Dernière mise à jour : 13/06/2025*
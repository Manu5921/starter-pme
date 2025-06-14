# 🚀 Guide de Démarrage Rapide

## Installation et Configuration

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration de l'environnement
```bash
# Copier le fichier d'exemple
cp .env.test .env.local

# Éditer les variables d'environnement
# - DATABASE_URL: URL de votre base de données
# - BETTER_AUTH_SECRET: Clé secrète pour l'authentification
# - VERCEL_TOKEN: Token Vercel pour le déploiement (optionnel)
```

### 3. Configuration de la base de données
```bash
# Générer les migrations
npm run db:generate

# Appliquer les migrations
npm run db:migrate

# Créer les templates par défaut
npm run db:seed
```

## Tests et Validation

### 4. Lancer les tests complets
```bash
# Tests rapides de génération
npm run test:generation

# Tests d'architecture complète
npm run test:architecture

# Tests de workflow d'intégration
npm run test:workflow

# Rapport final complet
npm run test:final
```

### 5. Démarrer le serveur de développement
```bash
npm run dev
```

Accéder à : http://localhost:3000

## Utilisation

### 6. Premier test - Page de démo
Visitez http://localhost:3000/demo pour voir le template plombier en action.

### 7. Dashboard admin
1. Aller sur http://localhost:3000/sign-up
2. Créer un compte admin
3. Accéder au dashboard sur http://localhost:3000/dashboard

### 8. Créer votre premier site client
1. Dans le dashboard, cliquer sur "New Client Site"
2. Choisir le template "Plombier"
3. Remplir les informations client
4. Générer le site
5. (Optionnel) Déployer automatiquement

## Structure des Tests

### Tests disponibles

| Script | Description | Durée | Critique |
|--------|-------------|-------|----------|
| `test:generation` | Test des fonctions de génération | ~5s | ✅ |
| `test:architecture` | Test de tous les composants | ~10s | ✅ |
| `test:workflow` | Test du workflow complet | ~15s | ✅ |
| `test:final` | Rapport complet avec checklist | ~30s | ✅ |

### Métriques de qualité vérifiées

- ✅ Génération de configuration
- ✅ Génération de fichiers Next.js
- ✅ SEO optimisé par géolocalisation
- ✅ Design responsive (mobile-first)
- ✅ Accessibilité WCAG 2.1 AA
- ✅ Performance optimisée
- ✅ Structure Next.js valide

## Déploiement en Production

### 9. Configuration Vercel (optionnel)
```bash
# Obtenir un token Vercel sur vercel.com
# Ajouter au .env.local :
VERCEL_TOKEN=your_token_here
VERCEL_TEAM_ID=your_team_id_here
```

### 10. Test de déploiement
1. Configurer les variables Vercel
2. Créer un site test dans le dashboard
3. Activer "Déployer automatiquement"
4. Vérifier le déploiement sur Vercel

## Troubleshooting

### Erreurs communes

**Base de données non accessible :**
```bash
# Vérifier la connexion
npm run db:studio
```

**Tests échoués :**
```bash
# Voir les détails
npm run test:final
# Le rapport indique les corrections nécessaires
```

**Déploiement Vercel échoué :**
- Vérifier le token Vercel
- Vérifier les permissions du token
- Consulter les logs dans le dashboard

### Commandes utiles

```bash
# Nettoyer et recommencer
rm -rf node_modules package-lock.json
npm install

# Régénérer la base de données
npm run db:generate
npm run db:migrate
npm run db:seed

# Voir la base de données
npm run db:studio

# Tests individuels
npm run test:generation     # Test de base
npm run test:architecture   # Test complet
npm run test:workflow      # Test d'intégration
```

## Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | Linter ESLint |
| `npm run db:generate` | Générer migrations DB |
| `npm run db:migrate` | Appliquer migrations |
| `npm run db:studio` | Interface Drizzle Studio |
| `npm run db:seed` | Créer données d'exemple |
| `npm run test:*` | Différents niveaux de tests |

## Prochaines Étapes

1. ✅ **Tests passent** → Plateforme prête
2. 🔧 **Configuration production** → Variables d'environnement
3. 🚀 **Premier déploiement** → Site test sur Vercel
4. 📈 **Monitoring** → Analytics et performance
5. 💰 **Monétisation** → Intégration paiements

## Support

- 📖 Documentation complète : `DEVBOOK.md`
- 🛠 Système de génération : `GENERATION_SYSTEM.md`
- 🧪 Rapport de tests : `test-report.json` (après tests)
- 🐛 Issues : Consulter les logs de tests pour diagnostics

---

✨ **La plateforme est prête à générer des sites professionnels en quelques minutes !**
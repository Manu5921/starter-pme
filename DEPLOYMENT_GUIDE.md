# 🚀 GUIDE DE DÉPLOIEMENT PRODUCTION

## 📋 Checklist Déploiement

### ✅ Étapes de Déploiement

#### **1. Base de Données Neon PostgreSQL**
- [ ] Créer un compte Neon (https://neon.tech)
- [ ] Créer une nouvelle base de données
- [ ] Récupérer la DATABASE_URL
- [ ] Exécuter les migrations Drizzle

#### **2. Variables d'Environnement**
- [ ] Configurer .env.production
- [ ] Générer BETTER_AUTH_SECRET
- [ ] Configurer VERCEL_TOKEN (optionnel)

#### **3. Déploiement Vercel**
- [ ] Connecter le repository GitHub
- [ ] Configurer les variables d'environnement
- [ ] Déployer et tester

#### **4. Configuration Domaine**
- [ ] Acheter un domaine (optionnel)
- [ ] Configurer DNS
- [ ] SSL automatique

---

## 🔧 Instructions Détaillées

### **Étape 1 : Configuration Neon Database**

1. **Créer un compte Neon**
   ```
   → Aller sur https://neon.tech
   → Créer un compte gratuit
   → Créer un nouveau projet "website-builder-prod"
   ```

2. **Récupérer la DATABASE_URL**
   ```
   Format : postgresql://username:password@host/database?sslmode=require
   ```

3. **Configurer les migrations**
   ```bash
   # Copier DATABASE_URL dans .env.local
   npm run db:generate
   npm run db:migrate
   ```

### **Étape 2 : Variables d'Environnement Production**

```bash
# .env.production
DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require"
BETTER_AUTH_SECRET="ton_secret_cryptographique_fort_32_chars_min"
BETTER_AUTH_URL="https://ton-domaine.vercel.app"
NODE_ENV="production"
NEXT_PUBLIC_APP_ENV="production"

# Optionnel pour déploiement automatique
VERCEL_TOKEN="ton_token_vercel"
VERCEL_TEAM_ID="ton_team_id"
```

### **Étape 3 : Déploiement Vercel**

1. **Via Dashboard Vercel**
   ```
   → Aller sur https://vercel.com
   → Import Git Repository
   → Sélectionner ton repo GitHub
   → Configurer les variables d'environnement
   → Deploy
   ```

2. **Via CLI (alternative)**
   ```bash
   npm i -g vercel
   vercel login
   vercel --prod
   ```

### **Étape 4 : Configuration DNS (Optionnel)**

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

---

## 🧪 Tests Post-Déploiement

### **Tests Essentiels**
- [ ] Page d'accueil accessible
- [ ] Authentification fonctionnelle
- [ ] Dashboard admin accessible
- [ ] Template /demo affiché
- [ ] API routes répondent
- [ ] Base de données connectée

### **URLs à Tester**
```
https://ton-site.vercel.app/          # Page d'accueil
https://ton-site.vercel.app/demo      # Template plombier
https://ton-site.vercel.app/dashboard # Dashboard admin
https://ton-site.vercel.app/sign-up   # Inscription
```

---

## 🚨 Troubleshooting

### **Erreurs Communes**

1. **Database Connection Failed**
   ```
   Solution : Vérifier DATABASE_URL et whitelist IP Neon
   ```

2. **Build Failed - Module Not Found**
   ```
   Solution : npm install && npm run build localement
   ```

3. **Auth Errors**
   ```
   Solution : Vérifier BETTER_AUTH_SECRET et BETTER_AUTH_URL
   ```

4. **Functions Timeout**
   ```
   Solution : Optimiser les requêtes DB ou upgrader Vercel plan
   ```

---

## 📊 Métriques de Succès

- ✅ **Déploiement** : < 5 minutes
- ✅ **Page Load** : < 3 secondes
- ✅ **Auth Flow** : Fonctionnel
- ✅ **API Response** : < 1 seconde
- ✅ **SEO Score** : > 90/100

---

*Guide créé le 14/06/2025 pour Website Builder Platform*
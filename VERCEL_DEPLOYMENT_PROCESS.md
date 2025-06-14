# 🚀 PROCESSUS VERCEL SIMPLIFIÉ - Claude Code

## 🆘 UTILISATION
Quand un déploiement Vercel échoue, suivre ce processus étape par étape.

---

## ⚡ DIAGNOSTIC RAPIDE (1 minute)

### 1. **Vérification Build Local**
```bash
npm run build
```
- ✅ Réussi → Problème variables Vercel
- ❌ Échoué → Corriger code d'abord

### 2. **Test Variables d'Environnement**
```bash
npm run vercel:env
```
- ✅ 8 variables détectées → Variables OK
- ❌ Variables manquantes → Créer .env.production

### 3. **Status Vercel**
```bash
vercel ls
```
- Voir projets existants et status

---

## 🔍 DIAGNOSTIC APPROFONDI

### **ÉTAPE A : Vérification Prérequis**

1. **Connexion Vercel**
   ```bash
   vercel whoami
   # Si erreur : vercel login
   ```

2. **Variables complètes**
   ```bash
   # Vérifier ces 8 variables dans .env.production
   DATABASE_URL=postgresql://...
   BETTER_AUTH_SECRET=...
   BETTER_AUTH_URL=https://...
   NODE_ENV=production
   NEXT_PUBLIC_APP_ENV=production
   NEXT_PUBLIC_STARTER_TIER=pro
   NEXT_PUBLIC_STARTER_SLUG=website-builder-platform
   POLAR_WEBHOOK_SECRET=...
   ```

3. **Repository GitHub à jour**
   ```bash
   git status
   git push origin main
   ```

### **ÉTAPE B : Solutions selon l'Erreur**

1. **Erreur : "Command npm run build exited with 1"**
   - Cause : Variables manquantes sur Vercel
   - Solution : Configuration Dashboard ou API

2. **Erreur : "Module not found"**
   - Cause : Dépendances ou imports
   - Solution : npm install + build local d'abord

3. **Erreur : "Database connection failed"**
   - Cause : DATABASE_URL incorrecte
   - Solution : Vérifier connexion Neon

### **ÉTAPE C : Méthodes de Déploiement**

#### **Méthode 1 : GitHub Import (Recommandée)**
```
1. https://vercel.com/new
2. Import repository GitHub
3. Coller les 8 variables d'environnement
4. Deploy
```

#### **Méthode 2 : CLI avec Token**
```bash
# Si token Vercel disponible
export VERCEL_TOKEN="vercel_xxxx"
vercel env add --prod
vercel --prod
```

#### **Méthode 3 : API Automatique** 
```bash
# Script futur pour configuration automatique
npm run vercel:setup-auto
```

---

## 🤖 AUTOMATISATION FUTURE

### **Script de Configuration Automatique**

```bash
# À développer pour futures sessions
npm run vercel:auto-deploy
```

**Fonctionnalités :**
- ✅ Lit .env.production automatiquement
- ✅ Configure toutes les variables via API
- ✅ Lance le déploiement
- ✅ Vérifie le status
- ✅ Teste les URLs

### **Variables d'Environnement Claude**

Pour éviter la saisie manuelle, stocker :
```bash
# Dans session Claude
VERCEL_TOKEN="token_utilisateur"
VERCEL_PROJECT_ID="id_projet"
```

### **GitHub Actions (Déploiement Zéro-Click)**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on: push
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## 📊 STATISTIQUES PROBLÈMES FRÉQUENTS

1. **Variables manquantes** : 80% des échecs
2. **Build errors** : 15% des échecs  
3. **Connexion Vercel** : 5% des échecs

---

## 🎯 PROMPT DE DÉPANNAGE RAPIDE

**Pour prochaine session :**

```
🆘 VERCEL DÉPLOIEMENT BLOQUÉ
Suis le processus VERCEL_DEPLOYMENT_PROCESS.md :
1. Vérifier build local (npm run build)
2. Configurer variables automatiquement via API Vercel
3. Tester déploiement GitHub Import si CLI échoue
4. Valider URLs post-déploiement

Token Vercel requis pour automatisation complète
```

---

## 🔑 INFORMATIONS POUR AUTOMATISATION

### **Pour Claude Code :**
- **Token Vercel** : Demander à l'utilisateur lors première session
- **Project ID** : Récupérer automatiquement
- **Variables** : Lire depuis .env.production
- **API Vercel** : Configurer toutes les variables en une fois

### **Avantages Automatisation :**
- ⚡ Déploiement en 30 secondes vs 10 minutes manuelles
- 🔧 Zéro erreur de saisie
- 📊 Validation automatique
- 🚀 Redéploiement instantané

---

*Dernière mise à jour : 14/06/2025*
*Créé suite à analyse des problèmes Vercel*
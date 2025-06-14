# ⚡ PROMPT RAPIDE - VERCEL DÉPLOIEMENT BLOQUÉ

## 🆘 PHRASE MAGIQUE POUR CLAUDE CODE

```
VERCEL DÉPLOIEMENT BLOQUÉ - Execute le processus de diagnostic :
1. Vérifier build local (npm run build)
2. Utiliser script automatique (npm run vercel:auto)
3. Configurer variables via API Vercel si token disponible
4. Méthode GitHub Import si automatisation échoue
5. Tests post-déploiement URLs principales

Référence : Session 2025-06-14 - Website Builder Platform
```

## 🔧 COMMANDES DE SECOURS
```bash
# Diagnostic express
npm run build && vercel whoami

# Automatisation avancée
npm run vercel:auto

# Configuration manuelle
npm run vercel:env

# Déploiement force
vercel --prod --force
```

## ✅ SOLUTION TYPE
90% des problèmes Vercel = **Variables d'environnement manquantes**

## 🤖 AUTOMATISATION POUR CLAUDE

### **Questions pour l'utilisateur :**
1. "As-tu un token Vercel ? (https://vercel.com/account/tokens)"
2. "Préfères-tu GitHub Import ou CLI ?"
3. "Dois-je configurer les variables automatiquement ?"

### **Informations à stocker :**
- Token Vercel (si fourni)
- Project ID Vercel
- Méthode de déploiement préférée

### **Script d'automatisation :**
```bash
# Si token disponible
export VERCEL_TOKEN="user_token"
npm run vercel:auto  # → Déploiement 100% automatique

# Sinon
npm run vercel:env   # → Guide configuration manuelle
```

## 📊 MÉTRIQUES D'AMÉLIORATION

| Avant | Après |
|-------|-------|
| 10+ minutes manuelles | 30 secondes automatique |
| 8 variables à saisir | 0 saisie manuelle |
| Multiple échecs possibles | Validation pré-déploiement |
| Interface complexe | Commands simples |

## 🎯 OBJECTIF FUTURE SESSION

**Déploiement en une commande :**
```bash
npm run deploy:prod
```

**Résultat attendu :**
- ✅ Build validé
- ✅ Variables configurées automatiquement  
- ✅ Déploiement réussi
- ✅ URLs testées
- ✅ Status confirmé

---

*Guide créé le 14/06/2025 pour simplification déploiement Vercel*
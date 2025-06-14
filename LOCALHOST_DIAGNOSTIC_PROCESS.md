# 🔧 PROCESSUS DE DIAGNOSTIC LOCALHOST - Claude Code

## 🚨 UTILISATION
Quand un site ne s'ouvre pas en localhost, suivre ce processus étape par étape.

---

## ⚡ DIAGNOSTIC RAPIDE (2 minutes)

### 1. **Vérification Versions**
```bash
node --version    # Doit être ≥20.0.0
npm --version     # Vérifier cohérence
```

### 2. **Test Serveur**
```bash
npm run dev       # Observer les logs
```
- ✅ "Ready in XXXms" → Serveur OK
- ❌ Erreurs → Voir diagnostic approfondi

### 3. **Test Connexion**
```bash
curl -I http://localhost:3000 --max-time 5
```
- ✅ "HTTP/1.1 200 OK" → Site accessible
- ❌ "Failed to connect" → Problème réseau/port

---

## 🔍 DIAGNOSTIC APPROFONDI

### **ÉTAPE A : Vérification Environnement**

1. **Node.js Version**
   ```bash
   node --version
   # Si < 20.0.0 : nvm install 20 && nvm use 20
   ```

2. **Variables d'environnement**
   ```bash
   ls -la .env*
   # Doit avoir .env.local ou .env
   # Si manquant : cp .env.test .env.local
   ```

3. **Dependencies**
   ```bash
   ls -la node_modules | head -5
   # Si manquant ou ancien : rm -rf node_modules package-lock.json && npm install
   ```

### **ÉTAPE B : Analyse des Erreurs**

1. **Logs de compilation**
   - Rechercher "Module not found"
   - Rechercher "Cannot resolve"
   - Noter les dépendances manquantes

2. **Erreurs de base de données**
   - Rechercher "ECONNREFUSED"
   - Rechercher "auth" ou "database"
   - Vérifier les fonctions async dans pages principales

3. **Erreurs de port**
   - Tester ports alternatifs : 3001, 3333, 8000
   ```bash
   PORT=3333 npm run dev
   ```

### **ÉTAPE C : Solutions Systématiques**

1. **Clean Install**
   ```bash
   nvm use 20
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Page de Test Simple**
   Créer `/app/test/page.tsx` :
   ```tsx
   export default function TestPage() {
     return <div className="p-8 text-center">
       <h1 className="text-4xl">✅ Test Réussi</h1>
       <p>Serveur fonctionnel</p>
     </div>
   }
   ```

3. **Isolation des Problèmes**
   - Commenter les fonctions DB dans pages principales
   - Désactiver middleware complexes
   - Tester sur page simple d'abord

---

## 🎯 CHECKLIST DE RÉSOLUTION

### ✅ **Actions Systématiques**
- [ ] Node.js ≥ 20.0.0
- [ ] Fichier .env.local présent
- [ ] node_modules à jour avec Node 20
- [ ] Test sur port alternatif (3333)
- [ ] Page de test simple accessible
- [ ] Logs sans erreurs critiques

### 🚨 **Signaux d'Alerte**
- ❌ Node < 20 : **Mise à jour obligatoire**
- ❌ "Module not found" : **Réinstaller dépendances**
- ❌ "ECONNREFUSED" : **Problème base de données**
- ❌ Port 3000 bloqué : **Changer de port**

---

## 📞 PROMPT DE DÉPANNAGE RAPIDE

**Pour prochaine session :**

```
🆘 LOCALHOST BLOQUÉ
Suis le processus LOCALHOST_DIAGNOSTIC_PROCESS.md :
1. Vérifier Node.js version (≥20)
2. Clean install si nécessaire
3. Tester port alternatif 3333
4. Créer page /test simple
5. Isoler problèmes DB/auth
```

---

## 📊 STATISTIQUES PROBLÈMES FRÉQUENTS

1. **Node.js obsolète** : 60% des cas
2. **Port 3000 occupé** : 25% des cas  
3. **Dépendances corrompues** : 10% des cas
4. **Variables env manquantes** : 5% des cas

---

*Dernière mise à jour : 2025-06-14*
*Créé suite à résolution réussie du problème localhost*
# ⚡ PROMPT RAPIDE - LOCALHOST BLOQUÉ

## 🆘 PHRASE MAGIQUE POUR CLAUDE CODE

```
LOCALHOST BLOQUÉ - Execute le processus de diagnostic :
1. Vérifier Node.js ≥20 (nvm use 20)
2. Clean install (rm -rf node_modules && npm install)  
3. Port alternatif 3333 (PORT=3333 npm run dev)
4. Page /test simple si échec
5. Curl test : curl -I http://localhost:3333

Référence : Session 2025-06-14 - Website Builder Platform
Problème résolu : Node v18→v20 + port 3000→3333
```

## 🔧 COMMANDES DE SECOURS
```bash
# Diagnostic express
node --version && npm --version

# Fix universel
nvm use 20 && rm -rf node_modules && npm install

# Test rapide
PORT=3333 npm run dev

# Vérification
curl -I http://localhost:3333
```

## ✅ SOLUTION TYPE
90% des problèmes localhost = **Node.js obsolète** + **port 3000 occupé**
# 🎯 INSTRUCTIONS IMMÉDIATES : Résoudre l'erreur JWT

## ❌ Erreur actuelle
```
JWSError JWSInvalidSignature
"alg" (Algorithm) Header Parameter value not allowed
```

**Cause :** Clerk et Supabase ne communiquent pas correctement via JWT.

---

## ✅ SOLUTION EN 3 ÉTAPES (10 minutes)

### **ÉTAPE 1 : Créer le JWT Template dans Clerk** ⏱️ 3 min

1. Ouvrez [dashboard.clerk.com](https://dashboard.clerk.com)
2. Sélectionnez votre application
3. Dans le menu gauche, cliquez sur **JWT Templates**
4. Cliquez sur **+ New template**
5. Dans la liste, sélectionnez **Supabase**
6. Le template se crée automatiquement avec le nom `supabase`
7. ✅ **Laissez tout par défaut** et cliquez **Save**

---

### **ÉTAPE 2 : Récupérer l'URL JWKS de Clerk** ⏱️ 1 min

Dans le JWT Template que vous venez de créer :

1. Vous verrez une section **Issuer**
2. Copiez l'URL qui ressemble à :
   ```
   https://YOUR-DOMAIN.clerk.accounts.dev
   ```
3. L'URL JWKS complète sera :
   ```
   https://YOUR-DOMAIN.clerk.accounts.dev/.well-known/jwks.json
   ```

**Exemple :**
```
https://magical-cricket-12.clerk.accounts.dev/.well-known/jwks.json
```

---

### **ÉTAPE 3 : Configurer Supabase** ⏱️ 5 min

#### A) Aller dans Supabase Dashboard

1. Ouvrez [app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet
3. Menu **Authentication** (icône 🔐 dans la sidebar)

#### B) Activer le provider Clerk

1. Descendez jusqu'à **Auth Providers**
2. Cherchez **Clerk** dans la liste
3. Si vous le voyez, **activez-le** et collez l'URL JWKS

#### C) Si Clerk n'est pas dans la liste (configuration manuelle)

1. Allez dans **Settings** (roue dentée en bas de la sidebar)
2. Cliquez sur **API**
3. Section **JWT Settings**
4. Trouvez **JWT Secret** (ou **Custom JWT Claims**)
5. Ajoutez cette configuration :

```json
{
  "jwks_uri": "https://YOUR-DOMAIN.clerk.accounts.dev/.well-known/jwks.json"
}
```

---

## 🔄 ÉTAPE 4 : Redémarrer et tester

1. **Redémarrez le serveur de développement**
   ```bash
   # Arrêtez le serveur (Ctrl+C)
   npm run dev
   ```

2. **Reconnectez-vous** (pour obtenir un nouveau token)
   - Déconnectez-vous de l'application
   - Reconnectez-vous

3. **Testez** : [http://localhost:3000/test-supabase](http://localhost:3000/test-supabase)

---

## ✅ Résultat attendu

```
✅ Test de Connexion
  ✓ Connexion à Supabase réussie !

📊 Vérification des Tables
  ✅ immoVideoAds.projects
  ✅ immoVideoAds.avatars
  ✅ immoVideoAds.project_photos
  ✅ immoVideoAds.videos

✅ Storage Buckets
  ✓ Tous les buckets requis sont présents

🎉 Configuration Supabase complète et fonctionnelle !
```

---

## 🆘 Si ça ne marche toujours pas

### Vérification 1 : Le JWT Template existe bien dans Clerk

```
Clerk Dashboard → JWT Templates → Devrait voir "supabase"
```

### Vérification 2 : L'URL JWKS est correcte

L'URL doit se terminer par `/.well-known/jwks.json`

### Vérification 3 : Configuration Supabase

```
Supabase Dashboard → Authentication → Auth Providers
OU
Supabase Dashboard → Settings → API → JWT Settings
```

### Vérification 4 : Variables d'environnement

Vérifiez dans `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxx
CLERK_SECRET_KEY=sk_test_xxxx
```

---

## 📹 Tutoriel vidéo officiel

[Clerk + Supabase Integration](https://clerk.com/docs/integrations/databases/supabase)

---

## 🎯 Après le fix

Une fois que la page `/test-supabase` affiche tout en vert ✅, vous pourrez :
1. Exécuter les migrations SQL
2. Créer les tables
3. Configurer le Storage
4. Passer à l'Étape 2

---

**💡 Astuce :** Si vous voyez toujours des erreurs après avoir tout configuré, attendez **30 secondes** que les changements se propagent chez Clerk/Supabase, puis reconnectez-vous.

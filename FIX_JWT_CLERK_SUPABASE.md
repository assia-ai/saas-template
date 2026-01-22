# 🚨 FIX : Erreur JWT Clerk ↔ Supabase

## ❌ Problème identifié

```
JWSError JWSInvalidSignature
"alg" (Algorithm) Header Parameter value not allowed
```

**Cause :** Supabase n'accepte pas les JWT tokens de Clerk car l'intégration n'est pas configurée.

---

## ✅ Solution : Configurer l'intégration Clerk ↔ Supabase

### **Étape 1 : Créer le JWT Template dans Clerk**

1. Allez sur [dashboard.clerk.com](https://dashboard.clerk.com)
2. Sélectionnez votre application
3. Menu **JWT Templates** (dans la sidebar)
4. Cliquez **+ New template**
5. Sélectionnez **Supabase** dans la liste

### **Étape 2 : Configurer le template**

Le template Supabase sera pré-configuré avec :
- **Name :** `supabase` (par défaut)
- **Claims :** Les claims requis par Supabase

**Important :** Notez le nom du template (généralement `supabase`)

### **Étape 3 : Récupérer le Signing Secret**

Dans le JWT Template que vous venez de créer :
1. Copiez le **JWKS Endpoint URL** (quelque chose comme `https://xxxxx.clerk.accounts.dev/.well-known/jwks.json`)
2. OU copiez directement le **Signing Secret** si affiché

### **Étape 4 : Configurer Supabase pour accepter les JWT Clerk**

#### Option A : Via Dashboard Supabase (Recommandé)

1. Allez sur [app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet
3. Menu **Authentication** → **Providers**
4. Faites défiler jusqu'à **Custom** ou **Third-party**
5. Cherchez **Clerk** ou **Custom JWT Provider**

**Si l'option Clerk existe :**
- Activez-la
- Collez le **JWKS Endpoint URL** de Clerk

**Si vous devez configurer manuellement :**

Allez dans **Settings** → **API** → **JWT Settings** et ajoutez :

```json
{
  "jwk_url": "https://YOUR_CLERK_FRONTEND_API/.well-known/jwks.json"
}
```

#### Option B : Via SQL (Si l'interface ne suffit pas)

Exécutez cette commande SQL dans le SQL Editor de Supabase :

```sql
-- Vérifier la configuration JWT actuelle
SELECT * FROM auth.config;

-- Note: La configuration JWT se fait généralement via l'interface
-- ou les variables d'environnement du projet Supabase
```

### **Étape 5 : Mettre à jour vos variables d'environnement**

Dans votre `.env.local`, ajoutez :

```env
# Clerk - JWT Template Name
NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME=supabase
```

### **Étape 6 : Mettre à jour le client Supabase**

Modifiez `lib/supabase.ts` pour utiliser le bon template JWT :

```typescript
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import type { Database } from "@/lib/types/database.types";

export const createSupabaseClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: async () => {
          const token = await (await auth()).getToken({
            template: "supabase", // 👈 Nom du JWT Template Clerk
          });
          
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
      },
    }
  );
};
```

---

## 🔄 Étapes de configuration détaillées

### **1️⃣ Configuration Clerk (Dashboard Clerk)**

```
1. Dashboard Clerk → JWT Templates
2. + New template
3. Sélectionner "Supabase"
4. Nom: "supabase"
5. Copier le JWKS URL affiché
   Format: https://xxxxx.clerk.accounts.dev/.well-known/jwks.json
```

### **2️⃣ Configuration Supabase (Dashboard Supabase)**

**Méthode recommandée :**

```
1. Supabase Dashboard → Settings → API
2. Section "JWT Settings"
3. Coller le JWKS URL de Clerk
4. Sauvegarder
```

**OU via Authentication :**

```
1. Supabase Dashboard → Authentication → Providers
2. Activer "Custom Provider"
3. Configurer avec les infos Clerk
```

### **3️⃣ Variables d'environnement complètes**

Mettez à jour votre `.env.local` :

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxx
CLERK_SECRET_KEY=sk_test_xxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# JWT Template (Important!)
NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME=supabase
```

---

## 📝 Fichier à modifier

Créez ce fichier pour mettre à jour le client Supabase :

**Fichier : `lib/supabase.ts`**

```typescript
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import type { Database } from "@/lib/types/database.types";

export const createSupabaseClient = async () => {
  const authObj = await auth();
  
  // Récupérer le token avec le template Supabase
  const token = await authObj.getToken({
    template: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME || "supabase",
  });

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    }
  );
};
```

---

## 🧪 Après la configuration

1. **Redémarrez le serveur de développement**
   ```bash
   npm run dev
   ```

2. **Reconnectez-vous** (pour obtenir un nouveau token JWT)

3. **Testez à nouveau** : `http://localhost:3000/test-supabase`

---

## 📚 Documentation officielle

- [Clerk + Supabase Integration](https://clerk.com/docs/integrations/databases/supabase)
- [Supabase JWT Authentication](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

---

## ✅ Résultat attendu après fix

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
```

---

## 🎯 Checklist de résolution

- [ ] JWT Template "Supabase" créé dans Clerk Dashboard
- [ ] JWKS URL copié depuis Clerk
- [ ] JWKS URL configuré dans Supabase (Settings → API → JWT Settings)
- [ ] Variable `NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME=supabase` ajoutée
- [ ] Fichier `lib/supabase.ts` mis à jour avec `getToken({ template: "supabase" })`
- [ ] Serveur redémarré
- [ ] Déconnexion/reconnexion pour nouveau token
- [ ] Test `/test-supabase` réussi ✅

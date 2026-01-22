# 🎯 GUIDE RAPIDE : Exécution Étape 1

## ⚡ Actions Immédiates

### 1️⃣ Ouvrir Supabase Dashboard

```
https://app.supabase.com
```

Sélectionnez votre projet **ImmoVideoAds**

---

### 2️⃣ Exécuter les 3 migrations SQL

#### Migration 1 : Créer les tables

1. Menu **SQL Editor** → **New Query**
2. Ouvrir le fichier : `supabase/migrations/001_create_tables.sql`
3. Copier tout le contenu
4. Coller dans le SQL Editor
5. Cliquer **Run** ▶️
6. ✅ Devrait afficher "Success"

#### Migration 2 : Configurer la sécurité (RLS)

1. **New Query**
2. Ouvrir : `supabase/migrations/002_rls_policies.sql`
3. Copier/Coller
4. **Run** ▶️
5. ✅ "Success"

#### Migration 3 : Configurer le Storage

1. **New Query**
2. Ouvrir : `supabase/migrations/003_storage_setup.sql`
3. Copier/Coller
4. **Run** ▶️
5. ✅ "Success"

---

### 3️⃣ Vérifier dans Supabase

#### Vérifier les tables
- Menu **Table Editor**
- Chercher le schéma `immoVideoAds`
- Vérifier la présence de :
  - ✅ projects
  - ✅ avatars
  - ✅ project_photos
  - ✅ videos

#### Vérifier le Storage
- Menu **Storage**
- Vérifier la présence de :
  - ✅ project-photos (public)
  - ✅ avatars (public)

---

### 4️⃣ Tester en local

```bash
# Démarrer le serveur
npm run dev
```

Visitez :
```
http://localhost:3000/test-supabase
```

**Résultat attendu :**
```
✅ Test de Connexion
✅ Vérification des Tables (4/4)
✅ Storage Buckets (2/2)

🎉 Configuration Supabase complète et fonctionnelle !
```

---

## 📸 Captures d'écran attendues

### Supabase Table Editor
Vous devriez voir :
```
Schema: immoVideoAds
├── projects        (4 columns)
├── avatars         (4 columns)
├── project_photos  (6 columns)
├── videos          (9 columns)
```

### Supabase Storage
```
Buckets:
├── project-photos  [public]  10MB max
└── avatars        [public]   5MB max
```

### Page /test-supabase
Tous les indicateurs en **VERT** ✅

---

## 🚨 En cas d'erreur

### Erreur : "schema immoVideoAds does not exist"
→ **Normal** : Le schéma existe déjà depuis `supabase_schema.sql`
→ Les tables seront créées dedans automatiquement

### Erreur : "permission denied"
→ Vérifiez que vous êtes connecté avec un compte admin sur Supabase

### Test page montre ❌ rouge
→ Les migrations SQL n'ont pas été exécutées correctement
→ Recommencez les 3 migrations dans l'ordre

---

## ✅ Checklist de validation

Avant de me notifier que c'est terminé :

- [ ] 3 migrations SQL exécutées sans erreur
- [ ] 4 tables visibles dans Table Editor
- [ ] 2 buckets visibles dans Storage
- [ ] Page `/test-supabase` affiche tout en ✅ vert
- [ ] Capture d'écran de la page de test (optionnel)

---

## 📞 Prêt pour validation ?

Une fois tous les tests passés, **notifiez-moi** avec :

1. ✅ "Étape 1 complétée"
2. Capture d'écran de `/test-supabase` (optionnel)
3. Confirmation que tous les tests sont verts

Je validerai et nous passerons à l'**Étape 2** ! 🚀

---

## 🎯 Récapitulatif des fichiers créés

```
saas-template/
├── supabase/
│   └── migrations/
│       ├── 001_create_tables.sql      ✅
│       ├── 002_rls_policies.sql       ✅
│       ├── 003_storage_setup.sql      ✅
│       └── README.md                  ✅
├── lib/
│   ├── types/
│   │   └── database.types.ts          ✅
│   └── supabase.ts                    ✅ (mis à jour)
├── app/
│   └── test-supabase/
│       └── page.tsx                   ✅
├── ETAPE_1_COMPLETE.md                ✅
└── GUIDE_RAPIDE_ETAPE_1.md            ✅ (ce fichier)
```

**Total : 9 fichiers créés/modifiés** 🎉

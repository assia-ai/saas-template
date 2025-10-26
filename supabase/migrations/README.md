# 📦 Migrations Supabase - ImmoVideoAds

Ce dossier contient toutes les migrations SQL pour configurer la base de données Supabase.

## 🗂️ Fichiers de migration

### 001_create_tables.sql
Crée les 4 tables principales du schéma `immoVideoAds` :
- **projects** : Projets immobiliers des utilisateurs
- **avatars** : Avatars uploadés pour générer les vidéos
- **project_photos** : Photos des logements
- **videos** : Vidéos générées par l'IA

### 002_rls_policies.sql
Configure Row Level Security (RLS) pour sécuriser l'accès aux données :
- Les utilisateurs ne peuvent accéder qu'à leurs propres données
- Utilise l'authentification JWT de Clerk via Supabase

### 003_storage_setup.sql
Configure Supabase Storage pour les uploads :
- **Bucket `project-photos`** : Photos de logements (10MB max, formats image)
- **Bucket `avatars`** : Photos d'avatars (5MB max, formats image)
- Politiques de sécurité pour uploads/accès

## 🚀 Comment exécuter les migrations

### Option 1 : Via Supabase Dashboard (Recommandé)

1. Allez sur [app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Créez une nouvelle query
5. Copiez/collez le contenu de chaque fichier **dans l'ordre** :
   - `001_create_tables.sql`
   - `002_rls_policies.sql`
   - `003_storage_setup.sql`
6. Exécutez chaque query

### Option 2 : Via Supabase CLI

```bash
# Installer le CLI Supabase
npm install -g supabase

# Se connecter à votre projet
supabase link --project-ref VOTRE_PROJECT_REF

# Exécuter les migrations
supabase db push
```

## ✅ Vérification

Après avoir exécuté les migrations, visitez :
```
http://localhost:3000/test-supabase
```

Cette page de test vérifiera automatiquement :
- ✓ Connexion à Supabase
- ✓ Existence des 4 tables
- ✓ Configuration des buckets Storage

## 🔑 Configuration requise

Assurez-vous d'avoir ces variables d'environnement dans `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

## 📊 Structure de données

```
immoVideoAds (schema)
├── projects
│   ├── id (UUID, PK)
│   ├── user_id (TEXT, Clerk ID)
│   ├── title (TEXT)
│   ├── description (TEXT)
│   ├── status (TEXT: draft|processing|completed|failed)
│   ├── created_at (TIMESTAMPTZ)
│   └── updated_at (TIMESTAMPTZ)
│
├── avatars
│   ├── id (UUID, PK)
│   ├── user_id (TEXT, Clerk ID)
│   ├── name (TEXT)
│   ├── avatar_url (TEXT, Supabase Storage URL)
│   └── created_at (TIMESTAMPTZ)
│
├── project_photos
│   ├── id (UUID, PK)
│   ├── project_id (UUID, FK → projects)
│   ├── photo_url (TEXT, Supabase Storage URL)
│   ├── is_selected (BOOLEAN)
│   ├── display_order (INTEGER)
│   └── created_at (TIMESTAMPTZ)
│
└── videos
    ├── id (UUID, PK)
    ├── project_id (UUID, FK → projects)
    ├── avatar_id (UUID, FK → avatars)
    ├── video_url (TEXT, URL vidéo générée)
    ├── webhook_response (JSONB, réponse n8n)
    ├── status (TEXT: pending|processing|completed|failed)
    ├── error_message (TEXT)
    ├── created_at (TIMESTAMPTZ)
    └── completed_at (TIMESTAMPTZ)
```

## 🔒 Sécurité (RLS)

Toutes les tables ont **Row Level Security (RLS)** activé :
- Authentification via JWT Clerk
- Les utilisateurs ne voient que leurs propres données
- Les webhooks utilisent le `service_role` pour contourner RLS

## 📦 Storage

### Structure des dossiers

```
project-photos/
  {user_id}/
    {project_id}/
      photo1.jpg
      photo2.jpg
      ...

avatars/
  {user_id}/
    avatar1.jpg
    avatar2.jpg
    ...
```

### Politiques

- **Upload** : Authentifié uniquement, dans son dossier user_id
- **Lecture** : Public (pour affichage dans les vidéos)
- **Suppression** : Propriétaire uniquement

## 🆘 Troubleshooting

### Erreur : "relation does not exist"
→ Les tables n'ont pas été créées. Exécutez `001_create_tables.sql`

### Erreur : "permission denied"
→ RLS est actif mais les policies ne sont pas créées. Exécutez `002_rls_policies.sql`

### Erreur : "bucket not found"
→ Les buckets Storage n'existent pas. Exécutez `003_storage_setup.sql`

### Erreur JWT Clerk
→ Vérifiez que Supabase est configuré pour accepter les JWT Clerk (voir documentation Clerk)

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Clerk + Supabase Integration](https://clerk.com/docs/integrations/databases/supabase)

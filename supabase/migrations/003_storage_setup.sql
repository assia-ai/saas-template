-- ========================================
-- MIGRATION 003: Supabase Storage Configuration
-- ImmoVideoAds - Configuration des buckets pour photos et avatars
-- ========================================

-- ========================================
-- CRÉER LES BUCKETS DE STORAGE
-- ========================================

-- Bucket pour les photos de projets immobiliers
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'project-photos', 
  'project-photos', 
  true,  -- Public pour que les vidéos puissent y accéder
  10485760,  -- 10MB max par fichier
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE 
SET 
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Bucket pour les avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'avatars', 
  'avatars', 
  true,  -- Public pour affichage dans l'interface
  5242880,  -- 5MB max par fichier
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE 
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- ========================================
-- POLICIES pour le bucket PROJECT-PHOTOS
-- ========================================

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Users can upload project photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own project photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view project photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own project photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own project photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatars" ON storage.objects;

-- Les utilisateurs authentifiés peuvent uploader des photos dans leur dossier
CREATE POLICY "Users can upload project photos"
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'project-photos' 
  AND (storage.foldername(name))[1] = (SELECT auth.jwt() ->> 'sub'::text)
);

-- Les utilisateurs authentifiés peuvent voir leurs propres photos
CREATE POLICY "Users can view own project photos"
ON storage.objects 
FOR SELECT 
TO authenticated
USING (
  bucket_id = 'project-photos' 
  AND (storage.foldername(name))[1] = (SELECT auth.jwt() ->> 'sub'::text)
);

-- Tout le monde peut voir les photos (public bucket)
CREATE POLICY "Public can view project photos"
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'project-photos');

-- Les utilisateurs peuvent mettre à jour leurs propres photos
CREATE POLICY "Users can update own project photos"
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'project-photos' 
  AND (storage.foldername(name))[1] = (SELECT auth.jwt() ->> 'sub'::text)
)
WITH CHECK (
  bucket_id = 'project-photos' 
  AND (storage.foldername(name))[1] = (SELECT auth.jwt() ->> 'sub'::text)
);

-- Les utilisateurs peuvent supprimer leurs propres photos
CREATE POLICY "Users can delete own project photos"
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'project-photos' 
  AND (storage.foldername(name))[1] = (SELECT auth.jwt() ->> 'sub'::text)
);

-- ========================================
-- POLICIES pour le bucket AVATARS
-- ========================================
-- (Déjà supprimées ci-dessus avec les autres policies)

-- Les utilisateurs authentifiés peuvent uploader des avatars dans leur dossier
CREATE POLICY "Users can upload avatars"
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = (SELECT auth.jwt() ->> 'sub'::text)
);

-- Les utilisateurs authentifiés peuvent voir leurs propres avatars
CREATE POLICY "Users can view own avatars"
ON storage.objects 
FOR SELECT 
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = (SELECT auth.jwt() ->> 'sub'::text)
);

-- Tout le monde peut voir les avatars (public bucket)
CREATE POLICY "Public can view avatars"
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'avatars');

-- Les utilisateurs peuvent mettre à jour leurs propres avatars
CREATE POLICY "Users can update own avatars"
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = (SELECT auth.jwt() ->> 'sub'::text)
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = (SELECT auth.jwt() ->> 'sub'::text)
);

-- Les utilisateurs peuvent supprimer leurs propres avatars
CREATE POLICY "Users can delete own avatars"
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = (SELECT auth.jwt() ->> 'sub'::text)
);

-- ========================================
-- NOTES D'UTILISATION
-- ========================================

/*
Structure des dossiers dans Storage:

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

Exemple d'upload:
- Path: {user_id}/{project_id}/kitchen.jpg
- Bucket: project-photos
*/

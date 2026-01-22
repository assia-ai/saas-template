-- ========================================
-- MIGRATION 002: Row Level Security (RLS) Policies
-- ImmoVideoAds - Sécurisation des accès aux données
-- ========================================

-- ========================================
-- ACTIVER RLS sur toutes les tables
-- ========================================

ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."avatars" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."project_photos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."videos" ENABLE ROW LEVEL SECURITY;

-- ========================================
-- POLICIES pour la table PROJECTS
-- ========================================

-- Les utilisateurs peuvent voir uniquement leurs propres projets
CREATE POLICY "Users can view own projects" 
ON "public"."projects"
FOR SELECT 
USING (
  (SELECT auth.jwt() ->> 'sub'::text) = user_id
);

-- Les utilisateurs peuvent créer leurs propres projets
CREATE POLICY "Users can insert own projects" 
ON "public"."projects"
FOR INSERT 
WITH CHECK (
  (SELECT auth.jwt() ->> 'sub'::text) = user_id
);

-- Les utilisateurs peuvent modifier leurs propres projets
CREATE POLICY "Users can update own projects" 
ON "public"."projects"
FOR UPDATE 
USING (
  (SELECT auth.jwt() ->> 'sub'::text) = user_id
)
WITH CHECK (
  (SELECT auth.jwt() ->> 'sub'::text) = user_id
);

-- Les utilisateurs peuvent supprimer leurs propres projets
CREATE POLICY "Users can delete own projects" 
ON "public"."projects"
FOR DELETE 
USING (
  (SELECT auth.jwt() ->> 'sub'::text) = user_id
);

-- ========================================
-- POLICIES pour la table AVATARS
-- ========================================

-- Les utilisateurs peuvent voir uniquement leurs propres avatars
CREATE POLICY "Users can view own avatars" 
ON "public"."avatars"
FOR SELECT 
USING (
  (SELECT auth.jwt() ->> 'sub'::text) = user_id
);

-- Les utilisateurs peuvent uploader leurs propres avatars
CREATE POLICY "Users can insert own avatars" 
ON "public"."avatars"
FOR INSERT 
WITH CHECK (
  (SELECT auth.jwt() ->> 'sub'::text) = user_id
);

-- Les utilisateurs peuvent modifier leurs propres avatars
CREATE POLICY "Users can update own avatars" 
ON "public"."avatars"
FOR UPDATE 
USING (
  (SELECT auth.jwt() ->> 'sub'::text) = user_id
)
WITH CHECK (
  (SELECT auth.jwt() ->> 'sub'::text) = user_id
);

-- Les utilisateurs peuvent supprimer leurs propres avatars
CREATE POLICY "Users can delete own avatars" 
ON "public"."avatars"
FOR DELETE 
USING (
  (SELECT auth.jwt() ->> 'sub'::text) = user_id
);

-- ========================================
-- POLICIES pour la table PROJECT_PHOTOS
-- ========================================

-- Les utilisateurs peuvent voir les photos de leurs propres projets
CREATE POLICY "Users can view photos of own projects" 
ON "public"."project_photos"
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM "public"."projects" 
    WHERE id = project_id 
    AND user_id = (SELECT auth.jwt() ->> 'sub'::text)
  )
);

-- Les utilisateurs peuvent ajouter des photos à leurs propres projets
CREATE POLICY "Users can insert photos to own projects" 
ON "public"."project_photos"
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "public"."projects" 
    WHERE id = project_id 
    AND user_id = (SELECT auth.jwt() ->> 'sub'::text)
  )
);

-- Les utilisateurs peuvent modifier les photos de leurs propres projets
CREATE POLICY "Users can update photos of own projects" 
ON "public"."project_photos"
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM "public"."projects" 
    WHERE id = project_id 
    AND user_id = (SELECT auth.jwt() ->> 'sub'::text)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "public"."projects" 
    WHERE id = project_id 
    AND user_id = (SELECT auth.jwt() ->> 'sub'::text)
  )
);

-- Les utilisateurs peuvent supprimer les photos de leurs propres projets
CREATE POLICY "Users can delete photos of own projects" 
ON "public"."project_photos"
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM "public"."projects" 
    WHERE id = project_id 
    AND user_id = (SELECT auth.jwt() ->> 'sub'::text)
  )
);

-- ========================================
-- POLICIES pour la table VIDEOS
-- ========================================

-- Les utilisateurs peuvent voir les vidéos de leurs propres projets
CREATE POLICY "Users can view videos of own projects" 
ON "public"."videos"
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM "public"."projects" 
    WHERE id = project_id 
    AND user_id = (SELECT auth.jwt() ->> 'sub'::text)
  )
);

-- Les utilisateurs peuvent créer des vidéos pour leurs propres projets
CREATE POLICY "Users can insert videos for own projects" 
ON "public"."videos"
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "public"."projects" 
    WHERE id = project_id 
    AND user_id = (SELECT auth.jwt() ->> 'sub'::text)
  )
);

-- Les utilisateurs peuvent modifier les vidéos de leurs propres projets
CREATE POLICY "Users can update videos of own projects" 
ON "public"."videos"
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM "public"."projects" 
    WHERE id = project_id 
    AND user_id = (SELECT auth.jwt() ->> 'sub'::text)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "public"."projects" 
    WHERE id = project_id 
    AND user_id = (SELECT auth.jwt() ->> 'sub'::text)
  )
);

-- Les utilisateurs peuvent supprimer les vidéos de leurs propres projets
CREATE POLICY "Users can delete videos of own projects" 
ON "public"."videos"
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM "public"."projects" 
    WHERE id = project_id 
    AND user_id = (SELECT auth.jwt() ->> 'sub'::text)
  )
);

-- ========================================
-- POLICIES pour le service_role (webhooks n8n)
-- ========================================

-- Le service_role peut mettre à jour les vidéos (pour les webhooks)
-- Ces policies sont automatiquement appliquées pour service_role
-- car il a tous les privilèges via les GRANTS

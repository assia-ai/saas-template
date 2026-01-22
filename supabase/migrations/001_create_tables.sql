-- ========================================
-- MIGRATION 001: Création des tables principales
-- ImmoVideoAds - Système de génération de vidéos immobilières avec IA
-- ========================================

-- Table: projects (projets immobiliers)
CREATE TABLE IF NOT EXISTS "public"."projects" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" TEXT NOT NULL, -- Clerk user ID
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL, -- "grand 5 1/2 à 2000$..."
  "status" TEXT DEFAULT 'draft', -- draft, processing, completed, failed
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE "public"."projects" IS 'Projets immobiliers créés par les utilisateurs';
COMMENT ON COLUMN "public"."projects"."user_id" IS 'ID utilisateur Clerk';
COMMENT ON COLUMN "public"."projects"."status" IS 'Statut: draft, processing, completed, failed';

-- Table: avatars (photos d'avatar uploadées)
CREATE TABLE IF NOT EXISTS "public"."avatars" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "avatar_url" TEXT NOT NULL, -- URL Supabase Storage
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE "public"."avatars" IS 'Avatars uploadés par les utilisateurs pour générer les vidéos';
COMMENT ON COLUMN "public"."avatars"."avatar_url" IS 'URL du fichier dans Supabase Storage';

-- Table: project_photos (photos du logement)
CREATE TABLE IF NOT EXISTS "public"."project_photos" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "project_id" UUID REFERENCES "public"."projects"("id") ON DELETE CASCADE,
  "photo_url" TEXT NOT NULL, -- URL Supabase Storage
  "is_selected" BOOLEAN DEFAULT false, -- sélectionnée pour la vidéo?
  "display_order" INTEGER DEFAULT 0, -- ordre d'affichage
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE "public"."project_photos" IS 'Photos de logements attachées aux projets';
COMMENT ON COLUMN "public"."project_photos"."is_selected" IS 'Photo sélectionnée pour générer la vidéo';
COMMENT ON COLUMN "public"."project_photos"."display_order" IS 'Ordre d''affichage des photos (0 = première)';

-- Table: videos (vidéos générées)
CREATE TABLE IF NOT EXISTS "public"."videos" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "project_id" UUID REFERENCES "public"."projects"("id") ON DELETE CASCADE,
  "avatar_id" UUID REFERENCES "public"."avatars"("id") ON DELETE SET NULL,
  "video_url" TEXT, -- URL de la vidéo générée par n8n/Veo
  "webhook_response" JSONB, -- réponse complète du webhook n8n
  "status" TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  "error_message" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "completed_at" TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE "public"."videos" IS 'Vidéos générées par l''IA pour chaque projet';
COMMENT ON COLUMN "public"."videos"."status" IS 'Statut: pending, processing, completed, failed';
COMMENT ON COLUMN "public"."videos"."webhook_response" IS 'Réponse JSON complète du webhook n8n';

-- ========================================
-- INDEXES pour optimiser les performances
-- ========================================

CREATE INDEX IF NOT EXISTS "idx_projects_user_id" ON "public"."projects"("user_id");
CREATE INDEX IF NOT EXISTS "idx_projects_status" ON "public"."projects"("status");
CREATE INDEX IF NOT EXISTS "idx_avatars_user_id" ON "public"."avatars"("user_id");
CREATE INDEX IF NOT EXISTS "idx_project_photos_project_id" ON "public"."project_photos"("project_id");
CREATE INDEX IF NOT EXISTS "idx_project_photos_is_selected" ON "public"."project_photos"("is_selected");
CREATE INDEX IF NOT EXISTS "idx_videos_project_id" ON "public"."videos"("project_id");
CREATE INDEX IF NOT EXISTS "idx_videos_status" ON "public"."videos"("status");

-- ========================================
-- GRANTS pour les rôles Supabase
-- ========================================

GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";

GRANT ALL ON TABLE "public"."avatars" TO "anon";
GRANT ALL ON TABLE "public"."avatars" TO "authenticated";
GRANT ALL ON TABLE "public"."avatars" TO "service_role";

GRANT ALL ON TABLE "public"."project_photos" TO "anon";
GRANT ALL ON TABLE "public"."project_photos" TO "authenticated";
GRANT ALL ON TABLE "public"."project_photos" TO "service_role";

GRANT ALL ON TABLE "public"."videos" TO "anon";
GRANT ALL ON TABLE "public"."videos" TO "authenticated";
GRANT ALL ON TABLE "public"."videos" TO "service_role";

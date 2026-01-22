// ========================================
// Types pour la base de données ImmoVideoAds
// Généré automatiquement à partir du schéma Supabase
// ========================================

// ========================================
// TYPES DE BASE
// ========================================

export type Project = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
};

export type Avatar = {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string;
  created_at: string;
};

export type ProjectPhoto = {
  id: string;
  project_id: string;
  photo_url: string;
  is_selected: boolean;
  display_order: number;
  created_at: string;
};

export type Video = {
  id: string;
  project_id: string;
  avatar_id: string | null;
  video_url: string | null;
  webhook_response: Record<string, unknown> | null; // JSONB
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
};

// ========================================
// TYPES POUR LES OPÉRATIONS DATABASE
// ========================================

export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ProjectUpdate = Partial<Omit<Project, 'id' | 'created_at'>> & {
  updated_at?: string;
};

export type AvatarInsert = Omit<Avatar, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type AvatarUpdate = Partial<Omit<Avatar, 'id' | 'created_at'>>;

export type ProjectPhotoInsert = Omit<ProjectPhoto, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type ProjectPhotoUpdate = Partial<Omit<ProjectPhoto, 'id' | 'created_at'>>;

export type VideoInsert = Omit<Video, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type VideoUpdate = Partial<Omit<Video, 'id' | 'created_at'>>;

// ========================================
// TYPES AVEC RELATIONS (pour les queries complexes)
// ========================================

export type ProjectWithPhotos = Project & {
  photos: ProjectPhoto[];
};

export type ProjectWithVideos = Project & {
  videos: Video[];
};

export type ProjectComplete = Project & {
  photos: ProjectPhoto[];
  videos: Video[];
};

export type VideoWithProject = Video & {
  project: Project;
  avatar: Avatar | null;
};

// ========================================
// TYPE POUR LE SCHÉMA COMPLET DATABASE
// ========================================

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
      };
      avatars: {
        Row: Avatar;
        Insert: AvatarInsert;
        Update: AvatarUpdate;
      };
      project_photos: {
        Row: ProjectPhoto;
        Insert: ProjectPhotoInsert;
        Update: ProjectPhotoUpdate;
      };
      videos: {
        Row: Video;
        Insert: VideoInsert;
        Update: VideoUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// ========================================
// TYPES UTILITAIRES
// ========================================

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// ========================================
// TYPES POUR L'INTERFACE UTILISATEUR
// ========================================

export interface ProjectFormData {
  title: string;
  description: string;
}

export interface ProjectCardData {
  id: string;
  title: string;
  description: string;
  status: Project['status'];
  photoCount: number;
  videoCount: number;
  created_at: string;
}

export interface VideoGenerationRequest {
  project_id: string;
  avatar_id: string;
  selected_photo_ids: string[];
}

export interface WebhookResponse {
  success: boolean;
  video_url?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

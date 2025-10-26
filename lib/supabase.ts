import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import type { Database } from "@/lib/types/database.types";

export const createSupabaseClient = async () => {
  const authObj = await auth();
  
  // Récupérer le token JWT avec le template Supabase de Clerk
  const token = await authObj.getToken({
    template: "supabase", // Nom du JWT Template créé dans Clerk Dashboard
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

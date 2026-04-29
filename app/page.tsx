import { isSupabaseConfigured } from "@/lib/supabase/client";
import { SavedUrlManager } from "./saved-url-manager";

export default function Home() {
  return <SavedUrlManager isSupabaseConfigured={isSupabaseConfigured} />;
}

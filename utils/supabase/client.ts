import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  //Create Supabase client on browser with project's credentials
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

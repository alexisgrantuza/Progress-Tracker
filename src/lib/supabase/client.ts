import { createBrowserClient } from "@supabase/ssr";

import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/config";

export function createSupabaseBrowserClient() {
  const url = getSupabaseUrl();
  const publishableKey = getSupabasePublishableKey();

  if (!url || !publishableKey) {
    return null;
  }

  return createBrowserClient(url, publishableKey);
}

import { supabase } from "~/supabase-client";

export async function fetchFairyTales() {
  const { data, error } = await supabase.from("fairy_tales").select("*").order("created_at", { ascending: false });

  if (error) throw new Error(`Error fetching fairy tales: ${error.message}`);

  return data || [];
}

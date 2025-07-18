import { supabase } from "~/supabase-client";

export async function fetchComments() {
  const { data, error } = await supabase.from("comments").select("*").order("created_at", { ascending: false });

  if (error) throw new Error(`Error fetching comments: ${error.message}`);

  return data || [];
}

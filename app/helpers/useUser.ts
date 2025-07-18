import { useQuery } from "@tanstack/react-query";
import { supabase } from "~/supabase-client";

async function fetchUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

export function useUser() {
  return useQuery({ queryKey: ["user"], queryFn: fetchUser });
}

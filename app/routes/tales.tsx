import FairyTale from "~/components/fairy-tale/FairyTale";
import type { Route } from "./+types/tales";
import { supabase } from "~/supabase-client";
import type { FairyTaleType } from "~/types/types";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Tales" }, { name: "description", content: "Tales" }];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const { url } = params;
  const { data, error } = await supabase.from("fairy_tales").select("*").eq("url", url).single();
  if (error) throw new Error(`Error fetching fairy tale: ${error.message}`);

  return data as FairyTaleType;
}

export default function Tales({ loaderData }: Route.ComponentProps) {
  return <FairyTale postData={loaderData} />;
}

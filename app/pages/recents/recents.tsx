import { useQuery } from "@tanstack/react-query";
import { fetchFairyTales } from "~/helpers/fetchFairyTales";
import { supabase } from "~/supabase-client";
import type { FairyTaleType } from "~/types/types";
import { useState } from "react";
import { Spinner } from "@heroui/react";
import FairyTalePost from "~/components/fairy-tale/FairyTalePost";
import Searchbar from "~/components/shared/Searchbar";

export default function Recents() {
  const {
    data: tales,
    isLoading,
    error,
  } = useQuery<FairyTaleType[]>({
    queryKey: ["fairyTales"],
    queryFn: fetchFairyTales,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 15,
  });
  const [text, setText] = useState<string>("");
  const filteredTales = tales?.filter((tale) => tale.title.toLowerCase().includes(text.toLowerCase()));

  if (error) {
    return <p>Error loading fairy tales: {error.message}</p>;
  }

  return (
    <main className="p-4 relative">
      <header className="max-w-4xl mx-auto text-center space-y-4">
        <button className="cursor-pointer">
          <h1 className="font-bold text-7xl text-center">Readsy</h1>
        </button>
        <p className="max-w-[40ch] md:max-w-[80ch] mx-auto text-tiny md:text-small text-default-500">Zanurz się w świecie opowieści, gdzie każda bajka otwiera drzwi do wyobraźni. Odkrywaj magiczne historie, które poruszają serce i budzą dziecięcą ciekawość – niezależnie od wieku.</p>
      </header>
      <section className="max-w-4xl mx-auto py-8 flex items-center justify-end">
        <Searchbar tales={tales || []} onChange={setText} value={text} />
      </section>
      {isLoading ? (
        <section className="grid min-h-[60vh] place-content-center">
          <Spinner size="lg" />
        </section>
      ) : (
        <section className="max-w-4xl mx-auto grid gap-[2rem]">
          {filteredTales?.map((tale) => (
            <FairyTalePost key={tale.url} createdAt={tale.created_at} title={tale.title} brief={tale.brief} url={tale.url} imageSrc={supabase.storage.from("banners").getPublicUrl(tale.image_url || "").data.publicUrl} />
          ))}
        </section>
      )}
    </main>
  );
}

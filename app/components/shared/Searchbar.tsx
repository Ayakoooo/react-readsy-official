import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useRef } from "react";
import type { FairyTaleType } from "~/types/types";

type Props = {
  tales: FairyTaleType[];
  value: string;
  onChange: (value: string) => void;
};

export default function Searchbar({ tales, value, onChange }: Props) {
  const autoCompleteRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        autoCompleteRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <Autocomplete aria-label="searchbar" ref={autoCompleteRef} inputValue={value} onInputChange={(val) => onChange(val)} size="lg" startContent={<Icon icon={"system-uicons:search"} width={20} height={20} />} className="w-full" placeholder={`Wybierz spośród ${tales?.length || 0} bajek`}>
      {tales.map((tale) => (
        <AutocompleteItem startContent={<Icon icon={"system-uicons:book"} width={20} height={20} />} key={tale.url} textValue={tale.title}>
          {tale.title}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}

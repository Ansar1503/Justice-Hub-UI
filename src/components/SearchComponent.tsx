import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";

type Props = {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchComponent({
  searchTerm,
  setSearchTerm,
  placeholder = "Search...",
  className = "",
}: Props) {
  const [localValue, setLocalValue] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(localValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [localValue, setSearchTerm]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        className="pl-10 bg-white/10"
        value={localValue}
        onChange={(e) => {
          setLocalValue(e.target.value)}}
      />
    </div>
  );
}

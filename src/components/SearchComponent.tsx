import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
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
    return () => clearTimeout(handler);
  }, [localValue, setSearchTerm]);

  const clearSearch = () => {
    setLocalValue("");
    setSearchTerm("");
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Icon */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />

      {/* Input */}
      <Input
        type="text"
        placeholder={placeholder}
        className="pl-10 pr-8 bg-white/10 focus-visible:ring-1 focus-visible:ring-primary"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />

      {/* Clear Button */}
      {localValue && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

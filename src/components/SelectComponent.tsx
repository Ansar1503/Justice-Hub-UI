import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  values: string[];
  placeholder?: string;
  label?: string;
  className?: string;
  onSelect: (val: string) => void;
  selectedValue?: string;
};

export function SelectComponent({
  className = "",
  label,
  onSelect,
  placeholder = "Select an option",
  values,
  selectedValue,
}: Props) {
  return (
    <Select onValueChange={onSelect} value={selectedValue}>
      <SelectTrigger className={`w-[180px] ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {label && <SelectLabel>{label}</SelectLabel>}
          {values.map((value) => (
            <SelectItem key={value} value={value}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

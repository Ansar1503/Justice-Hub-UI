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
  clearable?: boolean;
};

export function SelectComponent({
  className = "",
  label,
  onSelect,
  placeholder = "Select an option",
  values,
  selectedValue,
  clearable = false,
}: Props) {
  return (
    <Select
      onValueChange={(val) => onSelect(val === "clear" ? "" : val)}
      value={selectedValue}
    >
      <SelectTrigger className={`w-[180px] ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {label && <SelectLabel>{label}</SelectLabel>}

          {clearable && <SelectItem value="clear">All / Clear</SelectItem>}

          {values && values.length > 0 ? (
            values.map((value) => (
              <SelectItem key={value} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="empty" disabled>
              Empty
            </SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

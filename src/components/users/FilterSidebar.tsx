import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { filterType } from "@/pages/client/LawyersListing";

interface FiltersSidebarProps {
  filters: filterType;
  setFilters: (filters: filterType) => void;
  resetFilters: () => void;
  handleApplyFilters: () => void;
}

const practiceAreaOptions = [
  "Corporate Law",
  "Criminal Law",
  "Family Law",
  "Civil Litigation",
  "Intellectual Property",
  "Tax Law",
  "Real Estate",
  "Employment Law",
];

const specializationOptions = [
  "Contract Disputes",
  "Business Formation",
  "Divorce & Custody",
  "Personal Injury",
  "Estate Planning",
  "Immigration",
  "Bankruptcy",
  "Environmental Law",
];

export default function FiltersSidebar({
  filters,
  setFilters,
  resetFilters,
  handleApplyFilters,
}: FiltersSidebarProps) {
  const handlePracticeAreaChange = (area: string, checked: boolean) => {
    setFilters({
      ...filters,
      practiceAreas: checked
        ? [...filters.practiceAreas, area]
        : filters.practiceAreas.filter((a) => a !== area),
    });
  };

  const handleSpecializationChange = (spec: string, checked: boolean) => {
    setFilters({
      ...filters,
      specialisation: checked
        ? [...filters.specialisation, spec]
        : filters.specialisation.filter((s) => s !== spec),
    });
  };

  return (
    <Card className="sticky top-6 border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
        <CardTitle className="text-xl font-bold">Filters</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Practice Areas */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Practice Areas
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
            {practiceAreaOptions.map((area) => (
              <div key={area} className="flex items-center space-x-2 group">
                <Checkbox
                  id={`practice-${area}`}
                  checked={filters.practiceAreas.includes(area)}
                  onCheckedChange={(checked) =>
                    handlePracticeAreaChange(area, checked as boolean)
                  }
                  className="transition-all"
                />
                <label
                  htmlFor={`practice-${area}`}
                  className="text-sm leading-none cursor-pointer group-hover:text-primary transition-colors"
                >
                  {area}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Specializations */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Specializations
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
            {specializationOptions.map((spec) => (
              <div key={spec} className="flex items-center space-x-2 group">
                <Checkbox
                  id={`spec-${spec}`}
                  checked={filters.specialisation.includes(spec)}
                  onCheckedChange={(checked) =>
                    handleSpecializationChange(spec, checked as boolean)
                  }
                  className="transition-all"
                />
                <label
                  htmlFor={`spec-${spec}`}
                  className="text-sm leading-none cursor-pointer group-hover:text-primary transition-colors"
                >
                  {spec}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Experience Range */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Experience
            </Label>
            <span className="text-sm font-semibold text-primary">
              {filters.experienceRange[0]} - {filters.experienceRange[1]} yrs
            </span>
          </div>
          <Slider
            min={0}
            max={25}
            step={1}
            value={filters.experienceRange}
            onValueChange={(value) =>
              setFilters({ ...filters, experienceRange: value })
            }
            className="w-full"
          />
        </div>

        <Separator className="bg-border/50" />

        {/* Fee Range */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Fee Range
            </Label>
            <span className="text-sm font-semibold text-primary">
              ₹{filters.feeRange[0].toLocaleString()} - ₹
              {filters.feeRange[1].toLocaleString()}
            </span>
          </div>
          <Slider
            min={0}
            max={10000}
            step={500}
            value={filters.feeRange}
            onValueChange={(value) =>
              setFilters({ ...filters, feeRange: value })
            }
            className="w-full"
          />
        </div>

        <Button
          onClick={handleApplyFilters}
          className="w-full shadow-md hover:shadow-lg transition-all"
          size="lg"
        >
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}

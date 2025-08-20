"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

import { VerificationStatus } from "@/types/types/Client.data.type";
import { RefreshCcw } from "lucide-react";

interface FiltersSidebarProps {
  filters: {
    practiceAreas: string[];
    specialisation: string[];
    experienceRange: number[];
    feeRange: number[];
    sortBy: "rating" | "experience" | "fee-low" | "fee-high";
  };
  setFilters: React.Dispatch<
    React.SetStateAction<FiltersSidebarProps["filters"]>
  >;
  handleApplyFilters: () => void;
  resetFilters: () => void;
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  filters,
  setFilters,
  resetFilters,
  handleApplyFilters,
}) => {
  const toggleCheckbox = (
    field: keyof FiltersSidebarProps["filters"],
    value: string | VerificationStatus
  ) => {
    setFilters((prev) => {
      const current = prev[field] as string[];
      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };
  const availablePracticeAreas = [
    "Civil Law",
    "Criminal Law",
    "Corporate Law",
    "Family Law",
    "Intellectual Property",
    "Tax Law",
    "Constitutional Law",
    "Environmental Law",
    "Labor Law",
    "Real Estate Law",
  ];

  const availableSpecializations = [
    "Divorce",
    "Child Custody",
    "Wills & Trusts",
    "Personal Injury",
    "Medical Malpractice",
    "Bankruptcy",
    "Immigration",
    "Mergers & Acquisitions",
    "Patent Law",
    "Criminal Defense",
  ];
  return (
    <div className="w-full lg:w-[250px] space-y-4">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="practice">
          <AccordionTrigger>Practice Area</AccordionTrigger>
          <AccordionContent>
            {availablePracticeAreas.map((area) => (
              <div key={area} className="flex items-center space-x-2">
                <Checkbox
                  id={area}
                  checked={filters.practiceAreas.includes(area)}
                  onCheckedChange={() => toggleCheckbox("practiceAreas", area)}
                />
                <label htmlFor={area} className="text-sm">
                  {area}
                </label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="specialisation">
          <AccordionTrigger>Specialisation</AccordionTrigger>
          <AccordionContent>
            {availableSpecializations.map((spec) => (
              <div key={spec} className="flex items-center space-x-2">
                <Checkbox
                  id={spec}
                  checked={filters.specialisation.includes(spec)}
                  onCheckedChange={() => toggleCheckbox("specialisation", spec)}
                />
                <label htmlFor={spec} className="text-sm">
                  {spec}
                </label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience">
          <AccordionTrigger>Experience (Years)</AccordionTrigger>
          <AccordionContent className="mt-2">
            <Slider
              min={0}
              max={25}
              step={1}
              value={filters.experienceRange}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, experienceRange: value }))
              }
            />
            <div className="text-sm mt-1">
              {filters.experienceRange[0]} - {filters.experienceRange[1]} years
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="fee">
          <AccordionTrigger>Consultation Fee</AccordionTrigger>
          <AccordionContent>
            <Slider
              className="mt-2"
              min={0}
              max={10000}
              step={10}
              value={filters.feeRange}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, feeRange: value }))
              }
            />
            <div className="text-sm mt-1">
              ₹{filters.feeRange[0]} - ₹{filters.feeRange[1]}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button variant="outline" className="w-full" onClick={handleApplyFilters}>
        Apply Filter
      </Button>

      <Button variant="ghost" className="w-full" onClick={resetFilters}>
        <RefreshCcw />
        Reset Filters
      </Button>
    </div>
  );
};

export default FiltersSidebar;

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

import { RefreshCcw } from "lucide-react";
import { VerificationStatus } from "@/types/types/LawyerTypes";
import { useFetchPracticeAreaBySpecIds } from "@/store/tanstack/Queries/PracticeAreaQuery";
import { useFetchAllSpecializations } from "@/store/tanstack/Queries/SpecializationQueries";
import { useMemo } from "react";

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
  const { data: practiceAreas } = useFetchPracticeAreaBySpecIds(
    filters.specialisation
  );
  const { data: SpecialisationData } = useFetchAllSpecializations({
    limit: 1000,
    page: 1,
    search: "",
  });
  const specialisations = useMemo(
    () => SpecialisationData?.data || [],
    [SpecialisationData]
  );
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

  return (
    <div className="w-full lg:w-[250px] space-y-4">
      <Accordion type="multiple" className="w-full">
        {specialisations && specialisations.length > 0 && (
          <AccordionItem value="specialisation">
            <AccordionTrigger>Specialisation</AccordionTrigger>
            <AccordionContent>
              {specialisations &&
                specialisations?.map((spec) => (
                  <div key={spec.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={spec.id}
                      checked={filters.specialisation.includes(spec.id)}
                      onCheckedChange={() =>
                        toggleCheckbox("specialisation", spec.id)
                      }
                    />
                    <label htmlFor={spec.name} className="text-sm">
                      {spec.name}
                    </label>
                  </div>
                ))}
            </AccordionContent>
          </AccordionItem>
        )}
        {practiceAreas && practiceAreas.length > 0 && (
          <AccordionItem value="practice">
            <AccordionTrigger>Practice Area</AccordionTrigger>
            <AccordionContent>
              {practiceAreas &&
                practiceAreas?.map((p) => (
                  <div key={p.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={p.id}
                      checked={filters.practiceAreas.includes(p.id)}
                      onCheckedChange={() =>
                        toggleCheckbox("practiceAreas", p.id)
                      }
                    />
                    <label htmlFor={p.name} className="text-sm">
                      {p.name}
                    </label>
                  </div>
                ))}
            </AccordionContent>
          </AccordionItem>
        )}
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

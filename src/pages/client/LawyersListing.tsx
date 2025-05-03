"use client";

import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import LawyersCard from "@/components/users/LawyersCard";
import getVerificationBadge from "@/components/ui/getVerificationBadge";
import FiltersSidebar from "@/components/users/FilterSidebar";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import SearchComponent from "@/components/SearchComponent";
import { useFetchLawyersByQuery } from "@/store/tanstack/queries";

export type sortType =
  | "fee-high"
  | "recommended"
  | "rating"
  | "experience"
  | "fee-low";

export type filterType = {
  practiceAreas: string[];
  specialisation: string[];
  experienceRange: number[];
  feeRange: number[];
  sortBy: sortType;
};

export default function LawyerDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [lawyers, setLawyers] = useState([]);
  const [filters, setFilters] = useState<filterType>({
    practiceAreas: [] as string[],
    specialisation: [] as string[],
    experienceRange: [0, 25],
    feeRange: [0, 10000],
    sortBy: "recommended",
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { data, refetch } = useFetchLawyersByQuery({
    search: searchTerm,
    experienceMax: filters.experienceRange[1],
    experienceMin: filters.experienceRange[0],
    feeMax: filters.feeRange[1],
    feeMin: filters.feeRange[0],
    practiceAreas: filters.practiceAreas,
    specialisation: filters.specialisation,
    sortBy: filters.sortBy,
  });

  //   console.log("data:", data);
  useEffect(() => {
    refetch();
  }, [searchTerm]);

  useEffect(() => {
    if (data) {
      setLawyers(data?.data || []);
    }
  }, [data]);
  //   console.log("lawyers", lawyers);
  const resetFilters = () => {
    setFilters({
      practiceAreas: [],
      specialisation: [],
      experienceRange: [0, 25],
      feeRange: [0, 10000],
      sortBy: "recommended",
    });
    setSearchTerm("");
  };

  function handleApplyFilters() {
    refetch();
  }

  return (
    <div className="dark:bg-slate-800 bg-brandCream">
      <Navbar />
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold">Find a Lawyer</h1>
          <p className="text-muted-foreground ">
            Browse our directory of qualified lawyers and legal professionals
          </p>

          {/* Mobile filter button */}
          <div className="md:hidden">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showMobileFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters sidebar */}
            <div
              className={cn(
                "w-full md:w-1/4 space-y-6",
                showMobileFilters ? "block" : "hidden md:block"
              )}
            >
              <FiltersSidebar
                filters={filters}
                resetFilters={resetFilters}
                handleApplyFilters={handleApplyFilters}
                setFilters={setFilters}
              />
            </div>

            {/* Lawyer list */}
            <div className="w-full md:w-3/4">
              <div className="flex justify-between items-center mb-4">
                <SearchComponent
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
                <Select
                  value={filters.sortBy}
                  onValueChange={(val) => {
                    setFilters({ ...filters, sortBy: val as sortType });
                    refetch();
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                    <SelectItem value="experience">Most Experience</SelectItem>
                    <SelectItem value="fee-low">Fee: Low to High</SelectItem>
                    <SelectItem value="fee-high">Fee: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-muted-foreground">
                {lawyers.length} lawyers found
              </p>
              {lawyers.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">No lawyers found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try adjusting your filters or search term
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lawyers &&
                    lawyers.map((lawyer, index) => (
                      <LawyersCard
                        key={index}
                        getVerificationBadge={getVerificationBadge}
                        lawyer={lawyer}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

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
import SearchComponent from "@/components/SearchComponent";
import { useFetchLawyersByQuery } from "@/store/tanstack/queries";
import PaginationComponent from "@/components/pagination";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";

export type sortType = "fee-high" | "rating" | "experience" | "fee-low";

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
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<filterType>({
    practiceAreas: [],
    specialisation: [],
    experienceRange: [0, 25],
    feeRange: [0, 10000],
    sortBy: "experience",
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data, refetch, isFetching } = useFetchLawyersByQuery({
    search: searchTerm,
    experienceMax: filters.experienceRange[1],
    experienceMin: filters.experienceRange[0],
    feeMax: filters.feeRange[1],
    feeMin: filters.feeRange[0],
    practiceAreas: filters.practiceAreas,
    specialisation: filters.specialisation,
    sortBy: filters.sortBy,
    limit: itemsPerPage,
    page: currentPage,
  });

  useEffect(() => {
    if (data?.data?.data) {
      setLawyers(data.data.data);
      const totalPages = data.data.totalPages || 1;
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    }
  }, [data, currentPage]);

  const totalPages = data?.data?.totalPages || 1;
  const totalItems = data?.data?.totalCount || 0;

  const resetFilters = () => {
    setFilters({
      practiceAreas: [],
      specialisation: [],
      experienceRange: [0, 25],
      feeRange: [0, 10000],
      sortBy: "experience",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    refetch();
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col brand-cream">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 md:px-6">
          <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                Find Your Legal Expert
              </h1>
              <p className="text-lg text-muted-foreground">
                Browse our directory of qualified lawyers and legal
                professionals
              </p>
            </div>

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

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Filters sidebar */}
              <aside
                className={cn(
                  "w-full lg:w-80 shrink-0",
                  showMobileFilters ? "block" : "hidden lg:block"
                )}
              >
                <FiltersSidebar
                  filters={filters}
                  resetFilters={resetFilters}
                  handleApplyFilters={handleApplyFilters}
                  setFilters={setFilters}
                />
              </aside>

              {/* Lawyer list */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                  <SearchComponent
                    className="w-full sm:flex-1"
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  <Select
                    value={filters.sortBy}
                    onValueChange={(val) => {
                      setFilters({ ...filters, sortBy: val as sortType });
                      setCurrentPage(1);
                      refetch();
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Highest Rating</SelectItem>
                      <SelectItem value="experience">
                        Most Experience
                      </SelectItem>
                      <SelectItem value="fee-low">Fee: Low to High</SelectItem>
                      <SelectItem value="fee-high">Fee: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {isFetching ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      <span className="font-medium text-foreground">
                        {totalItems} lawyers found
                      </span>
                    )}
                  </p>
                </div>

                {/* Results */}
                {lawyers.length === 0 && !isFetching ? (
                  <div className="text-center py-16 bg-card rounded-lg border shadow-card">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                      <Filter className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      No lawyers found
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Try adjusting your filters or search term to find what
                      you're looking for
                    </p>
                    <Button onClick={resetFilters} size="lg">
                      Reset Filters
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                      {lawyers.map((lawyer: any, index: number) => (
                        <LawyersCard
                          key={lawyer.id || index}
                          getVerificationBadge={getVerificationBadge}
                          lawyer={lawyer}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-8 bg-card p-6 rounded-lg border shadow-card">
                        <PaginationComponent
                          currentPage={currentPage}
                          handlePageChange={handlePageChange}
                          itemsPerPage={itemsPerPage}
                          totalItems={totalItems}
                          totalPages={totalPages}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

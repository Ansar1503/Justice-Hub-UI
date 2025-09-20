import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import CaseList from "@/components/Case/CaseListTable";
import SearchComponent from "@/components/SearchComponent";
import { useState } from "react";
import { SelectComponent } from "@/components/SelectComponent";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaginationComponent from "@/components/pagination";
import { sortByType, statusType } from "@/types/types/Case";
import { sortOrderType } from "@/types/types/CommonTypes";
import { useFechAllCaseType } from "@/store/tanstack/Queries/CasetypeQuery";
import { useFetchAllCasesByRole } from "@/store/tanstack/Queries/Cases";

const sortByValues = ["date", "title", "client", "lawyer"];
const statusValues = ["open", "closed", "onhold"];
export default function CasesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<sortOrderType>("asc");
  const [sortBy, setSortBy] = useState<sortByType>("date");
  const [status, setStatus] = useState<statusType>("All");
  const [caseTypeFilter, setCaseTypeFilter] = useState("");
  const { data: CaseTypesData } = useFechAllCaseType();
  const { data: CasesData } = useFetchAllCasesByRole({
    caseTypeFilter,
    limit: itemsPerPage,
    page: currentPage,
    search: searchTerm,
    sortBy,
    sortOrder,
    status,
  });

  return (
    <div className="flex flex-col min-h-screen  bg-[#FFF2F2] dark:bg-black">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="w-full p-3 ">
          <Card className="bg-textLight dark:bg-slate-800 mt-5">
            <CardHeader className="pb-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-4xl">Cases Managment</CardTitle>
                  <CardDescription className="text-md">
                    Manage and track all your legal cases
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-1 flex-col gap-4 pb-5">
                <div className="flex gap-3">
                  <SearchComponent
                    className="w-full"
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    placeholder="search..."
                  />
                  <Select
                    onValueChange={(val) =>
                      setCaseTypeFilter(val === "clear" ? "" : val)
                    }
                    value={caseTypeFilter || "clear"}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a PracticeArea" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>PracticeAreas</SelectLabel>

                        <SelectItem value="clear">All PracticeAreas</SelectItem>

                        {CaseTypesData?.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <SelectComponent
                    className="bg-white/5"
                    onSelect={(val) => {
                      if (statusValues.includes(val)) {
                        setStatus(val as statusType);
                      }
                    }}
                    values={statusValues}
                    label="Status"
                    placeholder="Status"
                  />
                  <SelectComponent
                    className="bg-white/5"
                    onSelect={(val) => {
                      if (sortByValues.includes(val)) {
                        setSortBy(val as sortByType);
                      }
                    }}
                    label="SortBy"
                    placeholder="SortBy"
                    values={sortByValues}
                  />
                  <SelectComponent
                    className="bg-white/5"
                    onSelect={(val) => {
                      if (["asc", "desc"].includes(val)) {
                        setSortOrder(val as sortOrderType);
                      }
                    }}
                    label="SortOrder"
                    placeholder="SortOrder"
                    values={["asc", "desc"]}
                  />
                  <SelectComponent
                    onSelect={(val) => {
                      const num = parseInt(val);
                      if (!isNaN(num)) setItemsPerPage(num);
                    }}
                    label="Items per page"
                    placeholder="Items"
                    values={["5", "10", "20", "50"]}
                  />
                </div>
              </div>
            </CardContent>
            <CaseList Cases={CasesData?.data || null} />
            <PaginationComponent
              currentPage={currentPage}
              handlePageChange={setCurrentPage}
              totalItems={CasesData?.totalCount || 0}
              itemsPerPage={itemsPerPage}
              totalPages={CasesData?.totalPage || 0}
            />
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

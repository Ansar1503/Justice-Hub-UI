"use client";

import { CardContent } from "../ui/card";
import SearchComponent from "../SearchComponent";
import { SelectComponent } from "../SelectComponent";
import { useState } from "react";
import ReviewDisputesTable from "./ReviewDisputeTable";

type SortByType = "All" | "reported_date" | "review_date";

export default function ReviewDisputeCardContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortByType>("reported_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // constants
  const sortByValues = ["All", "reported_date", "review_date", "rating"];

  return (
    <CardContent>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex gap-3">
          <SearchComponent
            className="w-full"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search reviews, users, or reasons..."
          />
          {/* sorts */}
          <SelectComponent
            className="bg-white/5"
            onSelect={(val) => {
              if (sortByValues.includes(val)) {
                setSortBy(val as SortByType);
              }
            }}
            label="SortBy"
            placeholder="SortBy"
            values={sortByValues}
          />
          {/* sortOrder */}
          <SelectComponent
            className="bg-white/5"
            onSelect={(val) => {
              if (["asc", "desc"].includes(val)) {
                setSortOrder(val as "asc" | "desc");
              }
            }}
            label="SortOrder"
            placeholder="SortOrder"
            values={["asc", "desc"]}
          />
          <SelectComponent
            onSelect={(val) => {
              const num = Number.parseInt(val);
              if (!isNaN(num)) setItemsPerPage(num);
            }}
            label="Items per page"
            placeholder="Items"
            values={["5", "10", "20", "50"]}
          />
        </div>
      </div>
      <div className="rounded-md overflow-hidden border">
        <ReviewDisputesTable
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          searchTerm={searchTerm}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </CardContent>
  );
}

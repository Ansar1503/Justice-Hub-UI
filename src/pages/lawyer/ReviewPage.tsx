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
import SearchComponent from "@/components/SearchComponent";
import { useState } from "react";
import { SelectComponent } from "@/components/SelectComponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useFetchReviewsListClientOrLawyer } from "@/store/tanstack/queries";
import PaginationComponent from "@/components/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { ReviewsDetailsModal } from "@/components/Lawyer/Modals/ReviewsDetails";

type sortByType = "date" | "rating";
type sortOrderType = "asc" | "desc";

const sortByValues = ["date", "rating"];

export default function ReviewPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<sortByType>("date");
  const [sortOrder, setSortOrder] = useState<sortOrderType>("asc");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const { data: reviewData } = useFetchReviewsListClientOrLawyer({
    limit: itemsPerPage,
    page: currentPage,
    sortBy,
    search: searchTerm,
    sortOrder,
  });
  const reviews = reviewData?.data || [];
  const totalPages = reviewData?.totalPage || 1;
  const totalCount = reviewData?.totalCount || 1;

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF2F2] dark:bg-black">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="w-full p-3">
          <Card className="bg-textLight dark:bg-slate-800 mt-5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Session Reviews</CardTitle>
                  <CardDescription>Manage Your Reviews</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex gap-3">
                  <SearchComponent
                    className="w-full "
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    placeholder="search..."
                  />
                  {/* Sort */}
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
                  {/* sortOrder */}
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
                  {/* Items Per Page */}
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
              <div className="rounded-md overflow-hidden border">
                <Table>
                  <TableHeader className="bg-slate-600/5 dark:bg-white/10">
                    <TableRow>
                      <TableHead>sessionId</TableHead>
                      <TableHead>ReviewedBy</TableHead>
                      <TableHead>Heading</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews && reviews.length > 0 ? (
                      reviews.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell>
                            {r.session_id?.substring(0, 6)?.toUpperCase()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3 cursor-pointer">
                              <Avatar>
                                {r.reviewedFor.profile_image ? (
                                  <AvatarImage
                                    className="rounded-full w-10"
                                    src={r.reviewedFor.profile_image}
                                    alt={r.reviewedFor.name}
                                  />
                                ) : (
                                  <AvatarFallback>
                                    {r.reviewedFor.name
                                      .substring(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div className="font-medium">
                                {r.reviewedFor.name}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{r.heading}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-5 w-5  ${
                                    r.rating >= star || r.rating >= star
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300 dark:text-gray-500"
                                  }`}
                                />
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant={"secondary"}
                              onClick={() => {
                                setSelectedSessionId(r.session_id);
                                setShowFeedbackModal(true);
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No reviews found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <PaginationComponent
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalCount}
                  totalPages={totalPages}
                  handlePageChange={(page: number) => setCurrentPage(page)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
      {showFeedbackModal && selectedSessionId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-2xl">
            <button
              className="absolute top-4 right-4 text-gray-500"
              onClick={() => setShowFeedbackModal(false)}
            >
              ✕
            </button>
            <ReviewsDetailsModal
              onClose={() => {
                setShowFeedbackModal(false);
              }}
              open={showFeedbackModal}
              session_id={selectedSessionId}
            />
          </div>
        </div>
      )}
    </div>
  );
}

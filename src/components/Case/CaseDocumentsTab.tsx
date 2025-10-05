import { Download, Eye, FileText, Upload } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { UploadDocumentModal } from "./CaseUploadModal";
import { useState } from "react";
import { useUploadCaseDocumentMutation } from "@/store/tanstack/mutations/CaseDocumentMutation";
import { useFetchCaseDocuments } from "@/store/tanstack/Queries/Cases";
import { sortOrderType } from "@/types/types/CommonTypes";
import SearchComponent from "../SearchComponent";
import PaginationComponent from "../pagination";
import { SelectComponent } from "../SelectComponent";

type Props = {
  id: string;
};

type SortBy = "date" | "name" | "size";

export default function CaseDocumentsTab({ id }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<sortOrderType>("asc");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [currentTab, setCurrentTab] = useState<"client" | "lawyer">("client");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagelimit, setPageLimit] = useState(10);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const { data: caseDocumentsData } = useFetchCaseDocuments({
    caseId: id,
    limit: pagelimit,
    page: currentPage,
    search: searchTerm,
    sort: sortBy,
    sortOrder: sortOrder,
    uploadedBy: currentTab,
  });
  console.log("casedocuemtes", caseDocumentsData);
  const caseDocuments = caseDocumentsData?.data;
  const { mutateAsync } = useUploadCaseDocumentMutation();

  async function handleUpload(file: File[]) {
    if (!file) return;
    try {
      file.forEach(async (f) => {
        const formData = new FormData();
        formData.append("file", f);
        formData.append("caseId", id);
        await mutateAsync(formData);
      });
    } catch (error) {
      console.log("errors occured while upload", error);
    }
  }

  const renderDocumentsList = () => {
    if (caseDocuments && caseDocuments.length > 0) {
      return (
        <div className="grid gap-3">
          {caseDocuments.map((d) => (
            <div
              key={d.id}
              className="group relative flex items-center justify-between p-5 border rounded-xl transition-all duration-200 hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 bg-card"
            >
              {/* Left: Icon + Document Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-110 bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-base group-hover:text-primary transition-colors">
                    {d.document.name}
                  </h4>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="font-medium">{d.document.type}</span>
                    <span className="opacity-60">•</span>
                    <span>
                      {new Date(d.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="opacity-60">•</span>
                    <span className="capitalize">
                      Uploaded by {d.uploaderDetails.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-primary/10"
                  onClick={() => window.open(d.document.url, "_blank")}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-primary/10"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = d.document.url;
                    link.download = d.document.name;
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-2xl transition-colors hover:border-primary/30 hover:bg-muted/30">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No documents yet</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          No {currentTab} documents found. Upload your first document to get
          started.
        </p>
        <Button
          onClick={() => setIsUploadModalOpen(true)}
          size="lg"
          className="shadow-sm"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload First Document
        </Button>
      </div>
    );
  };

  return (
    <>
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">Case Documents</CardTitle>
              <CardDescription className="text-base">
                Upload and manage all case-related documents
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={currentTab}
            onValueChange={(value) =>
              setCurrentTab(value as "client" | "lawyer")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
              <TabsTrigger value="client">Client Documents</TabsTrigger>
              <TabsTrigger value="lawyer">Lawyer Documents</TabsTrigger>
            </TabsList>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <SearchComponent
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Search documents..."
                className="flex-1 min-w-[200px]"
              />
              <SelectComponent
                values={["date", "name", "size"]}
                placeholder="Sort by"
                selectedValue={sortBy}
                onSelect={(val) => setSortBy(val as SortBy)}
                className="w-[140px]"
              />
              <SelectComponent
                values={["asc", "desc"]}
                placeholder="Order"
                selectedValue={sortOrder}
                onSelect={(val) => setSortOrder(val as sortOrderType)}
                className="w-[120px]"
              />
              <SelectComponent
                values={["10", "25", "50", "100"]}
                placeholder="Per page"
                selectedValue={pagelimit.toString()}
                onSelect={(val) => setPageLimit(Number(val))}
                className="w-[120px]"
              />
            </div>

            <TabsContent value="client" className="mt-0">
              {currentTab === "client" && renderDocumentsList()}
              {caseDocumentsData?.totalCount &&
                caseDocumentsData.totalCount > pagelimit && (
                  <PaginationComponent
                    currentPage={currentPage}
                    handlePageChange={setCurrentPage}
                    totalPages={Math.ceil(
                      (caseDocumentsData.totalCount || 0) / pagelimit
                    )}
                    itemsPerPage={pagelimit}
                    totalItems={caseDocumentsData.totalCount || 0}
                  />
                )}
            </TabsContent>

            <TabsContent value="lawyer" className="mt-0">
              {currentTab === "lawyer" && renderDocumentsList()}
              {caseDocumentsData?.totalCount &&
                caseDocumentsData.totalCount > pagelimit && (
                  <PaginationComponent
                    currentPage={currentPage}
                    handlePageChange={setCurrentPage}
                    totalPages={Math.ceil(
                      (caseDocumentsData.totalCount || 0) / pagelimit
                    )}
                    itemsPerPage={pagelimit}
                    totalItems={caseDocumentsData.totalCount || 0}
                  />
                )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <UploadDocumentModal
        onUpload={handleUpload}
        onClose={() => setIsUploadModalOpen(false)}
        open={isUploadModalOpen}
      />
    </>
  );
}

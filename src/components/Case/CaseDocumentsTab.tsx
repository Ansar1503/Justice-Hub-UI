import { Download, Eye, FileText, Upload } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { UploadDocumentModal } from "./CaseUploadModal";
import { useState } from "react";

export interface DocumentItem {
  name: string;
  type: string;
  url: string;
  _id?: string;
}

export interface CaseDocumentProps {
  id: string;
  caseId: string;
  clientId?: string;
  lawyerId?: string;
  document: DocumentItem;
  createdAt: Date;
  updatedAt: Date;
}

type Props = {
  // caseDocuments: CaseDocumentProps[];
  id: string;
};

export default function CaseDocumentsTab({ id }: Props) {
  const caseDocuments = [];
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
          {caseDocuments.length > 0 ? (
            <div className="grid gap-3">
              {caseDocuments.map((d) => (
                <div
                  key={d.id}
                  className="group relative flex items-center justify-between p-5 border rounded-xl transition-all duration-200 hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 bg-card"
                  style={{
                    backgroundColor: "hsl(var(--document-bg))",
                    borderColor: "hsl(var(--document-border))",
                  }}
                >
                  {/* Left: Icon + Document Info */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-110"
                      style={{
                        backgroundColor: "hsl(var(--document-icon-bg))",
                      }}
                    >
                      <FileText
                        className="h-6 w-6"
                        style={{ color: "hsl(var(--document-icon-text))" }}
                      />
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
                          {d.clientId ? "Client" : "Lawyer"}
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
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-2xl transition-colors hover:border-primary/30 hover:bg-muted/30">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No documents yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Upload your first document to get started with case management
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
          )}
        </CardContent>
      </Card>

      <UploadDocumentModal
        onClose={() => setIsUploadModalOpen(false)}
        open={isUploadModalOpen}
      />
    </>
  );
}

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
  console.log("id", id);
  caseDocuments = [];
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Case Documents</CardTitle>
              <CardDescription>
                Upload and manage all case-related documents
              </CardDescription>
            </div>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {caseDocuments.length > 0 ? (
            <div className="grid gap-4">
              {caseDocuments.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50"
                >
                  {/* Left: Icon + Document Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{d.document.name}</h4>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>{d.document.type}</span>
                        <span>
                          Uploaded {new Date(d.createdAt).toLocaleDateString()}
                        </span>
                        <span>by {d.clientId ? "Client" : "Lawyer"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(d.document.url, "_blank")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
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
            <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
              No documents uploaded yet.
            </div>
          )}
        </CardContent>
      </Card>

      <UploadDocumentModal
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={() => {}}
        open={isUploadModalOpen}
      />
    </>
  );
}

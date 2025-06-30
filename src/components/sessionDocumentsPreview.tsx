import { XCircle } from "lucide-react";
import { Button } from "./ui/button";

interface sessionDocumentsPreviewProps {
  url: string;
  type: string;
  name: string;
  id: number | string;
  onRemoveFile?(payload: string | number): void;
}

export function SessionDocumentsPreview({
  id,
  onRemoveFile,
  type,
  url,
  name,
}: sessionDocumentsPreviewProps) {
  return (
    <div
      key={id}
      className="flex flex-col bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg max-w-xs"
    >
      <div className="flex justify-between items-center mb-1">
        <span className="truncate max-w-[150px]">{name}</span>
        {onRemoveFile && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 p-0 h-4 w-4"
            onClick={() => {
              if (onRemoveFile) {
                onRemoveFile(id);
              }
            }}
          >
            <XCircle className="h-4 w-4 text-red-500" />
          </Button>
        )}
      </div>

      {/* preview */}
      {type.startsWith("image/") || type === "image" ? (
        <div
          onClick={() => window.open(url, "_blank")}
          className="cursor-pointer"
        >
          <img
            src={url}
            alt="Preview"
            className="rounded w-full max-h-40 object-cover"
          />
        </div>
      ) : type === "application/pdf" || type === "pdf" ? (
        <div
          onClick={() => window.open(url, "_blank")}
          className="cursor-pointer"
        >
          <iframe
            src={url}
            className="w-full h-40 rounded border pointer-events-none"
            title="PDF Preview"
          />
        </div>
      ) : name.endsWith(".doc") || name.endsWith(".docx") ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline text-xs mt-1"
        >
          Open {name}
        </a>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline text-xs mt-1"
        >
          Open document
        </a>
      )}
    </div>
  );
}

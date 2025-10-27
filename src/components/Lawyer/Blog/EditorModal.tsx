import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BlogType } from "@/types/types/BlogType";
import { Loader2 } from "lucide-react";

interface EditorModalProps {
  blog: BlogType | null;
  onSave: (data: {
    title: string;
    content: string;
    coverImage?: File | string;
    isDraft: boolean;
  }) => Promise<void> | void;
  onClose: () => void;
}

export function EditorModal({ blog, onSave, onClose }: EditorModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | undefined>(
    undefined
  );
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [isDraft, setIsDraft] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
      setCoverImagePreview(blog.coverImage || "");
      setIsDraft(!blog.isPublished);
    } else {
      setTitle("");
      setContent("");
      setCoverImageFile(undefined);
      setCoverImagePreview("");
      setIsDraft(true);
    }
    setOpen(true);
  }, [blog]);
  useEffect(() => {
    return () => {
      if (coverImagePreview && coverImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverImagePreview);
      }
    };
  }, [coverImagePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    setCoverImageFile(file);
    setCoverImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in title and content");
      return;
    }

    try {
      setIsSaving(true);
      const imageToSend = coverImageFile
        ? coverImageFile
        : (blog?.coverImage as string | undefined);

      await onSave({
        title,
        content,
        coverImage: imageToSend,
        isDraft,
      });
      onClose();
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && !isSaving) {
      // Clean up object URLs to prevent memory leaks
      if (coverImagePreview && coverImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverImagePreview);
      }
      setOpen(false);
      // Delay the actual close callback to allow Dialog to cleanup aria-hidden
      setTimeout(() => {
        onClose();
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal={true}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {blog ? "Edit Article" : "Create New Article"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title..."
              className="text-base"
              disabled={isSaving}
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cover Image
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isSaving}
            />

            {coverImagePreview && (
              <div className="mt-3 rounded-lg overflow-hidden h-40 bg-muted">
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-foreground">
                Content
              </label>
            </div>

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here..."
              className="min-h-64 resize-none"
              disabled={isSaving}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>

            <div className="flex gap-2">
              <Button
                variant={isDraft ? "default" : "outline"}
                onClick={() => setIsDraft(true)}
                disabled={isSaving}
              >
                Save as Draft
              </Button>
              <Button
                variant={!isDraft ? "default" : "outline"}
                onClick={() => setIsDraft(false)}
                disabled={isSaving}
              >
                Publish
              </Button>
            </div>

            <Button
              onClick={handleSave}
              className="sm:ml-2 flex items-center gap-2"
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : blog ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

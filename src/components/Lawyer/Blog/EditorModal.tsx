import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BlogType } from "@/types/types/BlogType";

interface EditorModalProps {
  blog: BlogType | null;
  onSave: (data: {
    title: string;
    content: string;
    coverImage?: string;
    tags: string[];
    isDraft: boolean;
  }) => void;
  onClose: () => void;
}

export function EditorModal({ blog, onSave, onClose }: EditorModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [isDraft, setIsDraft] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
      setCoverImage(blog.coverImage || "");
      setIsDraft(!blog.isPublished);
    }
  }, [blog]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in title and content");
      return;
    }
    onSave({
      title,
      content,
      coverImage: coverImage || undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isDraft,
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {blog ? "Edit Article" : "Create New Article"}
          </DialogTitle>
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
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cover Image URL
            </label>
            <Input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              type="url"
            />
            {coverImage && (
              <div className="mt-3 rounded-lg overflow-hidden h-40 bg-muted">
                <img
                  src={coverImage || "/placeholder.svg"}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags (comma-separated)
            </label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., contract law, business, tips"
            />
          </div>

          {/* Content */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-foreground">
                Content
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? "Edit" : "Preview"}
              </Button>
            </div>
            {showPreview ? (
              <div className="rounded-lg border border-border bg-card p-4 min-h-64 prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm text-foreground">
                  {content}
                </div>
              </div>
            ) : (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here..."
                className="min-h-64 resize-none"
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                variant={isDraft ? "default" : "outline"}
                onClick={() => setIsDraft(true)}
              >
                Save as Draft
              </Button>
              <Button
                variant={!isDraft ? "default" : "outline"}
                onClick={() => setIsDraft(false)}
              >
                Publish
              </Button>
            </div>
            <Button onClick={handleSave} className="sm:ml-2">
              {blog ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

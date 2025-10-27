import { Heart, MessageCircle, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BlogType } from "@/types/types/BlogType";
import { formatDate } from "@/utils/utils";

interface BlogCardProps {
  blog: BlogType;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
}

export function BlogCard({
  blog,
  onEdit,
  onDelete,
  onTogglePublish,
}: BlogCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-sm transition-all duration-300 hover:border-border hover:shadow-md hover:bg-card backdrop-blur-sm">
      {/* Thumbnail */}
      {blog.coverImage && (
        <div className="relative h-40 w-full overflow-hidden bg-muted">
          <img
            src={blog.coverImage || "/placeholder.svg"}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Badge & Menu */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
              blog.isPublished
                ? "bg-green-100/80 text-green-700"
                : "bg-amber-100/80 text-amber-700"
            }`}
          >
            {blog.isPublished ? "Published" : "Draft"}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={onTogglePublish}>
                {blog.isPublished ? "Unpublish" : "Publish"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground">
          {blog.title}
        </h3>

        {/* Preview */}
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {blog.content?.substring(0, 100)}...
        </p>

        {/* Dates */}
        <div className="mb-4 flex flex-col gap-1 text-xs text-muted-foreground">
          <div>Created {formatDate(new Date(blog.createdAt))}</div>
          {blog.updatedAt !== blog.createdAt && (
            <div>Updated {formatDate(new Date(blog.updatedAt))}</div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 border-t border-border/30 pt-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span>{blog.likes.length}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{blog.comments.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

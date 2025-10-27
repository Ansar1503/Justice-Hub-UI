import { useState } from "react";
import { Search, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlogType } from "@/types/types/BlogType";
import { BlogCard } from "./BlogCard";

interface BlogDashboardProps {
  blogs: BlogType[];
  onCreateNew: () => void;
  onEdit: (blog: BlogType) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string) => void;
}

type SortOption =
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc"
  | "likes"
  | "comments";
type FilterOption = "all" | "published" | "draft";

export function BlogDashboard({
  blogs,
  onCreateNew,
  onEdit,
  onDelete,
  onTogglePublish,
}: BlogDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");

  const handleFilterChange = (newFilter: FilterOption) => {
    setFilterBy(newFilter);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-foreground md:text-4xl">
              Your Articles
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage and publish your legal insights
            </p>
          </div>
          <Button
            onClick={onCreateNew}
            className="w-full gap-2 md:w-auto"
            size="lg"
          >
            <Plus className="h-4 w-4" />
            New Article
          </Button>
        </div>

        {/* Search */}
        <div className="mb-8 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1">
              <Button
                variant={filterBy === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("all")}
                className="text-xs"
              >
                All
              </Button>
              <Button
                variant={filterBy === "published" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("published")}
                className="text-xs"
              >
                Published
              </Button>
              <Button
                variant={filterBy === "draft" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("draft")}
                className="text-xs"
              >
                Draft
              </Button>
            </div>
          </div>

          <div className="relative inline-block">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground pr-8 cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="likes">Most Liked</option>
              <option value="comments">Most Comments</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
          </div>
        </div>

        {/* Blog Grid */}
        {blogs.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onEdit={() => onEdit(blog)}
                  onDelete={() => onDelete(blog.id)}
                  onTogglePublish={() => onTogglePublish(blog.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-border/50 bg-card/50 p-12 text-center backdrop-blur-sm">
            <p className="text-muted-foreground">
              {searchQuery
                ? "No articles match your search"
                : "No articles yet. Create your first one to get started."}
            </p>
            {!searchQuery && (
              <Button
                onClick={onCreateNew}
                variant="outline"
                className="mt-4 bg-transparent"
              >
                Create Article
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

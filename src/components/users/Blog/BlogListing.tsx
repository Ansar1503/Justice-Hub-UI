import { useState, useMemo } from "react";
import SearchComponent from "@/components/SearchComponent";
import { SelectComponent } from "@/components/SelectComponent";
import { FeaturedBlogCard } from "./FeaturedBlogCard";
import { BlogCard } from "./BlogCard";
import { useInfiniteFetchBlogsForClients } from "@/store/tanstack/infiniteQuery";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type sortByType = "newest" | "most-liked" | "most-commented";

export function BlogListingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<sortByType>("newest");
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteFetchBlogsForClients({
    search: searchQuery,
    sortBy,
  });

  const blogs = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const featuredBlog = blogs[0];
  const remainingBlogs = blogs.slice(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground">Legal Insights</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Expert articles on law, business, and compliance
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <SearchComponent
            searchTerm={searchQuery}
            setSearchTerm={setSearchQuery}
            placeholder="Search for blog titles or terms..."
          />
          <SelectComponent
            onSelect={(val) => setSortBy(val as sortByType)}
            values={["newest", "most-liked", "most-commented"]}
            selectedValue={sortBy}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="py-12 text-center text-red-500">
            Failed to load blogs. Please try again later.
          </div>
        )}

        {/* Content */}
        {!isLoading && !isError && (
          <>
            {featuredBlog && (
              <div className="mb-12">
                <FeaturedBlogCard blog={featuredBlog} />
              </div>
            )}

            {remainingBlogs.length > 0 ? (
              <div className="space-y-8">
                {remainingBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-lg text-muted-foreground">
                  No articles found matching your criteria.
                </p>
              </div>
            )}

            {/* Load More */}
            {hasNextPage && (
              <div className="mt-12 flex justify-center">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="flex items-center gap-2"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading more...
                    </>
                  ) : (
                    "Load More Articles"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

import { useState, useMemo } from "react";
import SearchComponent from "@/components/SearchComponent";
import { SelectComponent } from "@/components/SelectComponent";
import { FeaturedBlogCard } from "./FeaturedBlogCard";
import { BlogCard } from "./BlogCard";
import { useInfiniteFetchBlogsForClients } from "@/store/tanstack/infiniteQuery";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

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
    <div className="min-h-screen">
      {/* Hero Header with Gradient */}
      <header className="relative overflow-hidden bg-gradient-hero border-b border-border/50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] opacity-40"></div>

        <div className="relative mx-auto  px-6 py-16 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-6 w-6 text-accent-gold animate-pulse" />
            <span className="text-accent-gold font-semibold text-sm uppercase tracking-wider">
              Expert Legal Insights
            </span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Legal Knowledge Hub
          </h1>
          <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
            Stay informed with expert articles on law, business compliance, and
            industry best practices
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-6 py-12 sm:px-8 lg:px-12">
        {/* Filters Section */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6 bg-card rounded-2xl shadow-md border border-border/50">
          <div className="flex-1">
            <SearchComponent
              searchTerm={searchQuery}
              setSearchTerm={setSearchQuery}
              placeholder="Search articles by title or topic..."
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Sort by:
            </span>
            <SelectComponent
              onSelect={(val) => setSortBy(val as sortByType)}
              values={["newest", "most-liked", "most-commented"]}
              selectedValue={sortBy}
              className="w-[200px]"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading insights...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Unable to Load Articles
            </h3>
            <p className="text-muted-foreground">
              Please try again later or contact support if the issue persists.
            </p>
          </div>
        )}

        {/* Content */}
        {!isLoading && !isError && (
          <div className="space-y-12">
            {/* Featured Article */}
            {featuredBlog && (
              <div className="animate-fade-in-up">
                <div className="mb-6 flex items-center gap-2">
                  <div className="h-1 w-12 bg-gradient-accent rounded-full"></div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Featured Article
                  </h2>
                </div>
                <FeaturedBlogCard blog={featuredBlog} />
              </div>
            )}

            {/* Blog Grid */}
            {remainingBlogs.length > 0 ? (
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <div className="h-1 w-12 bg-primary/20 rounded-full"></div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Latest Articles
                  </h2>
                </div>
                <div className="space-y-6">
                  {remainingBlogs.map((blog, index) => (
                    <div
                      key={blog.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <BlogCard blog={blog} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                  <span className="text-4xl">📄</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Articles Found
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We couldn't find any articles matching your criteria. Try
                  adjusting your search or filters.
                </p>
              </div>
            )}

            {/* Load More Button */}
            {hasNextPage && (
              <div className="mt-16 flex justify-center">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  size="lg"
                  className="group relative overflow-hidden bg-primary hover:bg-primary-light transition-all duration-300 shadow-md hover:shadow-lg px-8"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading More...
                    </>
                  ) : (
                    <>
                      Load More Articles
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

import { ArrowLeft, Heart } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NavLink, useParams } from "react-router-dom";
import { useFetchBlogDetailsById } from "@/store/tanstack/Queries/BlogQuery";
import { BlogCard } from "./BlogCard";
import { useToggleBlogLikeMutation } from "@/store/tanstack/mutations/BlogMutations";
import { useAppSelector } from "@/store/redux/Hook";

export function BlogDetailPage() {
  const { id } = useParams();
  const { user } = useAppSelector((s) => s.Auth);
  const { data: blog } = useFetchBlogDetailsById(id);
  const isLiked = blog?.likes.some((like) => like.userId === user?.user_id);
  const { mutateAsync: toggleLike } = useToggleBlogLikeMutation();
  const handleToggleLike = async () => {
    if (!user?.user_id) return;
    try {
      await toggleLike(id!);
    } catch (error) {
      console.log("tooggle like error", error);
    }
  };

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <NavLink
            to="/client/blogs"
            className="mb-8 inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </NavLink>
          <p className="text-lg text-muted-foreground">Article not found.</p>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto  px-4 py-6 sm:px-6 lg:px-8">
          <NavLink
            to="/client/blogs"
            className="mb-4 inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </NavLink>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto  px-4 py-12 sm:px-6 lg:px-8">
        {/* Article Header */}
        <article>
          {/* Cover Image */}
          {blog.coverImage && (
            <div className="mb-8 overflow-hidden rounded-lg">
              <img
                src={blog.coverImage || "/placeholder.svg"}
                alt={blog.title}
                className="h-96 w-full object-cover"
              />
            </div>
          )}

          {/* Title and Meta */}
          <div className="mb-8">
            <h1 className="mb-4 text-4xl font-bold text-foreground">
              {blog.title}
            </h1>
            <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
              {/* Author Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={blog.lawyerDetails.profile_image || "/placeholder.svg"}
                    alt={blog.lawyerDetails.name}
                  />
                  <AvatarFallback>
                    {blog.lawyerDetails.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">
                    {blog.lawyerDetails.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formattedDate}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleLike()}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                    isLiked
                      ? "bg-primary text-primary-foreground"
                      : "border border-border hover:bg-muted"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                  />
                  <span>{blog.likes.length}</span>
                </button>
                {/* <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-muted">
                  <MessageCircle className="h-4 w-4" />
                  <span>{blog.comments.length}</span>
                </button> */}
                {/* <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-muted">
                  <Share2 className="h-4 w-4" />
                </button> */}
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-sm max-w-none text-foreground">
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              {blog.content}
            </p>
          </div>

          {/* Comments Section */}
          {/* {blog.comments.length > 0 && (
            <div className="my-12 border-t border-border pt-8">
              <h3 className="mb-6 text-2xl font-semibold text-foreground">
                Comments ({blog.comments.length})
              </h3>
              <div className="space-y-6">
                {blog.comments.map((comment) => (
                  <div
                    key={`${comment.userId}-${comment.createdAt}`}
                    className="flex gap-4"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={comment.profile_image || "/placeholder.svg"}
                        alt={comment.name}
                      />
                      <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">
                          {comment.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="mt-2 text-muted-foreground">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </article>

        {/* Related Articles */}
        {blog?.relatedBlogs?.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <h2 className="mb-8 text-3xl font-bold text-foreground">
              Related Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blog.relatedBlogs?.map((relatedBlog) => (
                <NavLink key={relatedBlog.id} to={`/client/blogs/${relatedBlog.id}`}>
                  <BlogCard blog={relatedBlog} />
                </NavLink>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

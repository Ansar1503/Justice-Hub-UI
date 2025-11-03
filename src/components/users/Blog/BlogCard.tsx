import { Heart, MessageCircle, ArrowRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NavLink } from "react-router-dom";
import { FetchedBlogByClient } from "@/types/types/BlogType";

interface BlogCardProps {
  blog: FetchedBlogByClient;
}

export function BlogCard({ blog }: BlogCardProps) {
  const excerpt = blog.content.substring(0, 150) + "...";
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="group cursor-pointer border-b border-border pb-8 transition-all hover:pl-4">
      <div className="flex gap-6">
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
            <img
              src={blog.coverImage || "/placeholder.svg"}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between">
          {/* Title and Excerpt */}
          <div>
            <h3 className="mb-2 text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {blog.title}
            </h3>
            <p className="mb-4 text-muted-foreground line-clamp-2">{excerpt}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Author Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={blog.lawyerDetails.profile_image || "/placeholder.svg"}
                  alt={blog.lawyerDetails.name}
                />
                <AvatarFallback>
                  {blog.lawyerDetails.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  {blog.lawyerDetails.name}
                </p>
                <p className="text-xs text-muted-foreground">{formattedDate}</p>
              </div>
            </div>

            {/* Stats and CTA */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{blog.likes.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{blog.comments.length}</span>
                </div>
              </div>
              <NavLink
                to={`/blog/${blog.id}`}
                className="flex items-center gap-1 text-primary hover:gap-2 transition-all"
                aria-label="Read more"
              >
                <span className="text-sm font-medium">Read More</span>
                <ArrowRight className="h-4 w-4" />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

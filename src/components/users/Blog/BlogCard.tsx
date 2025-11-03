import { Heart,  ArrowRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NavLink } from "react-router-dom";
import { FetchedBlogByClient } from "@/types/types/BlogType";
import { Badge } from "@/components/ui/badge";

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
    <article className="group relative overflow-hidden rounded-xl bg-card border border-border/50 shadow-md hover:shadow-lg transition-all duration-300 hover-lift">
      <div className="flex flex-col sm:flex-row gap-0">
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="relative sm:w-80 h-56 sm:h-auto flex-shrink-0 overflow-hidden">
            <img
              src={blog.coverImage || "/placeholder.svg"}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-card/80 to-transparent"></div>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-6 lg:p-8">
          <div>
            {/* Meta Info */}
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="secondary" className="text-xs font-medium">
                Article
              </Badge>
            </div>

            {/* Title */}
            <h3 className="mb-3 text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {blog.title}
            </h3>

            {/* Excerpt */}
            <p className="mb-4 text-muted-foreground leading-relaxed line-clamp-2 lg:line-clamp-3">
              {excerpt}
            </p>
          </div>

          {/* Footer */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            {/* Author Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-border">
                <AvatarImage
                  src={blog.lawyerDetails.profile_image || "/placeholder.svg"}
                  alt={blog.lawyerDetails.name}
                />
                <AvatarFallback className="bg-muted text-foreground text-sm">
                  {blog.lawyerDetails.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">
                  {blog.lawyerDetails.name}
                </p>
                <p className="text-xs text-muted-foreground">{formattedDate}</p>
              </div>
            </div>

            {/* Stats and CTA */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span className="font-medium">{blog.likes.length}</span>
                </div>
                {/* <div className="flex items-center gap-1.5 text-sm text-muted-foreground ">
                  <MessageCircle className="h-4 w-4" />
                  <span className="font-medium">{blog.comments.length}</span>
                </div> */}
              </div>

              <NavLink
                to={`/client/blogs/${blog.id}`}
                className="group/link inline-flex items-center gap-2 text-primary hover:text-primary-light font-semibold text-sm transition-all hover:gap-3"
                aria-label="Read article"
              >
                <span>Read More</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

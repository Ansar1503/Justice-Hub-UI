import { Heart, MessageCircle, ArrowRight, Clock } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NavLink } from "react-router-dom";
import { FetchedBlogByClient } from "@/types/types/BlogType";
import { Badge } from "@/components/ui/badge";

interface FeaturedBlogCardProps {
  blog: FetchedBlogByClient;
}

export function FeaturedBlogCard({ blog }: FeaturedBlogCardProps) {
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-hover transition-all duration-500 hover-lift">
      <div className="grid lg:grid-cols-2 gap-0">
        {/* Featured Image */}
        {blog.coverImage && (
          <div className="relative h-[400px] lg:h-full overflow-hidden">
            <img
              src={blog.coverImage || "/placeholder.svg"}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:bg-gradient-to-r"></div>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col justify-between p-8 lg:p-12">
          <div>
            {/* Category/Reading Time */}
            <div className="flex items-center gap-3 mb-4">
              <Badge
                variant="outline"
                className="border-primary/20 text-primary bg-primary-lighter"
              >
                Legal Insights
              </Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />5 min read
              </span>
            </div>

            {/* Title */}
            <h2 className="mb-4 text-3xl lg:text-4xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors duration-300">
              {blog.title}
            </h2>

            {/* Excerpt */}
            <p className="mb-6 text-lg text-muted-foreground leading-relaxed line-clamp-3">
              {blog.content}
            </p>
          </div>

          {/* Footer */}
          <div className="space-y-6">
            {/* Author Info */}
            <div className="flex items-center gap-4 pb-6 border-b border-border/50">
              <Avatar className="h-14 w-14 ring-2 ring-primary/10">
                <AvatarImage
                  src={blog.lawyerDetails.profile_image || "/placeholder.svg"}
                  alt={blog.lawyerDetails.name}
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {blog.lawyerDetails.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground text-lg">
                  {blog.lawyerDetails.name}
                </p>
                <p className="text-sm text-muted-foreground">{formattedDate}</p>
              </div>
            </div>

            {/* Stats and CTA */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  <Heart className="h-5 w-5" />
                  <span className="font-medium">{blog.likes.length}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-medium">{blog.comments.length}</span>
                </div>
              </div>

              <NavLink
                to={`/blog/${blog.id}`}
                className="group/link inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-primary-foreground rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:gap-3"
                aria-label="Read full article"
              >
                <span>Read Article</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover/link:translate-x-1" />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

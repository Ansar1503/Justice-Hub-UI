import { Heart, MessageCircle, ArrowRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NavLink } from "react-router-dom";
import { FetchedBlogByClient } from "@/types/types/BlogType";

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
    <article className="group cursor-pointer">
      {/* Featured Image */}
      {blog.coverImage && (
        <div className="relative mb-6 h-96 w-full overflow-hidden rounded-lg bg-muted">
          <img
            src={blog.coverImage || "/placeholder.svg"}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div>
        {/* Title */}
        <h2 className="mb-4 text-4xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
          {blog.title}
        </h2>

        {/* Excerpt */}
        <p className="mb-6 text-lg text-muted-foreground line-clamp-3">
          {blog.content}
        </p>

        {/* Author and Meta */}
        <div className="flex items-center justify-between border-t border-border pt-6">
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
              <p className="font-medium text-foreground">
                {blog.lawyerDetails.name}
              </p>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
          </div>

          {/* Stats and CTA */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
              className="flex items-center gap-2 text-primary hover:gap-3 transition-all"
              aria-label="Read more"
            >
              <span className="font-medium">Read More</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </NavLink>
          </div>
        </div>
      </div>
    </article>
  );
}

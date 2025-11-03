import { useState } from "react";
import { ArrowLeft, Heart, MessageCircle, Share2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NavLink } from "react-router-dom";
import { FetchedBlogByClient } from "@/types/types/BlogType";

const MOCK_BLOGS: FetchedBlogByClient[] = [
  {
    id: "1",
    title:
      "Understanding Contract Law: Essential Principles for Business Owners",
    content:
      "Contract law is the foundation of business relationships. In this comprehensive guide, we explore the essential principles that every business owner should understand. From offer and acceptance to consideration and breach of contract, we break down the complex concepts into digestible insights. Learn how to protect your business interests through well-drafted contracts and understand your rights and obligations. Whether you're entering into a partnership agreement, vendor contract, or employment agreement, understanding these fundamentals will help you navigate the legal landscape with confidence.",
    coverImage: "/contract-law-office.jpg",
    isPublished: true,
    lawyerDetails: {
      name: "Sarah Mitchell",
      profile_image: "/professional-woman-lawyer.jpg",
    },
    likes: [
      {
        userId: "1",
        name: "John Doe",
        profile_image: "/abstract-geometric-shapes.png",
      },
      {
        userId: "2",
        name: "Jane Smith",
        profile_image: "/abstract-geometric-shapes.png",
      },
    ],
    comments: [
      {
        userId: "1",
        name: "John Doe",
        profile_image: "/abstract-geometric-shapes.png",
        comment: "Very informative article!",
        createdAt: new Date("2025-10-20"),
      },
    ],
    createdAt: new Date("2025-10-15"),
    updatedAt: new Date("2025-10-15"),
  },
  {
    id: "2",
    title: "Intellectual Property Rights: Protecting Your Innovation",
    content:
      "Learn how to safeguard your intellectual property in today's digital world. This article covers patents, trademarks, copyrights, and trade secrets.",
    coverImage: "/intellectual-property.jpg",
    isPublished: true,
    lawyerDetails: {
      name: "Michael Chen",
      profile_image: "/professional-man-lawyer.jpg",
    },
    likes: [
      {
        userId: "3",
        name: "Alice Johnson",
        profile_image: "/abstract-geometric-shapes.png",
      },
    ],
    comments: [
      {
        userId: "3",
        name: "Alice Johnson",
        profile_image: "/abstract-geometric-shapes.png",
        comment: "Excellent breakdown of IP law.",
        createdAt: new Date("2025-10-18"),
      },
    ],
    createdAt: new Date("2025-10-10"),
    updatedAt: new Date("2025-10-10"),
  },
  {
    id: "3",
    title: "Employment Law Updates: What You Need to Know in 2025",
    content:
      "Stay updated with the latest employment law changes and regulations.",
    coverImage: "/employment-law.jpg",
    isPublished: true,
    lawyerDetails: {
      name: "Emily Rodriguez",
      profile_image: "/professional-woman-lawyer.jpg",
    },
    likes: [
      {
        userId: "4",
        name: "Bob Wilson",
        profile_image: "/abstract-geometric-shapes.png",
      },
      {
        userId: "5",
        name: "Carol Davis",
        profile_image: "/abstract-geometric-shapes.png",
      },
      {
        userId: "6",
        name: "David Brown",
        profile_image: "/abstract-geometric-shapes.png",
      },
    ],
    comments: [],
    createdAt: new Date("2025-10-05"),
    updatedAt: new Date("2025-10-05"),
  },
  {
    id: "4",
    title: "Real Estate Transactions: A Step-by-Step Guide",
    content:
      "Navigate the complexities of real estate law with our comprehensive guide.",
    coverImage: "/real-estate-law.jpg",
    isPublished: true,
    lawyerDetails: {
      name: "James Patterson",
      profile_image: "/professional-man-lawyer.jpg",
    },
    likes: [],
    comments: [],
    createdAt: new Date("2025-09-28"),
    updatedAt: new Date("2025-09-28"),
  },
  {
    id: "5",
    title: "Tax Planning Strategies for Small Businesses",
    content:
      "Optimize your tax situation with expert advice from our tax law specialists.",
    coverImage: "/tax-planning.jpg",
    isPublished: true,
    lawyerDetails: {
      name: "Sarah Mitchell",
      profile_image: "/professional-woman-lawyer.jpg",
    },
    likes: [
      {
        userId: "7",
        name: "Eve Martinez",
        profile_image: "/abstract-geometric-shapes.png",
      },
    ],
    comments: [],
    createdAt: new Date("2025-09-20"),
    updatedAt: new Date("2025-09-20"),
  },
  {
    id: "6",
    title: "Family Law Essentials: Divorce and Custody",
    content:
      "Understanding your rights in family law matters with expert guidance.",
    coverImage: "/family-law.jpg",
    isPublished: true,
    lawyerDetails: {
      name: "Jennifer Lee",
      profile_image: "/professional-woman-lawyer.jpg",
    },
    likes: [
      {
        userId: "8",
        name: "Frank Thompson",
        profile_image: "/abstract-geometric-shapes.png",
      },
      {
        userId: "9",
        name: "Grace White",
        profile_image: "/abstract-geometric-shapes.png",
      },
    ],
    comments: [
      {
        userId: "8",
        name: "Frank Thompson",
        profile_image: "/abstract-geometric-shapes.png",
        comment: "This helped me understand the process better.",
        createdAt: new Date("2025-09-22"),
      },
    ],
    createdAt: new Date("2025-09-15"),
    updatedAt: new Date("2025-09-15"),
  },
];

interface BlogDetailPageProps {
  blogId: string;
}

export function BlogDetailPage({ blogId }: BlogDetailPageProps) {
  const blog = MOCK_BLOGS.find((b) => b.id === blogId);
  const [isLiked, setIsLiked] = useState(false);

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <NavLink
            to="/"
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

  //   const relatedArticles = MOCK_BLOGS.filter(
  //     (b) =>
  //       b.id !== blog.id &&
  //       (b.lawyerDetails.name === blog.lawyerDetails.name ||
  //         b.title.split(" ").some((word) => blog.title.includes(word)))
  //   ).slice(0, 3);

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <NavLink
            to="/"
            className="mb-4 inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </NavLink>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
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
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                    isLiked
                      ? "bg-primary text-primary-foreground"
                      : "border border-border hover:bg-muted"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                  />
                  <span>{blog.likes.length + (isLiked ? 1 : 0)}</span>
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-muted">
                  <MessageCircle className="h-4 w-4" />
                  <span>{blog.comments.length}</span>
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-muted">
                  <Share2 className="h-4 w-4" />
                </button>
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
          {blog.comments.length > 0 && (
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
          )}
        </article>

        {/* Related Articles */}
        {/* {relatedArticles.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <h2 className="mb-8 text-3xl font-bold text-foreground">
              Related Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((relatedBlog) => (
                <NavLink key={relatedBlog.id} to={`/blog/${relatedBlog.id}`}>
                  <BlogCard blog={relatedBlog} />
                </NavLink>
              ))}
            </div>
          </section>
        )} */}
      </main>
    </div>
  );
}

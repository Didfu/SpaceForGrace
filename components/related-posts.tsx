import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BlogCard } from "@/components/blog-card";
import type { BlogPost } from "@/lib/notion";

interface RelatedPostsProps {
  posts?: BlogPost[];
}

export function RelatedPosts({ posts = [] }: RelatedPostsProps) {
  if (!posts.length) return null;

  return (
    <section className="py-12 border-t">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Some more thoughts</h2>
          <Link href="/" className="flex items-center text-sm font-medium text-black hover:underline">
            View all posts
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

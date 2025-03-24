import { notFound } from "next/navigation";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/notion";
import { BlogPost } from "@/components/blog-post";
import { RelatedPosts } from "@/components/related-posts";
import { BackButton } from "@/components/ui/BackButton"; // ✅ Import BackButton

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(decodeURIComponent(params.slug));

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedBlogPosts(post.id);

  return (
    <div className="container mx-auto px-4 max-w-4xl py-8">
      {/* 🔙 Back Button (Client Component) */}
      <BackButton />

      {/* Blog Post */}
      <BlogPost post={post} />

      {/* Related Posts */}
      <RelatedPosts posts={relatedPosts} />
    </div>
  );
}

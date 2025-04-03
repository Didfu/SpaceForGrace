import { notFound } from "next/navigation";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/notion";
import { BlogPost } from "@/components/blog-post";
import { RelatedPosts } from "@/components/related-posts";
import { BackButton } from "@/components/ui/BackButton";
import { ShareButton } from "@/components/ui/ShareButton"; // ✅ Import ShareButton
import { Metadata } from "next";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(decodeURIComponent(params.slug));

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: `Read ${post.title} to know more.`,
    openGraph: {
      title: post.title,
      description: `Read ${post.title} to know more.`,
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630 }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: `Read ${post.title} to know more.`,
      images: post.coverImage ? [post.coverImage] : [],
    },
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
      <div className="flex justify-between items-center mb-4">
        {/* 🔙 Back Button */}
        <BackButton />

        {/* 📤 Share Button */}
        <ShareButton
          title={post.title}
          url={typeof window !== "undefined" ? window.location.href : ""}
          image={post.coverImage} // Pass the cover image
          type="article"          // Specify the type as "article"
        />
      </div>

      {/* Blog Post */}
      <BlogPost post={post} />

      {/* Related Posts */}
      <RelatedPosts posts={relatedPosts} />
    </div>
  );
}
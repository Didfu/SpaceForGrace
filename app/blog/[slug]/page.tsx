import { notFound } from "next/navigation";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/notion";
import { BlogPost } from "@/components/blog-post";
import { RelatedPosts } from "@/components/related-posts";
import { BackButton } from "@/components/ui/BackButton"; // ✅ Import BackButton
import Head from 'next/head'; // ✅ Import Head

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
      <Head>
        <title>{post.title}</title>
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.coverImage} />
        <meta property="og:url" content={`https://spaceforgrace.vercel.app/blog/${params.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.coverImage} />
      </Head>

      {/* 🔙 Back Button (Client Component) */}
      <BackButton />

      {/* Blog Post */}
      <BlogPost post={post} />

      {/* Related Posts */}
      <RelatedPosts posts={relatedPosts} />
    </div>
  );
}
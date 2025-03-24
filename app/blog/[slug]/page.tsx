import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/notion';
import { BlogPost } from '@/components/blog-post';
import { RelatedPosts } from '@/components/related-posts';

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
    <div>
      <BlogPost post={post} />
      <RelatedPosts posts={relatedPosts} />
    </div>
  );
}

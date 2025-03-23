import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/lib/notion';
import { BlogPost } from '@/components/blog-post';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
}
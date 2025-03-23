import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon } from 'lucide-react';
import Image from 'next/image';

interface BlogPostProps {
  post: {
    id: string;
    title: string;
    content: any[];
    categories?: string[];
    coverImage?: string;
    excerpt?: string;
    author?: {
      name: string;
      avatar: string;
    };
    date?: string;
  };
}

export function BlogPost({ post }: BlogPostProps) {
  const renderBlock = (block) => {
    switch (block.type) {
      case 'paragraph':
        return <p key={block.id}>{block.paragraph.text[0]?.plain_text}</p>;
      case 'heading_2':
        return <h2 key={block.id}>{block.heading_2.text[0]?.plain_text}</h2>;
      case 'heading_3':
        return <h3 key={block.id}>{block.heading_3.text[0]?.plain_text}</h3>;
      case 'bulleted_list_item':
        return <li key={block.id}>{block.bulleted_list_item.text[0]?.plain_text}</li>;
      case 'image':
        return (
          <div key={block.id} className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={block.image.file.url}
              alt={block.image.caption[0]?.plain_text || 'Image'}
              fill
              className="object-cover"
              priority
            />
          </div>
        );
      // Add more block types as needed
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="space-y-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {post.categories?.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.author?.avatar || '/placeholder.svg'} alt={post.author?.name} />
              <AvatarFallback>{post.author?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author?.name}</p>
              <p className="text-sm text-muted-foreground">Senior Developer</p>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.coverImage && (
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={post.coverImage}
              alt="Featured image for blog post"
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {post.content.map((block) => renderBlock(block))}
        </div>
      </article>
    </div>
  );
}